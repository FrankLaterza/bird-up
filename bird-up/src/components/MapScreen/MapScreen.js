import React, { useEffect, useRef } from "react";
import Map from "ol/Map";
import View from "ol/View";
import { Tile as TileLayer } from "ol/layer";
import OSM from "ol/source/OSM";
import './MapScreen.css';
import "ol/ol.css";
import { useGeographic, transform } from 'ol/proj.js';
import { Point } from "ol/geom";

const start = [-76.939, 38.9861];
const center = transform(start, 'EPSG:4326', 'EPSG:3857');

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
        center: center,
        zoom: 20,
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