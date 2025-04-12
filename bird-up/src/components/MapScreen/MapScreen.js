import React, { useEffect, useRef } from "react";
import Map from "ol/Map";
import View from "ol/View";
import { Tile as TileLayer } from "ol/layer";
import OSM from "ol/source/OSM";
import './MapScreen.css';
import "ol/ol.css";

function MapScreen() {
  const mapRef = useRef()

  useEffect(() => {
    const osmLayer = new TileLayer({
      preload: Infinity,
      source: new OSM(),
    })

    const map = new Map({
      target: mapRef.current,
      layers: [osmLayer],
      view: new View({
        center: [0, 0],
        zoom: 0,
      }),
    })
    return () => map.setTarget(null)
  }, [])

  return (
    <div
      id="map"
      ref={mapRef}
      className="map-container"
    />
  )
}

export default MapScreen