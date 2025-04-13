import React, { useState, useEffect, useRef } from "react";
import './GalleryScreen.css';
import { formatDateTime, formatSpeciesName } from './utils';

const ImageDetailCard = ({ image, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Start the appear animation after component mounts
    // Small delay to ensure DOM is ready
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 10);

    return () => clearTimeout(showTimer);
  }, []);

  // Handle closing animation
  const handleClose = () => {
    setIsClosing(true);
    // Wait for animation to complete before calling onClose
    setTimeout(() => {
      onClose();
    }, 400); // Match animation duration from CSS
  };

  // Format the timestamp nicely
  const formattedDate = formatDateTime(image.timestamp);
  // Format the species name
  const formattedSpecies = formatSpeciesName(image.species);

  return (
    <div className={`detail-overlay ${isVisible ? 'visible' : ''} ${isClosing ? 'closing' : ''}`}>
      <div className="detail-card">
        <div className="detail-header">
          <h3>{formattedSpecies}</h3>
          <button 
            className="close-button" 
            onClick={handleClose}
            aria-label="Return to gallery"
          >
            &times;
          </button>
        </div>
        
        <div className="detail-content">
          <div className="detail-image-container">
            <img 
              src={image.imageUrl} 
              alt={formattedSpecies}
              className="detail-image"
            />
          </div>
          
          <div className="detail-info">
            <div className="detail-rating">
              <span className="info-label">Photo Rating:</span>
              <div className="rating-bar">
                <div 
                  className="rating-fill" 
                  style={{ width: `${Math.min(100, image.rating)}%` }}
                ></div>
              </div>
              <span className="rating-value">{image.rating.toFixed(1)}%</span>
            </div>
            
            <div className="detail-timestamp">
              <span className="info-label">Taken:</span>
              <span className="timestamp-value">{formattedDate}</span>
            </div>
            
            <div className="detail-description">
              <span className="info-label">Description:</span>
              <div className="description-scroll">
                <p>{image.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const GalleryOverlay = ({ onClose }) => {
  const [birdData, setBirdData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const contentRef = useRef(null);

  // Animation timing effect
  useEffect(() => {
    // Start the appear animation after component mounts
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 10); // Small delay for the DOM to be ready

    return () => clearTimeout(showTimer);
  }, []);

  // Handle closing animation
  const handleClose = () => {
    setIsClosing(true);
    // Wait for animation to complete before calling onClose
    setTimeout(() => {
      onClose();
    }, 400); // Match animation duration from CSS
  };

  // Handle image selection
  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  // Return to gallery from detail view
  const closeDetailView = () => {
    setSelectedImage(null);
  };

  useEffect(() => {
    const fetchBirdData = async () => {
      try {
        // Add cache-busting query parameter to prevent caching
        const cacheBuster = Date.now();
        const response = await fetch(`https://birdup-backend.ngrok.app/api/get-gallery-data?t=${cacheBuster}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        // Transform the data into a flat array of bird images
        const allBirds = [];
        
        // Process each bird species
        Object.entries(data.birds).forEach(([species, sightings]) => {
          // For each species, add its sightings to the array
          sightings.forEach(sighting => {
            // Extract the filename from the URI
            const filename = sighting.uri.split('/').pop();
            
            allBirds.push({
              imageUrl: `https://birdup-backend.ngrok.app/${sighting.uri}?t=${cacheBuster}`,
              id: filename,
              species: species,
              rating: sighting.rating,
              description: sighting.description || "No description available",
              timestamp: sighting.timestamp
            });
          });
        });
        
        // Sort by newest first based on timestamp from the database
        allBirds.sort((a, b) => {
          // If timestamps are available, use them for sorting
          if (a.timestamp && b.timestamp) {
            return new Date(b.timestamp) - new Date(a.timestamp);
          }
          // Fallback to string comparison if timestamps aren't available
          return (b.id || '').localeCompare(a.id || '');
        });
        
        setBirdData(allBirds);
        
        // Initialize image loading states
        const initialLoadingStates = {};
        allBirds.forEach(bird => {
          initialLoadingStates[bird.id] = false;
        });
        setLoadedImages(initialLoadingStates);
      } catch (err) {
        console.error("Error fetching bird data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBirdData();
  }, []);

  // Track when an image is loaded
  const handleImageLoad = (id) => {
    setLoadedImages(prev => ({
      ...prev,
      [id]: true
    }));
  };

  // Calculate rows (3 items per row)
  const getImageGrid = () => {
    // Create rows with exactly 3 cells per row
    const rows = [];
    let currentRow = [];
    
    birdData.forEach(bird => {
      currentRow.push(bird);
      
      if (currentRow.length === 3) {
        rows.push([...currentRow]);
        currentRow = [];
      }
    });
    
    // Add the remaining items if any
    if (currentRow.length > 0) {
      // Add empty placeholders to fill the row if needed
      while (currentRow.length < 3) {
        currentRow.push(null);
      }
      rows.push(currentRow);
    }
    
    return rows;
  };

  // Determine CSS classes for animation
  const overlayClasses = `gallery-overlay ${isVisible ? 'visible' : ''} ${isClosing ? 'closing' : ''}`;

  // Instead of conditional rendering, we'll always render both the gallery and the detail view
  // The detail view will be conditionally visible based on selectedImage
  return (
    <div className={overlayClasses}>
      {/* Detail view card (conditionally visible) */}
      {selectedImage && (
        <ImageDetailCard 
          image={selectedImage} 
          onClose={closeDetailView} 
        />
      )}
      
      {/* Main gallery (always rendered) */}
      <div className="gallery-modal">
        <div className="gallery-header">
          <button 
            className="close-button" 
            onClick={handleClose}
            aria-label="Close gallery"
          >
            &times;
          </button>
        </div>
        
        <div className="gallery-content" ref={contentRef}>
          {loading ? (
            <div className="loading-indicator">Loading images...</div>
          ) : birdData.length === 0 ? (
            <div className="empty-gallery">No bird images found</div>
          ) : (
            <div className="gallery-grid">
              {getImageGrid().map((row, rowIndex) => (
                <div key={rowIndex} className="gallery-row">
                  {row.map((bird, colIndex) => (
                    bird ? (
                      <div 
                        key={bird.id} 
                        className="gallery-item"
                        onClick={() => handleImageClick(bird)}
                      >
                        {!loadedImages[bird.id] && (
                          <div className="image-placeholder"></div>
                        )}
                        <img 
                          src={bird.imageUrl} 
                          alt=""
                          style={{ 
                            display: loadedImages[bird.id] ? 'block' : 'none' 
                          }}
                          onLoad={() => handleImageLoad(bird.id)}
                          onError={(e) => {
                            console.error(`Failed to load image: ${bird.imageUrl}`);
                            handleImageLoad(bird.id); // Mark as loaded even if error
                            e.target.onerror = null;
                            e.target.src = "https://via.placeholder.com/150?text=";
                          }}
                        />
                      </div>
                    ) : (
                      <div key={`empty-${rowIndex}-${colIndex}`} className="gallery-item empty"></div>
                    )
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

export default GalleryOverlay;
