import React from 'react';
import PropTypes from 'prop-types';
import './DexScreen.css';

const items = [
  {
    name: "Acadian Flycatcher",
    date: "",
    seen: true,
    image: ""
  },
  {
    name: "American Crow",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "American Goldfinch",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "American Pipit",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "American Redstart",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "American Three-toed Woodpecker",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Anna Hummingbird",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Artic Tern",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Baird Sparrow",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Baltimore Oriole",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Bank Swallow",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Barn Swallow",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Bay-breasted Warbler",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Belted Kingfisher",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Bewick Wren",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Black Tern",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Black-and-white Warbler",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Black-billed Cuckoo",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Black-capped Vireo",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Black-footed Albatross",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Black-throated Blue Warbler",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Black-throated Sparrow",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Blue Grosbeak",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Blue Jay",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Blue-headed Vireo",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Blue-winged Warbler",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Boat-tailed Grackle",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Bobolink",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Bohemian Waxwing",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Brandt Cormorant",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Brewer Blackbird",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Brewer Sparrow",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Bronzed Cowbird",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Brown Creeper",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Brown Pelican",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Brown Thrasher",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Cactus Wren",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "California Gull",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Canada Warbler",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Cape Glossy Starling",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Cape May Warbler",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Cardinal",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Carolina Wren",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Caspian Tern",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Cedar Waxwing",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Cerulean Warbler",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Chestnut-sided Warbler",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Chipping Sparrow",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Chuck-will Widow",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Clark Nutcracker",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Clay-colored Sparrow",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Cliff Swallow",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Common Raven",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Common Tern",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Common Yellowthroat",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Crested Auklet",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Dark-eyed Junco",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Downy Woodpecker",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Eared Grebe",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Eastern Towhee",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Elegant Tern",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "European Goldfinch",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Evening Grosbeak",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Field Sparrow",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Fish Crow",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Florida Jay",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Forsters Tern",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Fox Sparrow",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Frigatebird",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Gadwall",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Geococcyx",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Glaucous-winged Gull",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Golden-winged Warbler",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Grasshopper Sparrow",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Gray Catbird",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Gray Kingbird",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Gray-crowned Rosy Finch",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Great Crested Flycatcher",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Great Grey Shrike",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Green Jay",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Green Kingfisher",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Green Violetear",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Green-tailed Towhee",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Groove-billed Ani",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Harris Sparrow",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Heermann Gull",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Henslow Sparrow",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Herring Gull",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Hooded Merganser",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Hooded Oriole",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Hooded Warbler",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Horned Grebe",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Horned Lark",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Horned Puffin",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "House Sparrow",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "House Wren",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Indigo Bunting",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Ivory Gull",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Kentucky Warbler",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Laysan Albatross",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Lazuli Bunting",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Le Conte Sparrow",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Least Auklet",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Least Flycatcher",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Least Tern",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Lincoln Sparrow",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Loggerhead Shrike",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Long-tailed Jaeger",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Louisiana Waterthrush",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Magnolia Warbler",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Mallard",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Mangrove Cuckoo",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Marsh Wren",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Mockingbird",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Mourning Warbler",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Myrtle Warbler",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Nashville Warbler",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Nelson Sharp-tailed Sparrow",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Nighthawk",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Northern Flicker",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Northern Fulmar",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Northern Waterthrush",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Olive-sided Flycatcher",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Orange-crowned Warbler",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Orchard Oriole",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Ovenbird",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Pacific Loon",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Painted Bunting",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Palm Warbler",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Parakeet Auklet",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Pelagic Cormorant",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Philadelphia Vireo",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Pied Kingfisher",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Pied-billed Grebe",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Pigeon Guillemot",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Pileated Woodpecker",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Pine Grosbeak",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Pine Warbler",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Pomarine Jaeger",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Prairie Warbler",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Prothonotary Warbler",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Purple Finch",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Red-bellied Woodpecker",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Red-breasted Merganser",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Red-cockaded Woodpecker",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Red-eyed Vireo",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Red-faced Cormorant",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Red-headed Woodpecker",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Red-legged Kittiwake",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Red-winged Blackbird",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Rhinoceros Auklet",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Ring-billed Gull",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Ringed Kingfisher",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Rock Wren",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Rose-breasted Grosbeak",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Ruby-throated Hummingbird",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Rufous Hummingbird",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Rusty Blackbird",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Sage Thrasher",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Savannah Sparrow",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Sayornis",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Scarlet Tanager",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Scissor-tailed Flycatcher",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Scott Oriole",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Seaside Sparrow",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Shiny Cowbird",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Slaty-backed Gull",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Song Sparrow",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Sooty Albatross",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Spotted Catbird",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Summer Tanager",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Swainson Warbler",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Tennessee Warbler",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Tree Sparrow",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Tree Swallow",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Tropical Kingbird",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Vermilion Flycatcher",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Vesper Sparrow",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Warbling Vireo",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Western Grebe",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Western Gull",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Western Meadowlark",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Western Wood Pewee",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Whip-poor-will",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "White Pelican",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "White-breasted Kingfisher",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "White-breasted Nuthatch",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "White-crowned Sparrow",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "White-eyed Vireo",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "White-necked Raven",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "White-throated Sparrow",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Wilson Warbler",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Winter Wren",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Worm-eating Warbler",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Yellow Warbler",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Yellow-bellied Flycatcher",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Yellow-billed Cuckoo",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Yellow-breasted Chat",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Yellow-headed Blackbird",
    date: "",
    seen: false,
    image: ""
  },
  {
    name: "Yellow-throated Vireo",
    date: "",
    seen: false,
    image: ""
  }
  // Add more objects here
];

function DexScreen() {
  return (
    <div id="dexHolder" className="">
      {items.map((item, index) => (
        <div
          key={index}
          className={`polaroid dexItem ${item.seen ? "seen" : "unseen"}`
          }
          style={{
            transform: `rotate(${Math.floor(-10+Math.random()*20)}deg)`
          }}
        >
          <img
            src={item.seen ? "../src/assets/unseen.png" : "assets/unseen.png"}
            alt={item.name}
            className={item.seen ? "../src/assets/unseen.png" : "placeholder"}
          />
          <h3 className="font-bold text-lg">{item.name}</h3>
          <p className="text-sm text-gray-600">{item.date}</p>
        </div>
      ))
      }
    </div >
  );
}

// MapScreen.propTypes = {};

// MapScreen.defaultProps = {};

export default DexScreen;
