import logo from './logo.svg';
import { useState } from 'react';
import { useEffect } from 'react';
import Map from 'ol/Map';

import MapScreen from './components/MapScreen/MapScreen';
import DexScreen from './components/DexScreen/DexScreen';
import CameraScreen from './components/CameraScreen/CameraScreen';

import GalleryOverlay from './components/GalleryScreen/GalleryOverlay';

import './App.css';

function App() {
  const MAP_SCREEN = 0;
  const DEX_SCREEN = 1;
  const CAMERA_SCREEN = 3;
  const screens = [MapScreen, DexScreen, null, CameraScreen]; 
  const [currentScreen, setScreen] = useState(MAP_SCREEN);
  const [menuExpanded, expandMenu] = useState(false);
  const [showGallery, setShowGallery] = useState(false); 

  const updateScreen = (screen) => {
    setScreen(screen);
    let mapIcons = Array.from(document.getElementsByClassName("mapIcon"));
    console.log(mapIcons);
    console.log(screen);
    if (screen != MAP_SCREEN) {
      mapIcons.map((mapIcon) => mapIcon.style.display = "none");
      expandMenu(true);
    }
    else {
      mapIcons.map((mapIcon) => mapIcon.style.display = "block");
    }
  }

  const toggleGallery = () => {
    setShowGallery(!showGallery);
  }

  const toggleMenu = () => {
    expandMenu(!menuExpanded);
    let expandIcons = Array.from(document.getElementsByClassName("expandIcon"));
    expandIcons.map((expandIcon) => { expandIcon.style.display = menuExpanded ? "none" : "block" });
  }
  const setMenu = (shown) => {
    expandMenu(shown);
  }

  const CurrentScreen = screens[currentScreen]; 

  return (
    <div className="App">
      <CurrentScreen />
      <div id="uiOverlay">
        <h1 id="crosshairs" className="mapIcon">+</h1>
        <button id="closeCamera" className="bottomButton centeredButton" onClick={() => updateScreen(MAP_SCREEN)}>Close Cam</button>
        <button id="openCamera" className="mapIcon bottomButton centeredButton" onClick={() => updateScreen(CAMERA_SCREEN)}>Open Cam</button>
        <button id="expandMenu" className="mapIcon bottomButton right" onMouseDown={() => toggleMenu()}>Ex Dong</button>

        <button id="openDex" className="mapIcon expandIcon bottomButton" onMouseUp={() => updateScreen(DEX_SCREEN)}>Open Dex</button>
        <button id="openGallery" className="mapIcon expandIcon bottomButton" onMouseUp={() => toggleGallery()}>Open Gallery</button>

      </div>
      {showGallery ? <GalleryOverlay onClose={() => setShowGallery(false)} key={Date.now()} /> : null}
    </div>
  );
}

export default App;
