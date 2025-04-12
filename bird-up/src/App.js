import logo from './logo.svg';
import { useState } from 'react';
import { useEffect } from 'react';
import Map from 'ol/Map.js';

import MapScreen from './components/MapScreen/MapScreen';
import DexScreen from './components/DexScreen/DexScreen';
import GalleryScreen from './components/GalleryScreen/GalleryScreen';
import CameraScreen from './components/CameraScreen/CameraScreen';

import './App.css';

function App() {
  const MAP_SCREEN = 0;
  const DEX_SCREEN = 1;
  const GALLERY_SCREEN = 2;
  const CAMERA_SCREEN = 3;
  const screens = [MapScreen, DexScreen, GalleryScreen, CameraScreen]; // Array of screen components
  const [currentScreen, setScreen] = useState(MAP_SCREEN);

  const updateScreen = (screen) => {
    setScreen(screen);
    let mapIcons = Array.from(document.getElementsByClassName("mapIcon"));
    console.log(mapIcons);
    console.log(screen);
    screen != MAP_SCREEN ? mapIcons.map((mapIcon)=>mapIcon.style.display ="none") : mapIcons.map((mapIcon)=>mapIcon.style.display ="block");
  }

  const CurrentScreen = screens[currentScreen]; // Select the current screen component

  return (
    <div className="App">
      <CurrentScreen />
      <div id="uiOverlay">
        <h1 id="crosshairs" className="mapIcon">+</h1>
        <button id="closeCamera" className="bottomCenterButton" onClick={() => updateScreen(MAP_SCREEN)}>Close Cam</button>
        <button id="openCamera" className="mapIcon bottomCenterButton" onClick={() => updateScreen(CAMERA_SCREEN)}>Open Cam</button>
        <button id="openDex" className="mapIcon bottomCenterButton right" onClick={() => updateScreen(DEX_SCREEN)}>Open Dex</button>

      </div>
      {

      }
    </div>
  );
}

export default App;
