import PropTypes from 'prop-types';
import './DexScreen.css';
import { useState, useEffect } from "react";

function DexScreen() {

    const [items, setItems] = useState({
        "Acadian Flycatcher": { name: "Acadian Flycatcher", date: "", seen: false, image: "" },
        "American Crow": { name: "American Crow", date: "", seen: false, image: "" },
        "American Goldfinch": { name: "American Goldfinch", date: "", seen: false, image: "" },
        "American Pipit": { name: "American Pipit", date: "", seen: false, image: "" },
        "American Redstart": { name: "American Redstart", date: "", seen: false, image: "" },
        "American Three Toed Woodpecker": { name: "American Three-toed Woodpecker", date: "", seen: false, image: "" },
        "Anna Hummingbird": { name: "Anna Hummingbird", date: "", seen: false, image: "" },
        "Artic Tern": { name: "Artic Tern", date: "", seen: false, image: "" },
        "Baird Sparrow": { name: "Baird Sparrow", date: "", seen: false, image: "" },
        "Baltimore Oriole": { name: "Baltimore Oriole", date: "", seen: false, image: "" },
        "Bank Swallow": { name: "Bank Swallow", date: "", seen: false, image: "" },
        "Barn Swallow": { name: "Barn Swallow", date: "", seen: false, image: "" },
        "Bay Breasted Warbler": { name: "Bay-breasted Warbler", date: "", seen: false, image: "" },
        "Belted Kingfisher": { name: "Belted Kingfisher", date: "", seen: false, image: "" },
        "Bewick Wren": { name: "Bewick Wren", date: "", seen: false, image: "" },
        "Black Tern": { name: "Black Tern", date: "", seen: false, image: "" },
        "Black And White Warbler": { name: "Black-and-white Warbler", date: "", seen: false, image: "" },
        "Black Billed Cuckoo": { name: "Black-billed Cuckoo", date: "", seen: false, image: "" },
        "Black Capped Vireo": { name: "Black-capped Vireo", date: "", seen: false, image: "" },
        "Black Footed Albatross": { name: "Black-footed Albatross", date: "", seen: false, image: "" },
        "Black Throated Blue Warbler": { name: "Black-throated Blue Warbler", date: "", seen: false, image: "" },
        "Black Throated Sparrow": { name: "Black-throated Sparrow", date: "", seen: false, image: "" },
        "Blue Grosbeak": { name: "Blue Grosbeak", date: "", seen: false, image: "" },
        "Blue Jay": { name: "Blue Jay", date: "", seen: false, image: "" },
        "Blue Headed Vireo": { name: "Blue-headed Vireo", date: "", seen: false, image: "" },
        "Blue Winged Warbler": { name: "Blue-winged Warbler", date: "", seen: false, image: "" },
        "Boat Tailed Grackle": { name: "Boat-tailed Grackle", date: "", seen: false, image: "" },
        "Bobolink": { name: "Bobolink", date: "", seen: false, image: "" },
        "Bohemian Waxwing": { name: "Bohemian Waxwing", date: "", seen: false, image: "" },
        "Brandt Cormorant": { name: "Brandt Cormorant", date: "", seen: false, image: "" },
        "Brewer Blackbird": { name: "Brewer Blackbird", date: "", seen: false, image: "" },
        "Brewer Sparrow": { name: "Brewer Sparrow", date: "", seen: false, image: "" },
        "Bronzed Cowbird": { name: "Bronzed Cowbird", date: "", seen: false, image: "" },
        "Brown Creeper": { name: "Brown Creeper", date: "", seen: false, image: "" },
        "Brown Pelican": { name: "Brown Pelican", date: "", seen: false, image: "" },
        "Brown Thrasher": { name: "Brown Thrasher", date: "", seen: false, image: "" },
        "Cactus Wren": { name: "Cactus Wren", date: "", seen: false, image: "" },
        "California Gull": { name: "California Gull", date: "", seen: false, image: "" },
        "Canada Warbler": { name: "Canada Warbler", date: "", seen: false, image: "" },
        "Cape Glossy Starling": { name: "Cape Glossy Starling", date: "", seen: false, image: "" },
        "Cape May Warbler": { name: "Cape May Warbler", date: "", seen: false, image: "" },
        "Cardinal": { name: "Cardinal", date: "", seen: false, image: "" },
        "Carolina Wren": { name: "Carolina Wren", date: "", seen: false, image: "" },
        "Caspian Tern": { name: "Caspian Tern", date: "", seen: false, image: "" },
        "Cedar Waxwing": { name: "Cedar Waxwing", date: "", seen: false, image: "" },
        "Cerulean Warbler": { name: "Cerulean Warbler", date: "", seen: false, image: "" },
        "Chestnut Sided Warbler": { name: "Chestnut-sided Warbler", date: "", seen: false, image: "" },
        "Chipping Sparrow": { name: "Chipping Sparrow", date: "", seen: false, image: "" },
        "Chuck Will Widow": { name: "Chuck-will Widow", date: "", seen: false, image: "" },
        "Clark Nutcracker": { name: "Clark Nutcracker", date: "", seen: false, image: "" },
        "Clay Colored Sparrow": { name: "Clay-colored Sparrow", date: "", seen: false, image: "" },
        "Cliff Swallow": { name: "Cliff Swallow", date: "", seen: false, image: "" },
        "Common Raven": { name: "Common Raven", date: "", seen: false, image: "" },
        "Common Tern": { name: "Common Tern", date: "", seen: false, image: "" },
        "Common Yellowthroat": { name: "Common Yellowthroat", date: "", seen: false, image: "" },
        "Crested Auklet": { name: "Crested Auklet", date: "", seen: false, image: "" },
        "Dark Eyed Junco": { name: "Dark-eyed Junco", date: "", seen: false, image: "" },
        "Downy Woodpecker": { name: "Downy Woodpecker", date: "", seen: false, image: "" },
        "Eared Grebe": { name: "Eared Grebe", date: "", seen: false, image: "" },
        "Eastern Towhee": { name: "Eastern Towhee", date: "", seen: false, image: "" },
        "Elegant Tern": { name: "Elegant Tern", date: "", seen: false, image: "" },
        "European Goldfinch": { name: "European Goldfinch", date: "", seen: false, image: "" },
        "Evening Grosbeak": { name: "Evening Grosbeak", date: "", seen: false, image: "" },
        "Field Sparrow": { name: "Field Sparrow", date: "", seen: false, image: "" },
        "Fish Crow": { name: "Fish Crow", date: "", seen: false, image: "" },
        "Florida Jay": { name: "Florida Jay", date: "", seen: false, image: "" },
        "Forsters Tern": { name: "Forsters Tern", date: "", seen: false, image: "" },
        "Fox Sparrow": { name: "Fox Sparrow", date: "", seen: false, image: "" },
        "Frigatebird": { name: "Frigatebird", date: "", seen: false, image: "" },
        "Gadwall": { name: "Gadwall", date: "", seen: false, image: "" },
        "Geococcyx": { name: "Geococcyx", date: "", seen: false, image: "" },
        "Glaucous Winged Gull": { name: "Glaucous-winged Gull", date: "", seen: false, image: "" },
        "Golden Winged Warbler": { name: "Golden-winged Warbler", date: "", seen: false, image: "" },
        "Grasshopper Sparrow": { name: "Grasshopper Sparrow", date: "", seen: false, image: "" },
        "Gray Catbird": { name: "Gray Catbird", date: "", seen: false, image: "" },
        "Gray Kingbird": { name: "Gray Kingbird", date: "", seen: false, image: "" },
        "Gray Crowned Rosy Finch": { name: "Gray-crowned Rosy Finch", date: "", seen: false, image: "" },
        "Great Crested Flycatcher": { name: "Great Crested Flycatcher", date: "", seen: false, image: "" },
        "Great Grey Shrike": { name: "Great Grey Shrike", date: "", seen: false, image: "" },
        "Green Jay": { name: "Green Jay", date: "", seen: false, image: "" },
        "Green Kingfisher": { name: "Green Kingfisher", date: "", seen: false, image: "" },
        "Green Violetear": { name: "Green Violetear", date: "", seen: false, image: "" },
        "Green Tailed Towhee": { name: "Green-tailed Towhee", date: "", seen: false, image: "" },
        "Groove Billed Ani": { name: "Groove-billed Ani", date: "", seen: false, image: "" },
        "Harris Sparrow": { name: "Harris Sparrow", date: "", seen: false, image: "" },
        "Heermann Gull": { name: "Heermann Gull", date: "", seen: false, image: "" },
        "Henslow Sparrow": { name: "Henslow Sparrow", date: "", seen: false, image: "" },
        "Herring Gull": { name: "Herring Gull", date: "", seen: false, image: "" },
        "Hooded Merganser": { name: "Hooded Merganser", date: "", seen: false, image: "" },
        "Hooded Oriole": { name: "Hooded Oriole", date: "", seen: false, image: "" },
        "Hooded Warbler": { name: "Hooded Warbler", date: "", seen: false, image: "" },
        "Horned Grebe": { name: "Horned Grebe", date: "", seen: false, image: "" },
        "Horned Lark": { name: "Horned Lark", date: "", seen: false, image: "" },
        "Horned Puffin": { name: "Horned Puffin", date: "", seen: false, image: "" },
        "House Sparrow": { name: "House Sparrow", date: "", seen: false, image: "" },
        "House Wren": { name: "House Wren", date: "", seen: false, image: "" },
        "Indigo Bunting": { name: "Indigo Bunting", date: "", seen: false, image: "" },
        "Ivory Gull": { name: "Ivory Gull", date: "", seen: false, image: "" },
        "Kentucky Warbler": { name: "Kentucky Warbler", date: "", seen: false, image: "" },
        "Laysan Albatross": { name: "Laysan Albatross", date: "", seen: false, image: "" },
        "Lazuli Bunting": { name: "Lazuli Bunting", date: "", seen: false, image: "" },
        "Le Conte Sparrow": { name: "Le Conte Sparrow", date: "", seen: false, image: "" },
        "Least Auklet": { name: "Least Auklet", date: "", seen: false, image: "" },
        "Least Flycatcher": { name: "Least Flycatcher", date: "", seen: false, image: "" },
        "Least Tern": { name: "Least Tern", date: "", seen: false, image: "" },
        "Lincoln Sparrow": { name: "Lincoln Sparrow", date: "", seen: false, image: "" },
        "Loggerhead Shrike": { name: "Loggerhead Shrike", date: "", seen: false, image: "" },
        "Long Tailed Jaeger": { name: "Long-tailed Jaeger", date: "", seen: false, image: "" },
        "Louisiana Waterthrush": { name: "Louisiana Waterthrush", date: "", seen: false, image: "" },
        "Magnolia Warbler": { name: "Magnolia Warbler", date: "", seen: false, image: "" },
        "Mallard": { name: "Mallard", date: "", seen: false, image: "" },
        "Mangrove Cuckoo": { name: "Mangrove Cuckoo", date: "", seen: false, image: "" },
        "Marsh Wren": { name: "Marsh Wren", date: "", seen: false, image: "" },
        "Mockingbird": { name: "Mockingbird", date: "", seen: false, image: "" },
        "Mourning Warbler": { name: "Mourning Warbler", date: "", seen: false, image: "" },
        "Myrtle Warbler": { name: "Myrtle Warbler", date: "", seen: false, image: "" },
        "Nashville Warbler": { name: "Nashville Warbler", date: "", seen: false, image: "" },
        "Nelson Sharp Tailed Sparrow": { name: "Nelson Sharp-tailed Sparrow", date: "", seen: false, image: "" },
        "Nighthawk": { name: "Nighthawk", date: "", seen: false, image: "" },
        "Northern Flicker": { name: "Northern Flicker", date: "", seen: false, image: "" },
        "Northern Fulmar": { name: "Northern Fulmar", date: "", seen: false, image: "" },
        "Northern Waterthrush": { name: "Northern Waterthrush", date: "", seen: false, image: "" },
        "Olive Sided Flycatcher": { name: "Olive-sided Flycatcher", date: "", seen: false, image: "" },
        "Orange Crowned Warbler": { name: "Orange-crowned Warbler", date: "", seen: false, image: "" },
        "Orchard Oriole": { name: "Orchard Oriole", date: "", seen: false, image: "" },
        "Ovenbird": { name: "Ovenbird", date: "", seen: false, image: "" },
        "Pacific Loon": { name: "Pacific Loon", date: "", seen: false, image: "" },
        "Painted Bunting": { name: "Painted Bunting", date: "", seen: false, image: "" },
        "Palm Warbler": { name: "Palm Warbler", date: "", seen: false, image: "" },
        "Parakeet Auklet": { name: "Parakeet Auklet", date: "", seen: false, image: "" },
        "Pelagic Cormorant": { name: "Pelagic Cormorant", date: "", seen: false, image: "" },
        "Philadelphia Vireo": { name: "Philadelphia Vireo", date: "", seen: false, image: "" },
        "Pied Kingfisher": { name: "Pied Kingfisher", date: "", seen: false, image: "" },
        "Pied Billed Grebe": { name: "Pied-billed Grebe", date: "", seen: false, image: "" },
        "Pigeon Guillemot": { name: "Pigeon Guillemot", date: "", seen: false, image: "" },
        "Pileated Woodpecker": { name: "Pileated Woodpecker", date: "", seen: false, image: "" },
        "Pine Grosbeak": { name: "Pine Grosbeak", date: "", seen: false, image: "" },
        "Pine Warbler": { name: "Pine Warbler", date: "", seen: false, image: "" },
        "Pomarine Jaeger": { name: "Pomarine Jaeger", date: "", seen: false, image: "" },
        "Prairie Warbler": { name: "Prairie Warbler", date: "", seen: false, image: "" },
        "Prothonotary Warbler": { name: "Prothonotary Warbler", date: "", seen: false, image: "" },
        "Purple Finch": { name: "Purple Finch", date: "", seen: false, image: "" },
        "Red Bellied Woodpecker": { name: "Red-bellied Woodpecker", date: "", seen: false, image: "" },
        "Red Breasted Merganser": { name: "Red-breasted Merganser", date: "", seen: false, image: "" },
        "Red Cockaded Woodpecker": { name: "Red-cockaded Woodpecker", date: "", seen: false, image: "" },
        "Red Eyed Vireo": { name: "Red-eyed Vireo", date: "", seen: false, image: "" },
        "Red Faced Cormorant": { name: "Red-faced Cormorant", date: "", seen: false, image: "" },
        "Red Headed Woodpecker": { name: "Red-headed Woodpecker", date: "", seen: false, image: "" },
        "Red Legged Kittiwake": { name: "Red-legged Kittiwake", date: "", seen: false, image: "" },
        "Red Winged Blackbird": { name: "Red-winged Blackbird", date: "", seen: false, image: "" },
        "Rhinoceros Auklet": { name: "Rhinoceros Auklet", date: "", seen: false, image: "" },
        "Ring Billed Gull": { name: "Ring-billed Gull", date: "", seen: false, image: "" },
        "Ringed Kingfisher": { name: "Ringed Kingfisher", date: "", seen: false, image: "" },
        "Rock Wren": { name: "Rock Wren", date: "", seen: false, image: "" },
        "Rose Breasted Grosbeak": { name: "Rose-breasted Grosbeak", date: "", seen: false, image: "" },
        "Ruby Throated Hummingbird": { name: "Ruby-throated Hummingbird", date: "", seen: false, image: "" },
        "Rufous Hummingbird": { name: "Rufous Hummingbird", date: "", seen: false, image: "" },
        "Rusty Blackbird": { name: "Rusty Blackbird", date: "", seen: false, image: "" },
        "Sage Thrasher": { name: "Sage Thrasher", date: "", seen: false, image: "" },
        "Savannah Sparrow": { name: "Savannah Sparrow", date: "", seen: false, image: "" },
        "Sayornis": { name: "Sayornis", date: "", seen: false, image: "" },
        "Scarlet Tanager": { name: "Scarlet Tanager", date: "", seen: false, image: "" },
        "Scissor Tailed Flycatcher": { name: "Scissor-tailed Flycatcher", date: "", seen: false, image: "" },
        "Scott Oriole": { name: "Scott Oriole", date: "", seen: false, image: "" },
        "Seaside Sparrow": { name: "Seaside Sparrow", date: "", seen: false, image: "" },
        "Shiny Cowbird": { name: "Shiny Cowbird", date: "", seen: false, image: "" },
        "Slaty Backed Gull": { name: "Slaty-backed Gull", date: "", seen: false, image: "" },
        "Song Sparrow": { name: "Song Sparrow", date: "", seen: false, image: "" },
        "Sooty Albatross": { name: "Sooty Albatross", date: "", seen: false, image: "" },
        "Spotted Catbird": { name: "Spotted Catbird", date: "", seen: false, image: "" },
        "Summer Tanager": { name: "Summer Tanager", date: "", seen: false, image: "" },
        "Swainson Warbler": { name: "Swainson Warbler", date: "", seen: false, image: "" },
        "Tennessee Warbler": { name: "Tennessee Warbler", date: "", seen: false, image: "" },
        "Tree Sparrow": { name: "Tree Sparrow", date: "", seen: false, image: "" },
        "Tree Swallow": { name: "Tree Swallow", date: "", seen: false, image: "" },
        "Tropical Kingbird": { name: "Tropical Kingbird", date: "", seen: false, image: "" },
        "Vermilion Flycatcher": { name: "Vermilion Flycatcher", date: "", seen: false, image: "" },
        "Vesper Sparrow": { name: "Vesper Sparrow", date: "", seen: false, image: "" },
        "Warbling Vireo": { name: "Warbling Vireo", date: "", seen: false, image: "" },
        "Western Grebe": { name: "Western Grebe", date: "", seen: false, image: "" },
        "Western Gull": { name: "Western Gull", date: "", seen: false, image: "" },
        "Western Meadowlark": { name: "Western Meadowlark", date: "", seen: false, image: "" },
        "Western Wood Pewee": { name: "Western Wood Pewee", date: "", seen: false, image: "" },
        "Whip Poor Will": { name: "Whip-poor-will", date: "", seen: false, image: "" },
        "White Pelican": { name: "White Pelican", date: "", seen: false, image: "" },
        "White Breasted Kingfisher": { name: "White-breasted Kingfisher", date: "", seen: false, image: "" },
        "White Breasted Nuthatch": { name: "White-breasted Nuthatch", date: "", seen: false, image: "" },
        "White Crowned Sparrow": { name: "White-crowned Sparrow", date: "", seen: false, image: "" },
        "White Eyed Vireo": { name: "White-eyed Vireo", date: "", seen: false, image: "" },
        "White Necked Raven": { name: "White-necked Raven", date: "", seen: false, image: "" },
        "White Throated Sparrow": { name: "White-throated Sparrow", date: "", seen: false, image: "" },
        "Wilson Warbler": { name: "Wilson Warbler", date: "", seen: false, image: "" },
        "Winter Wren": { name: "Winter Wren", date: "", seen: false, image: "" },
        "Worm Eating Warbler": { name: "Worm-eating Warbler", date: "", seen: false, image: "" },
        "Yellow Warbler": { name: "Yellow Warbler", date: "", seen: false, image: "" },
        "Yellow Bellied Flycatcher": { name: "Yellow-bellied Flycatcher", date: "", seen: false, image: "" },
        "Yellow Billed Cuckoo": { name: "Yellow-billed Cuckoo", date: "", seen: false, image: "" },
        "Yellow Breasted Chat": { name: "Yellow-breasted Chat", date: "", seen: false, image: "" },
        "Yellow Headed Blackbird": { name: "Yellow-headed Blackbird", date: "", seen: false, image: "" },
        "Yellow Throated Vireo": { name: "Yellow-throated Vireo", date: "", seen: false, image: "" },
        });


  useEffect(() => {
    const fetchBirdData = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/get-gallery-data');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Create a copy of the current items to update
        const updatedItems = { ...items };

        // Process the API response
        Object.entries(data.birds).forEach(([species, sightings]) => {
          // Transform the species name from lowercase to match the hash map keys
          let formattedName = species
            .split('.')[1] // Get the part after the dot
            .replace(/_/g, ' ') // Replace underscores with spaces
            .replace(/\b\w/g, char => char.toUpperCase()); // Capitalize first letter of each word

            console.log(species, formattedName)

          if (updatedItems[formattedName]) {
            updatedItems[formattedName].image = `http://localhost:5001/${sightings[0].uri}`;
            updatedItems[formattedName].seen = true;
          }
        });

        // Update the state with the modified items
        setItems(updatedItems);
      } catch (err) {
        console.error("Error fetching bird data:", err);
      }
    };

    fetchBirdData();
  }, []);

  return (
    <div id="dexHolder" className="">
      {Object.entries(items).map(([key, item], index) => (
        <div
          key={index}
          className={`polaroid dexItem ${item.seen ? "seen" : "unseen"}`}
          style={{
            transform: `rotate(${Math.floor(-10 + Math.random() * 20)}deg)`
          }}
        >
          <img
            src={item.seen ? item.image : "assets/unseen.png"}
            alt={item.name}
            className={item.seen ? "" : "placeholder"}
          />
          <h3 className="font-bold text-lg">{item.name}</h3>
          <p className="text-sm text-gray-600">{item.date}</p>
        </div>
      ))}
    </div>
  );
}

export default DexScreen;
