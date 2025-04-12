# Save this code as db_manager.py
import sqlite3

class DatabaseManager:
    def __init__(self, db_name):
        self.db_name = db_name
        self.conn = None
        self.cursor = None
        print(f"Initializing DatabaseManager for '{self.db_name}'") # Added for clarity

    def connect(self):
        """Establishes a connection to the SQLite database."""
        try:
            self.conn = sqlite3.connect(self.db_name)
            # Use Row factory for dictionary-like access later if needed
            # self.conn.row_factory = sqlite3.Row
            self.cursor = self.conn.cursor()
            print(f"Database connection to '{self.db_name}' established.")
        except sqlite3.Error as e:
            print(f"Error connecting to database '{self.db_name}': {e}")
            raise # Re-raise the exception so the caller knows connection failed

    def close(self):
        """Closes the database connection."""
        if self.conn:
            db_name_ref = self.db_name # Store db_name before clearing references
            self.conn.close()
            self.conn = None
            self.cursor = None
            print(f"Database connection to '{db_name_ref}' closed.")
        # else:
        #     print("No active database connection to close.") # Optional: less verbose

    def _execute_query(self, query, params=None, commit=False):
        """Helper method to execute queries with error handling."""
        if not self.cursor:
            print("Error: No database connection.")
            # Or raise an exception: raise ConnectionError("Database not connected.")
            return None # Or False, depending on desired return type

        try:
            if params:
                self.cursor.execute(query, params)
            else:
                self.cursor.execute(query)

            if commit:
                self.conn.commit()
            return True # Indicate success
        except sqlite3.Error as e:
            print(f"Error executing query: {e}\nQuery: {query}\nParams: {params}")
            if commit:
                try:
                    self.conn.rollback()
                    print("Transaction rolled back.")
                except sqlite3.Error as rb_e:
                    print(f"Error during rollback: {rb_e}")
            return False # Indicate failure

    def create_table(self, table_name, columns_definition):
        """Creates a table if it doesn't exist."""
        print(f"Attempting to create table '{table_name}'...")
        sql = f"CREATE TABLE IF NOT EXISTS {table_name} ({columns_definition})"
        if self._execute_query(sql, commit=True):
             print(f"Table '{table_name}' checked/created successfully.")
        # Error message handled in _execute_query

    def insert_data(self, table_name, data):
        """Inserts a single row of data after applying the before_write hook."""
        # --- Apply write hook ---
        processed_data = self.before_write(data)

        columns = ', '.join(processed_data.keys())
        placeholders = ', '.join(['?' for _ in processed_data])
        values = tuple(processed_data.values())

        sql = f"INSERT INTO {table_name} ({columns}) VALUES ({placeholders})"

        print(f"Attempting to insert into '{table_name}': {processed_data}")
        if self._execute_query(sql, params=values, commit=True):
             print(f"Data inserted successfully into '{table_name}'.")
             # Return the last inserted row id, might be useful
             return self.cursor.lastrowid
        else:
            # Error message handled in _execute_query
            return None

    def read_data(self, table_name, columns="*", condition=None, params=None):
        """Reads data, optionally applying a condition, and runs the after_read hook."""
        if not self.cursor:
            print("Error: No database connection.")
            return None

        sql = f"SELECT {columns} FROM {table_name}"
        if condition:
            sql += f" WHERE {condition}"

        print(f"Reading data from '{table_name}' with condition '{condition}'...")
        try:
            if params:
                 self.cursor.execute(sql, params)
            else:
                 self.cursor.execute(sql)

            # Get column names *before* fetching results
            column_names = [desc[0] for desc in self.cursor.description] if self.cursor.description else []

            rows = self.cursor.fetchall() # Fetch all results

            # --- Apply read hook ---
            processed_rows = self.after_read(rows, column_names) # Pass column names to hook

            return processed_rows # Return processed (or original) rows
        except sqlite3.Error as e:
            print(f"Error reading data: {e}\nQuery: {sql}\nParams: {params}")
            return None

    # --- Hooks ---
    def before_write(self, data):
        """Hook executed before writing data. Modify data as needed."""
        # print("Executing before_write hook...") # Keep if verbose logging needed
        # Example: Convert specific string values to uppercase
        modified_data = {}
        for key, value in data.items():
             # Keep this simple unless specific pre-processing is needed globally
             modified_data[key] = value
        return modified_data

    def after_read(self, rows, column_names):
        """Hook executed after reading data. Process the rows as needed."""
        # print("Executing after_read hook...") # Keep if verbose logging needed
        # Example: Just return rows. Could be used for logging, transformation, etc.
        # if rows:
        #     print(f"  Read {len(rows)} row(s). Columns: {', '.join(column_names)}")
        return rows

    # --- Utility ---
    def print_table_contents(self, table_name):
        """Prints all data currently in the specified table."""
        if not self.cursor:
            print("Error: No database connection. Call connect() first.")
            return

        print(f"\n--- Contents of table '{table_name}' ---")
        try:
            self.cursor.execute(f"SELECT * FROM {table_name}")
            rows = self.cursor.fetchall()

            column_names = [description[0] for description in self.cursor.description] if self.cursor.description else []

            if not rows:
                print("(Table is empty)")
            else:
                header = " | ".join(column_names)
                print(header)
                print("-" * (len(header) + 2)) # Adjust separator length

                for row in rows:
                    print(" | ".join(map(str, row)))

            print(f"--- End of '{table_name}' contents ---")

        except sqlite3.Error as e:
            print(f"Error printing table '{table_name}': {e}")

    def get_single_value(self, query, params=None):
        """Executes a query expected to return a single value (e.g., an ID)."""
        if not self.cursor:
            print("Error: No database connection.")
            return None
        try:
            if params:
                self.cursor.execute(query, params)
            else:
                self.cursor.execute(query)
            result = self.cursor.fetchone()
            return result[0] if result else None
        except sqlite3.Error as e:
            print(f"Error getting single value: {e}\nQuery: {query}\nParams: {params}")
            return None


