# bird_tracker.py
import os
import uuid
import shutil
import json
from db import DatabaseManager # Import the class

# --- Configuration ---
DATABASE_NAME = 'bird_sightings.db'
IMAGE_FOLDER = 'bird_images' # Folder to store sighting images

class BirdSightingManager:
    def __init__(self, db_name=DATABASE_NAME, image_folder=IMAGE_FOLDER):
        self.db_manager = DatabaseManager(db_name)
        self.image_folder = image_folder
        self._initialize()

    def _initialize(self):
        """Connect to DB, create image folder, and set up tables."""
        try:
            self.db_manager.connect()
            # Create image directory if it doesn't exist
            os.makedirs(self.image_folder, exist_ok=True)
            print(f"Image storage directory: '{self.image_folder}'")
            self._create_tables()
        except Exception as e:
            print(f"Error during initialization: {e}")
            # Consider how to handle initialization failure (e.g., exit)

    def _create_tables(self):
        """Define and create the necessary database tables."""
        # Users table: Store unique usernames
        self.db_manager.create_table(
            'users',
            '''
            user_id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE
            '''
        )
        # Bird Species table: Store unique bird names
        self.db_manager.create_table(
            'bird_species',
            '''
            species_id INTEGER PRIMARY KEY AUTOINCREMENT,
            species_name TEXT NOT NULL UNIQUE
            '''
        )
        # Sightings table: Link user, species, and sighting details
        self.db_manager.create_table(
            'sightings',
            '''
            sighting_id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            species_id INTEGER NOT NULL,
            image_uuid TEXT NOT NULL UNIQUE,
            image_path TEXT NOT NULL,
            rating INTEGER,
            description TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (user_id),
            FOREIGN KEY (species_id) REFERENCES bird_species (species_id)
            '''
        )

    def _get_or_create_user(self, username):
        """Find existing user ID or create a new user."""
        user_id = self.db_manager.get_single_value(
            "SELECT user_id FROM users WHERE username = ?", (username,)
        )
        if user_id is None:
            print(f"User '{username}' not found, creating new user.")
            # Use insert_data which handles the before_write hook (though basic here)
            user_id = self.db_manager.insert_data('users', {'username': username})
            if user_id:
                print(f"Created user '{username}' with ID: {user_id}")
            else:
                 print(f"Failed to create user '{username}'") # Should not happen if UNIQUE constraint works
                 return None # Indicate failure
        return user_id

    def _get_or_create_species(self, species_name):
        """Find existing species ID or create a new species."""
        # Standardize species name (e.g., lowercase) before lookup/insert
        species_name_std = species_name.strip().lower()
        if not species_name_std:
             print("Error: Species name cannot be empty.")
             return None

        species_id = self.db_manager.get_single_value(
            "SELECT species_id FROM bird_species WHERE species_name = ?", (species_name_std,)
        )
        if species_id is None:
            print(f"Species '{species_name_std}' not found, creating new species.")
            species_id = self.db_manager.insert_data('bird_species', {'species_name': species_name_std})
            if species_id:
                print(f"Created species '{species_name_std}' with ID: {species_id}")
            else:
                print(f"Failed to create species '{species_name_std}'")
                return None # Indicate failure
        return species_id

    # --- HOOK for storing bird/item (Image saving logic) ---
    def _save_sighting_image(self, source_image_path):
        """Generates UUID, creates destination path, and copies the image."""
        if not os.path.exists(source_image_path):
            print(f"Error: Source image file not found at '{source_image_path}'")
            return None, None # Return None for both uuid and path

        _, extension = os.path.splitext(source_image_path)
        image_uuid = str(uuid.uuid4())
        destination_filename = f"{image_uuid}{extension}"
        destination_path = os.path.join(self.image_folder, destination_filename)

        try:
            shutil.copy2(source_image_path, destination_path) # copy2 preserves metadata
            print(f"Image copied to: {destination_path}")
            return image_uuid, destination_path
        except IOError as e:
            print(f"Error copying image from '{source_image_path}' to '{destination_path}': {e}")
            return None, None # Return None on failure

    def add_sighting(self, username, species_name, source_image_path, rating, description):
        """Adds a new bird sighting record, including saving the image."""
        print(f"\n--- Adding Sighting ---")
        print(f"User: {username}, Species: {species_name}, Image: {source_image_path}")

        # 1. Get/Create User and Species IDs
        user_id = self._get_or_create_user(username)
        species_id = self._get_or_create_species(species_name)

        if user_id is None or species_id is None:
            print("Error: Could not obtain valid user or species ID. Aborting sighting.")
            return False

        # 2. Save the image using the hook-like method
        image_uuid, saved_image_path = self._save_sighting_image(source_image_path)

        if image_uuid is None or saved_image_path is None:
            print("Error: Failed to save sighting image. Aborting sighting.")
            return False

        # 3. Prepare data for sightings table
        sighting_data = {
            'user_id': user_id,
            'species_id': species_id,
            'image_uuid': image_uuid,
            'image_path': saved_image_path, # Store the path where it was saved
            'rating': rating,
            'description': description
        }

        # 4. Insert sighting data into the database
        sighting_id = self.db_manager.insert_data('sightings', sighting_data)

        if sighting_id:
            print(f"Successfully added sighting ID: {sighting_id}")
            print("--- Sighting Added ---")
            return True
        else:
            print("Error: Failed to insert sighting record into database.")
            # Optional: Clean up the saved image if DB insert fails?
            # try:
            #     os.remove(saved_image_path)
            #     print(f"Cleaned up image file: {saved_image_path}")
            # except OSError as e:
            #     print(f"Error cleaning up image file: {e}")
            print("--- Sighting Failed ---")
            return False

    # --- HOOK for getting birds (Data aggregation for export) ---
    def _aggregate_sightings_for_user(self, username):
        """Fetches and structures sighting data for a specific user."""
        print(f"\nAggregating sightings for user '{username}'...")
        user_id = self.db_manager.get_single_value(
            "SELECT user_id FROM users WHERE username = ?", (username,)
        )
        if user_id is None:
            print(f"User '{username}' not found for export.")
            return None # Return None if user doesn't exist

        # Query to get sightings joined with species name for the user
        query = """
            SELECT
                bs.species_name,
                s.image_path,
                s.rating,
                s.description,
                s.timestamp
            FROM sightings s
            JOIN users u ON s.user_id = u.user_id
            JOIN bird_species bs ON s.species_id = bs.species_id
            WHERE u.user_id = ?
            ORDER BY bs.species_name, s.timestamp DESC
        """
        # Use the base read_data which applies after_read hook (though basic here)
        # Fetch specific columns needed for the JSON structure
        rows = self.db_manager.read_data(
            table_name="sightings s JOIN users u ON s.user_id = u.user_id JOIN bird_species bs ON s.species_id = bs.species_id",
            columns="bs.species_name, s.image_path, s.rating, s.description, s.timestamp",
            condition="u.user_id = ?",
            params=(user_id,)
        )

        if rows is None:
            print(f"Error reading sightings for user '{username}'.")
            return None
        if not rows:
            print(f"No sightings found for user '{username}'.")
            return {} # Return empty dict for no sightings

        # Structure the data as requested: {species_name: [list_of_sightings]}
        user_bird_data = {}
        for row in rows:
            species_name, image_path, rating, description, timestamp = row
            sighting_details = {
                "uri": image_path, # Using image_path as URI
                "rating": rating,
                "description": description,
                "timestamp": timestamp
            }
            if species_name not in user_bird_data:
                user_bird_data[species_name] = []
            user_bird_data[species_name].append(sighting_details)

        print(f"Aggregation complete for user '{username}'. Found {len(rows)} sightings across {len(user_bird_data)} species.")
        return user_bird_data

    # --- Export Function ---
    def export_user_sightings_to_json(self, username, output_filename="user_sightings.json"):
        """Exports a user's bird sightings to a JSON file."""
        user_data = self._aggregate_sightings_for_user(username)

        if user_data is None:
            print(f"Cannot export data for user '{username}'. User not found or error occurred.")
            return False

        # Add the username to the final JSON structure if desired
        export_data = {
             "username": username,
             "birds": user_data
        }

        try:
            with open(output_filename, 'w', encoding='utf-8') as f:
                json.dump(export_data, f, indent=4, ensure_ascii=False) # indent for readability
            print(f"Successfully exported sightings for user '{username}' to '{output_filename}'")
            return True
        except IOError as e:
            print(f"Error writing JSON file '{output_filename}': {e}")
            return False
        except TypeError as e:
             print(f"Error serializing data to JSON: {e}")
             return False


    def close_connection(self):
        """Closes the database connection via the manager."""
        self.db_manager.close()

