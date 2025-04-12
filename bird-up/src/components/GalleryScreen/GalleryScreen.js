import React, { useState } from "react";
import './GalleryScreen.css';

const birdData = [
  { imgSrc: "https://via.placeholder.com/150", date: "2025-04-10", birdName: "Blue Jay" },
  { imgSrc: "https://via.placeholder.com/150", date: "2025-04-10", birdName: "Robin" },
  { imgSrc: "https://via.placeholder.com/150", date: "2025-04-11", birdName: "Cardinal" },
  { imgSrc: "https://via.placeholder.com/150", date: "2025-04-12", birdName: "Hawk" },
  { imgSrc: "https://via.placeholder.com/150", date: "2025-04-11", birdName: "Robin" },
];

const groupableFields = ["date", "birdName"];

const BirdGallery = ({ data = birdData }) => {
  const [groupBy, setGroupBy] = useState("date");

  const handleGroupChange = (e) => {
    setGroupBy(e.target.value);
  };

  // Group data dynamically
  const groupedData = data.reduce((acc, item) => {
    const key = item[groupBy];
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  return (
    <div className="p-4 space-y-8">
      <div className="mb-4">
        <label className="mr-2 font-semibold text-gray-700">Group by:</label>
        <select
          value={groupBy}
          onChange={handleGroupChange}
          className="border rounded px-2 py-1"
        >
          {groupableFields.map((field) => (
            <option key={field} value={field}>
              {field}
            </option>
          ))}
        </select>
      </div>

      {Object.entries(groupedData).map(([group, birds]) => (
        <div key={group}>
          <h2 className="text-xl font-bold mb-2">{group}</h2>
          <div className="flex flex-wrap gap-4">
            {birds.map((bird, index) => (
              <div
                key={index}
                className="w-48 h-32 bg-blue-100 border border-blue-300 rounded-md flex flex-col items-center justify-center shadow-sm"
              >
                <img
                  src={bird.imgSrc}
                  alt={bird.birdName}
                  className="w-full h-20 object-cover rounded-t-md"
                />
                <span className="mt-1 text-sm font-medium">{bird.birdName}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
    // <div>
    //   Hi
    // </div>
  );
};

export default BirdGallery;