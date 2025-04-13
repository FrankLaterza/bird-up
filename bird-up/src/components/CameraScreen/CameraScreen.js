import React from 'react';
import PropTypes from 'prop-types';
import { useEffect, useState, useRef } from 'react';
import './CameraScreen.css';
import { formatSpeciesName } from './utils';

const CaughtCard = ({ birdData, imageUrl, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Start the appear animation after component mounts
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

  // Format the species name
  const formattedSpecies = formatSpeciesName(birdData.species);

  return (
    <div className={`caught-overlay ${isVisible ? 'visible' : ''} ${isClosing ? 'closing' : ''}`}>
      <div className="caught-card">
        <div className="caught-header">
          <h3>Bird Identified!</h3>
          <button 
            className="close-button" 
            onClick={handleClose}
            aria-label="Return to camera"
          >
            &times;
          </button>
        </div>
        
        <div className="caught-content">
          <div className="caught-image-container">
            <img 
              src={imageUrl} 
              alt={formattedSpecies}
              className="caught-image"
            />
          </div>
          
          <div className="caught-info">
            <div>
              <p className="caught-message">You took a picture of:</p>
              <p className="caught-species">{formattedSpecies}</p>
            </div>
            
            <div className="caught-rating">
              <span className="info-label">Photo Rating:</span>
              <div className="rating-bar">
                <div 
                  className="rating-fill" 
                  style={{ width: `${Math.min(100, birdData.quality_score)}%` }}
                ></div>
              </div>
              <span className="rating-value">{birdData.quality_score.toFixed(1)}%</span>
            </div>
            
            <div className="caught-description">
              <span className="info-label">Description:</span>
              <p>{birdData.description || "No description available"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function CameraScreen() {
  // Add state for handling video elements and the caught card
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const stripRef = useRef(null);
  const [ctx, setCtx] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [birdData, setBirdData] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  function runVideo() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    setCtx(ctx);
    const strip = stripRef.current;
    
    video.setAttribute('autoplay', '');
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
  
    const constraints = {
      audio: false,
      video: {
        facingMode: 'environment',
      }
    }
  
    function getVideo() {
      navigator.mediaDevices.getUserMedia(constraints)
        .then(localMediaStream => {
          if ('srcObject' in video) {
            video.srcObject = localMediaStream;
          } else {
            video.src = URL.createObjectURL(localMediaStream);
          }
          video.play();
        })
        .catch(err => {
          console.error(`OH NO!!!!`, err);
        });
    }
  
    function paintToCanvas() {
      const width = video.videoWidth;
      const height = video.videoHeight;
      canvas.width = width;
      canvas.height = height;
  
      return setInterval(() => {
        ctx.drawImage(video, 0, 0, width, height);
      }, 16);
    }
  
    getVideo();
  
    video.addEventListener('canplay', paintToCanvas);
  }

  // Handle closing the CaughtCard
  const handleCloseCaughtCard = () => {
    setBirdData(null);
    setCapturedImage(null);
  };

  // Move takePhoto and uploadImageToServer out of runVideo to make them accessible to button
  function takePhoto() {
    const canvas = canvasRef.current;
    const strip = stripRef.current;
    
    try {
      // Take the data out of the canvas
      const data = canvas.toDataURL('image/jpeg');
      
      // Store the captured image URL
      setCapturedImage(data);
      
      // Display the captured image in the strip
      const link = document.createElement('a');
      link.href = data;
      link.setAttribute('download', 'bird_photo');
      link.innerHTML = `<img src="${data}" alt="Captured Photo" />`;
      strip.insertBefore(link, strip.firstChild);
      
      // Upload the image to our API endpoint
      uploadImageToServer(data);
    } catch (error) {
      console.error('Error taking photo:', error);
    }
  }
  
  function uploadImageToServer(dataUrl) {
    // Set uploading state
    setIsUploading(true);
    
    // Convert the base64 data URL to a blob
    const fetchBlob = fetch(dataUrl).then(res => res.blob());
    
    fetchBlob.then(blob => {
      // Create a FormData object to send the image
      const formData = new FormData();
      formData.append('image', blob, 'image.jpg');
      
      // Send the image to our API endpoint
      fetch('http://localhost:5001/api/upload-image', {
        method: 'POST',
        body: formData,
      })
      .then(response => response.json())
      .then(data => {
        console.log('Image uploaded successfully:', data);
        setIsUploading(false);
        
        // If we have bird data, save it to state to display the CaughtCard
        if (data.success && data.bird_data) {
          setBirdData(data.bird_data);
        }
      })
      .catch(error => {
        console.error('Error uploading image:', error);
        setIsUploading(false);
      });
    });
  }

  const count = useRef(null);
  useEffect(() => {
    if (count.current == null) {
      runVideo();
    }
    return () => { count.current = 1; }
  }, []);

  useEffect(() => {
    if (videoRef.current && canvasRef.current && stripRef.current) {
      console.log('All refs are loaded');
    }
  }, [videoRef.current, canvasRef.current, stripRef.current]);

  return (
    <div id="cameraBox" className="screen">
      <div className="photobooth">
        <div className="controls">
          <button 
            onClick={takePhoto} 
            disabled={isUploading}
          >
            {isUploading ? 'Processing...' : 'Take Photo'}
          </button>
        </div>

        <canvas className="photo" ref={canvasRef}></canvas>
        <video className="player definitelyHide" ref={videoRef}></video>
        <div className="strip" ref={stripRef}></div>
      </div>
      
      {/* Display the CaughtCard when we have bird data */}
      {capturedImage && birdData && (
        <CaughtCard 
          birdData={birdData} 
          imageUrl={capturedImage} 
          onClose={handleCloseCaughtCard} 
        />
      )}
    </div>
  );
}

export default CameraScreen;