# === Example Usage ===
if __name__ == "__main__":
    print("--- Starting Bird Sighting Tracker ---")

    # Create dummy image files for testing if they don't exist
    dummy_files = ["bluejay_img.jpg", "crow_img.jpg", "robin_img.png"]
    for fname in dummy_files:
        if not os.path.exists(fname):
            try:
                with open(fname, "w") as f:
                    f.write(f"This is a dummy image file for {fname}")
                print(f"Created dummy file: {fname}")
            except IOError:
                 print(f"Could not create dummy file: {fname}")


    # Initialize the manager
    tracker = BirdSightingManager()

    # Add some sightings
    tracker.add_sighting("Alice", "Blue Jay", "bluejay_img.jpg", 4, "Vibrant blue, very active.")
    tracker.add_sighting("Alice", "Crow", "crow_img.jpg", 3, "Standard crow, watching from a distance.")
    tracker.add_sighting("Bob", "Robin", "robin_img.png", 5, "Classic red breast, pulling a worm!")
    tracker.add_sighting("Alice", "Blue Jay", "bluejay_img.jpg", 5, "Another sighting, closer this time.") # Same user, same bird, different sighting

    # Print table contents for verification
    tracker.db_manager.print_table_contents("users")
    tracker.db_manager.print_table_contents("bird_species")
    tracker.db_manager.print_table_contents("sightings")

    # Export Alice's sightings to JSON
    output_json_file = f"alice_bird_report.json"
    tracker.export_user_sightings_to_json("Alice", output_json_file)

    # Export Bob's sightings to JSON
    output_json_file_bob = f"bob_bird_report.json"
    tracker.export_user_sightings_to_json("Bob", output_json_file_bob)

    # Export non-existent user
    tracker.export_user_sightings_to_json("Charlie", "charlie_bird_report.json")

    # Close the database connection
    tracker.close_connection()

    print("\n--- Bird Sighting Tracker Finished ---")
