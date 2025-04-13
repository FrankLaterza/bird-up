import logo from './logo.svg';
import { useState } from 'react';
import { useEffect } from 'react';
import Map from 'ol/Map';

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
  const [menuExpanded, expandMenu] = useState(false);

  useEffect(() => {
    document.getElementById("closeAll").style.display = "none";
  }, []);

  const updateScreen = (screen) => {
    setScreen(screen);

    // Hide or show map assets
    const mapAssets = Array.from(document.getElementsByClassName("mapAsset"));
    mapAssets.forEach((mapAsset) => {
      if (mapAsset && mapAsset.style) {
        mapAsset.style.display = screen == MAP_SCREEN ? "block" : "none";
      }
    });

    // Hide or show expand assets
    const expandAssets = Array.from(document.getElementsByClassName("expandAsset"));
    expandAssets.forEach((expandAsset) => {
      if (expandAsset && expandAsset.style) {
        expandAsset.style.display = "none";
      }
    });

    Array.from(document.getElementsByClassName("antiMapAsset")).forEach((antiMapAsset) => {
      if (antiMapAsset && antiMapAsset.style) {
        antiMapAsset.style.display = screen == MAP_SCREEN ? "none" : "block";
      }
    });

    // Expand menu if not on the map screen
    expandMenu(screen !== MAP_SCREEN);
  };

  const toggleMenu = () => {
    expandMenu(!menuExpanded);
    let expandAssets = Array.from(document.getElementsByClassName("expandAsset"));
    expandAssets.map((expandAsset) => { expandAsset.style.display = menuExpanded ? "none" : "block" });
  }
  const setMenu = (shown) => {
    expandMenu(shown);
  }

  const CurrentScreen = screens[currentScreen]; // Select the current screen component

  return (
    <div className="App">
      <CurrentScreen />
      <div id="uiOverlay">
        <h1 id="crosshairs" className="mapAsset">+</h1>
        {/* <button id="closeCamera" className="bottomButton centeredButton" onClick={() => updateScreen(MAP_SCREEN)}>Close Cam</button> */}
        <button id="closeAll" className="antiMapAsset topLeftButton" onClick={() => updateScreen(MAP_SCREEN)}>X</button>
        <button id="openCamera" className="mapAsset bottomButton centeredButton" onClick={() => updateScreen(CAMERA_SCREEN)}>Open Cam</button>
        <button id="expandMenu" className="mapAsset bottomButton right" onMouseDown={() => toggleMenu()}>Ex Dong</button>

        <button id="openDex" className="mapAsset expandAsset bottomButton smaller" onMouseUp={() => updateScreen(DEX_SCREEN)}>Open Dex</button>
        <button id="openGallery" className="mapAsset expandAsset bottomButton smaller" onMouseUp={() => updateScreen(GALLERY_SCREEN)}>Open Gallery</button>

      </div>
      {

      }
    </div>
  );
}

export default App;
