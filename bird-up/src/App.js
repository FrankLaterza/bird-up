import logo from './logo.svg';
import { useState } from 'react';
import { useEffect } from 'react';
import Map from 'ol/Map';
import { FaCamera } from "react-icons/fa6";
import { IoBookOutline } from "react-icons/io5";
import { GrGallery } from "react-icons/gr";
import { TiThMenu } from "react-icons/ti";

import MapScreen from './components/MapScreen/MapScreen';
import DexScreen from './components/DexScreen/DexScreen';
import CameraScreen from './components/CameraScreen/CameraScreen';

import GalleryOverlay from './components/GalleryScreen/GalleryOverlay';

import './App.css';

function App() {
  const MAP_SCREEN = 0;
  const DEX_SCREEN = 1;
  const CAMERA_SCREEN = 2;
  const screens = [MapScreen, DexScreen, CameraScreen]; 
  const [currentScreen, setScreen] = useState(MAP_SCREEN);
  const [menuExpanded, expandMenu] = useState(false);
  const [showGallery, setShowGallery] = useState(false); 

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

  const toggleGallery = () => {
    setShowGallery(!showGallery);
  }

  const toggleMenu = () => {
    expandMenu(!menuExpanded);
    let expandAssets = Array.from(document.getElementsByClassName("expandAsset"));
    expandAssets.map((expandAsset) => { expandAsset.style.display = menuExpanded ? "none" : "block" });
  }
  const setMenu = (shown) => {
    expandMenu(shown);
  }

    const CurrentScreen = screens[currentScreen]; 

  return (
    <div className="App">
      <CurrentScreen />
      <div id="uiOverlay">
        <h1 id="crosshairs" className="mapAsset">+</h1>
        {/* <button id="closeCamera" className="bottomButton centeredButton" onClick={() => updateScreen(MAP_SCREEN)}>Close Cam</button> */}
        <button id="closeAll" className="antiMapAsset topLeftButton" onClick={() => updateScreen(MAP_SCREEN)}>X</button>
        <button id="openCamera" className="mapAsset bottomButton centeredButton" onClick={() => updateScreen(CAMERA_SCREEN)}><FaCamera size="3.2em" />
        </button>
        <button id="expandMenu" className="mapAsset bottomButton right smaller" onMouseDown={() => toggleMenu()}><TiThMenu size="3.2em" /></button>

        <button id="openDex" className="mapAsset expandAsset bottomButton smaller" onMouseUp={() => updateScreen(DEX_SCREEN)}><IoBookOutline size="3.2em"/></button>
        <button id="openGallery" className="mapAsset expandAsset bottomButton smaller" onMouseUp={() => toggleGallery()}><GrGallery size="2.6em" /></button>

      </div>
      {showGallery ? <GalleryOverlay onClose={() => setShowGallery(false)} key={Date.now()} /> : null}
    </div>
  );
}

export default App;
