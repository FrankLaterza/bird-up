import React, { useEffect, useRef, useState } from "react";
import Map from "ol/Map";
import View from "ol/View";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import OSM from "ol/source/OSM";
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature";
import { Point, Circle } from "ol/geom";
import { Style, Fill, Stroke, Icon } from "ol/style";
import './MapScreen.css';
import "ol/ol.css";
import { useGeographic, transform } from 'ol/proj.js';
import iconImagePath from "../../burb.png";

const useMapPoints = (initialPoints = []) => {
  const [points, setPoints] = useState(initialPoints);
  
  const addPoint = (newPoint) => {
    setPoints(prev => [...prev, {
      ...newPoint,
      id: Date.now(),
      type: newPoint.type || 'user'
    }]);
  };

  const clearType = (type) => {
    setPoints(prev => prev.filter(point => point.type !== type));
  };

  return { points, addPoint, clearType };
};

function MapScreen() {
  const mapRef = useRef();
  const mapInstanceRef = useRef(null);
  const userSourceRef = useRef(new VectorSource());
  const birdSourceRef = useRef(new VectorSource());
  const { points, addPoint, clearType } = useMapPoints([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Style configurations
  const iconStyle = new Style({
    image: new Icon({
      anchor: [0.5, 0.5],
      src: iconImagePath,
      scale: 0.02
    })
  });

  const circleStyle = new Style({
    fill: new Fill({ color: 'rgba(0, 0, 255, 0.1)' }),
    stroke: new Stroke({ color: 'rgba(0, 0, 255, 0.8)', width: 2 })
  });

  const birdStyle = new Style({
    image: new Icon({
      anchor: [0.5, 0.5],
      src: 'https://docs.maptiler.com/openlayers/default-marker.png',
      scale: 0.8
    })
  });

  const fetchBirdSightings = async (lat, lng) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5001/api/get-bird-sightings?lat=${lat}&lng=${lng}`
      );
      if (!response.ok) throw new Error('API request failed');
      const data = await response.json();
      
      // Clear previous bird features
      birdSourceRef.current.clear();

      // Add new bird features
      const birdFeatures = data.map(sighting => {
        const coords = transform(
          [sighting.lng, sighting.lat],
          'EPSG:4326',
          'EPSG:3857'
        );
        const feature = new Feature({
          geometry: new Point(coords),
          ...sighting
        });
        feature.setStyle(birdStyle);
        return feature;
      });
      
      birdSourceRef.current.addFeatures(birdFeatures);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({ source: new OSM() }),
        new VectorLayer({ source: userSourceRef.current }),
        new VectorLayer({ source: birdSourceRef.current })
      ],
      view: new View({
        center: transform([-76.939, 38.9861], 'EPSG:4326', 'EPSG:3857'),
        zoom: 18
      })
    });

    const handleMapMove = () => {
      const view = map.getView();
      const center = transform(view.getCenter(), 'EPSG:3857', 'EPSG:4326');
      const [longitude, latitude] = center;
      fetchBirdSightings(latitude, longitude);
    };

    map.on('moveend', handleMapMove);
    mapInstanceRef.current = map;

    // Initial fetch
    fetchBirdSightings(38.9861, -76.939);

    return () => {
      map.un('moveend', handleMapMove);
      map.setTarget(null);
    };
  }, []);

  useEffect(() => {
    const source = userSourceRef.current;
    source.clear();

    points.forEach(point => {
      const coords = transform(
        [point.lon, point.lat], 
        'EPSG:4326', 
        'EPSG:3857'
      );

      const marker = new Feature({
        geometry: new Point(coords),
        ...point
      });
      marker.setStyle(iconStyle);

      const circle = new Feature({
        geometry: new Circle(coords, point.radius),
        ...point
      });
      circle.setStyle(circleStyle);

      source.addFeatures([marker, circle]);
    });
  }, [points]);

  return (
    <div className="map-wrapper">
      <div 
        ref={mapRef} 
        className="map-container" 
        style={{ width: '100%', height: '100vh' }}
      />
      <div style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        background: 'rgba(255,255,255,0.9)',
        padding: '10px',
        borderRadius: '4px'
      }}>
        {loading && <p>🕊️ Loading bird sightings...</p>}
        {error && <p style={{ color: 'red' }}>⚠️ Error: {error}</p>}
      </div>
    </div>
  );
}

export default MapScreen;

