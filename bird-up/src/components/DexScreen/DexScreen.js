import React from 'react';
import PropTypes from 'prop-types';
import './DexScreen.css';

const items = [
  {
    name: "Abercrombie",
    date: "2025-04-10",
    seen: true,
    image: "https://via.placeholder.com/150"
  },
  {
    name: "Barreleye",
    date: "2025-04-11",
    seen: false,
    image: "https://via.placeholder.com/150"
  }, {
    name: "Cardinal",
    date: "2025-04-11",
    seen: false,
    image: "https://via.placeholder.com/150"
  }, {
    name: "Dove",
    date: "2025-04-11",
    seen: false,
    image: "https://via.placeholder.com/150"
  }, {
    name: "Eagle",
    date: "2025-04-11",
    seen: false,
    image: "https://via.placeholder.com/150"
  },
  // Add more objects here
];

function DexScreen() {
  return (
    <div id="dexHolder" className="">
      {items.map((item, index) => (
        <div
          key={index}
          className={`dexItem ${item.seen ? "seen" : "unseen"
            }`}
        >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-2/3 object-cover"
            />
            <h3 className="font-bold text-lg">{item.name}</h3>
            <p className="text-sm text-gray-600">{item.date}</p>
        </div>
      ))}
    </div>
  );
}

// MapScreen.propTypes = {};

// MapScreen.defaultProps = {};

export default DexScreen;
