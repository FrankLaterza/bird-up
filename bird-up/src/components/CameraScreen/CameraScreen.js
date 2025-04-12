import React from 'react';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useState } from 'react';
import { useRef } from 'react';
import './CameraScreen.css';

function CameraScreen() {

  function runVideo(){
    const video = document.querySelector('.player');
    const canvas = document.querySelector('.photo');
    const ctx = canvas.getContext('2d');
    const strip = document.querySelector('.strip');
    const snap = document.querySelector('.snap');
    // const count = 0;
    console.log(video);
  
    video.setAttribute('autoplay', '');
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '')
  
    const constraints = {
      audio: false,
      video: {
        facingMode: 'user'
      }
    }
  
    function getVideo() {
      navigator.mediaDevices.getUserMedia(constraints)
        .then(localMediaStream => {
          console.log(localMediaStream);
          console.dir(video);
          if ('srcObject' in video) {
            video.srcObject = localMediaStream;
          } else {
            video.src = URL.createObjectURL(localMediaStream);
          }
          // video.src = window.URL.createObjectURL(localMediaStream);
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
        // take the pixels out
        // let pixels = ctx.getImageData(0, 0, width, height);
        // mess with them
        // pixels = redEffect(pixels);
  
        // pixels = rgbSplit(pixels);
        // ctx.globalAlpha = 0.8;
  
        // pixels = greenScreen(pixels);
        // put them back
        // ctx.putImageData(pixels, 0, 0);
      }, 16);
    }
  
    function takePhoto() {
      // played the sound
      snap.currentTime = 0;
      snap.play();
  
      // take the data out of the canvas
      const data = canvas.toDataURL('image/jpeg');
      const link = document.createElement('a');
      link.href = data;
      link.setAttribute('download', 'handsome');
      link.innerHTML = `<img src="${data}" alt="Handsome Man" />`;
      strip.insertBefore(link, strip.firstChild);
    }
  
    // function redEffect(pixels) {
    //   for (let i = 0; i < pixels.data.length; i += 4) {
    //     pixels.data[i + 0] = pixels.data[i + 0] + 200; // RED
    //     pixels.data[i + 1] = pixels.data[i + 1] - 50; // GREEN
    //     pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // Blue
    //   }
    //   return pixels;
    // }
  
    // function rgbSplit(pixels) {
    //   for (let i = 0; i < pixels.data.length; i += 4) {
    //     pixels.data[i - 150] = pixels.data[i + 0]; // RED
    //     pixels.data[i + 500] = pixels.data[i + 1]; // GREEN
    //     pixels.data[i - 550] = pixels.data[i + 2]; // Blue
    //   }
    //   return pixels;
    // }
  
  
    getVideo();
  
    video.addEventListener('canplay', paintToCanvas);
  
    console.log("YAHOOOOOOO");
  
  
  }

  const count = useRef(null);
  useEffect(() => {
    if (count.current == null) {
      runVideo();
    }
    return () => { count.current = 1; }
  }, []);




  return (
    <div id="cameraBox" class="screen">
      <div className="photobooth">
        <div className="controls">
          <button onClick={console.log("SHYTE")}>Take Photo</button>
          {/* <!--       <div className="rgb">
            <label for="rmin">Red Min:</label>
            <input type="range" min=0 max=255 name="rmin">
            <label for="rmax">Red Max:</label>
            <input type="range" min=0 max=255 name="rmax">
            <br>
              <label for="gmin">Green Min:</label>
              <input type="range" min=0 max=255 name="gmin">
              <label for="gmax">Green Max:</label>
              <input type="range" min=0 max=255 name="gmax">
              <br>
                <label for="bmin">Blue Min:</label>
                <input type="range" min=0 max=255 name="bmin">
                 <label for="bmax">Blue Max:</label>
                <input type="range" min=0 max=255 name="bmax">
              </div> --> */}
        </div>

        <canvas className="photo"></canvas>
        <video className="player definitelyHide"></video>
        <div className="strip"></div>
      </div>

      <audio className="snap" src="./snap.mp3" hidden></audio>
      <script src='vidya.js'></script>
    </div>
  );
}

// MapScreen.propTypes = { };

// MapScreen.defaultProps = { };

export default CameraScreen;
