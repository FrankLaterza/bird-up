import React, { useState, useEffect } from "react";
import './GalleryScreen.css';

const GalleryScreen = () => {
  const [birdData, setBirdData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showGallery, setShowGallery] = useState(false);

  useEffect(() => {
    const fetchBirdData = async () => {
      try {
        const response = await fetch('https://birdup-backend.ngrok.app/api/get-gallery-data');
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        // Transform the data into a flat array of bird images
        const allBirds = [];
        
        Object.entries(data.birds).forEach(([species, sightings]) => {
          sightings.forEach(sighting => {
            allBirds.push({
              imageUrl: `https://birdup-backend.ngrok.app/${sighting.uri}`
            });
          });
        });
        
        setBirdData(allBirds);
        // Auto-show the gallery once data is loaded
        setShowGallery(true);
      } catch (err) {
        console.error("Error fetching bird data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBirdData();
  }, []);

  // Calculate rows (3 items per row)
  const getRows = () => {
    const rows = [];
    for (let i = 0; i < birdData.length; i += 3) {
      rows.push(birdData.slice(i, i + 3));
    }
    return rows;
  };
  
  // Close the gallery overlay
  const closeGallery = () => {
    setShowGallery(false);
  };

  if (!showGallery) {
    return null;
  }

  return (
    <div className="gallery-overlay">
      <div className="gallery-modal">
        <div className="gallery-header">
          <h2>Bird Gallery</h2>
          <button 
            className="close-button" 
            onClick={closeGallery}
            aria-label="Close gallery"
          >
            ×
          </button>
        </div>
        
        <div className="gallery-content">
          {loading ? (
            <div className="loading-indicator">Loading birds...</div>
          ) : (
            <div className="gallery-grid">
              {getRows().map((row, rowIndex) => (
                <div key={rowIndex} className="gallery-row">
                  {row.map((bird, birdIndex) => (
                    <div key={`${rowIndex}-${birdIndex}`} className="gallery-item">
                      <img 
                        src={bird.imageUrl} 
                        alt="Bird"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/150x150?text=Image";
                        }}
                      />
                    </div>
                  ))}
                  {/* Fill empty spaces to maintain 3 per row */}
                  {Array(3 - row.length).fill().map((_, i) => (
                    <div key={`empty-${i}`} className="gallery-item empty"></div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GalleryScreen;
