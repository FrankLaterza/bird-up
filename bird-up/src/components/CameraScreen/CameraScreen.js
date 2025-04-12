import React from 'react';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useState } from 'react';
import { useRef } from 'react';
import './CameraScreen.css';

function CameraScreen() {
  // Add state for handling video elements
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const stripRef = useRef(null);
  const [ctx, setCtx] = useState(null);

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
        facingMode: 'user'
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

  // Move takePhoto and uploadImageToServer out of runVideo to make them accessible to button
  function takePhoto() {
    const canvas = canvasRef.current;
    const strip = stripRef.current;
    
    try {
      // take the data out of the canvas
      const data = canvas.toDataURL('image/jpeg');
      
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
        // Here you can handle success, maybe show a confirmation message
      })
      .catch(error => {
        console.error('Error uploading image:', error);
        // Handle the error appropriately
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
          <button onClick={takePhoto}>Take Photo</button>
        </div>

        <canvas className="photo" ref={canvasRef}></canvas>
        <video className="player definitelyHide" ref={videoRef}></video>
        <div className="strip" ref={stripRef}></div>
      </div>
    </div>
  );
}

export default CameraScreen;
