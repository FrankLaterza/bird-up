import Map from "ol/Map";
import React, { useEffect, useRef, useState } from "react";
import View from "ol/View";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import OSM from "ol/source/OSM";
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature";
import { Point, Circle } from "ol/geom";
import { Style, Fill, Stroke, Icon, Text, Circle as CircleStyle } from 'ol/style';
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

  const circleStyle = new Style({
    fill: new Fill({ color: 'rgba(0, 0, 255, 0.1)' }),
    stroke: new Stroke({
      color: 'rgba(0, 0, 255, 0.8)',
      width: 2
    })
  });

  const createBirdStyle = (feature) => {
    let birdNames = feature.get('comName')?.split('\n') || [];
    const truncateList = arr => arr.slice(0, 4).concat(arr.length > 4 ? [`and ${arr.length - 4} more`] : []);
    birdNames = truncateList(birdNames)
    const lineCount = birdNames.length;

    return new Style({
      image: new Icon({
        anchor: [0.5, 0.5],
        src: iconImagePath,
        scale: 0.03
      }),
      text: new Text({
        text: birdNames.join('\n'),
        offsetY: -30 - (20 * (lineCount - 1)), // Dynamic offset
        textBaseline: 'top', // Align text to top
        fill: new Fill({ color: '#000' }),
        stroke: new Stroke({
          color: '#fff',
          width: 2
        }),
        font: 'bold 14px Calibri,sans-serif'
      })
    });
  };

  const fetchBirdSightings = async (lat, lng) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://birdup-backend.ngrok.app/api/get-bird-sightings?lat=${lat}&lng=${lng}`
      );
      if (!response.ok) throw new Error('API request failed');
      const data = await response.json();
      birdSourceRef.current.clear();

      const birdFeatures = [];
      const groups = [];
      const CLUSTER_RADIUS = 150; // Meters

      // Distance calculation using Haversine formula
      const getDistance = (lat1, lng1, lat2, lng2) => {
        const R = 6371e3;
        const φ1 = (lat1 * Math.PI) / 180;
        const φ2 = (lat2 * Math.PI) / 180;
        const Δφ = ((lat2 - lat1) * Math.PI) / 180;
        const Δλ = ((lng2 - lng1) * Math.PI) / 180;

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      };

      // Cluster grouping logic
      data.forEach(currentSighting => {
        let addedToCluster = false;

        // Try to add to existing cluster
        for (const cluster of groups) {
          const distance = getDistance(
            currentSighting.lat,
            currentSighting.lng,
            cluster.centerLat,
            cluster.centerLng
          );

          if (distance <= CLUSTER_RADIUS) {
            cluster.sightings.push(currentSighting);
            cluster.speciesNames.push(currentSighting.comName.replace(/_/g, ' '));
            // Update cluster center
            cluster.centerLat = cluster.sightings.reduce((sum, s) => sum + s.lat, 0) / cluster.sightings.length;
            cluster.centerLng = cluster.sightings.reduce((sum, s) => sum + s.lng, 0) / cluster.sightings.length;
            addedToCluster = true;
            break;
          }
        }

        // Create new cluster if needed
        if (!addedToCluster) {
          groups.push({
            centerLat: currentSighting.lat,
            centerLng: currentSighting.lng,
            sightings: [currentSighting],
            speciesNames: [currentSighting.comName.replace(/_/g, ' ')]
          });
        }
      });

      // Create map features for each cluster
      groups.forEach(cluster => {
        const coords = transform(
          [cluster.centerLng, cluster.centerLat],
          'EPSG:4326',
          'EPSG:3857'
        );

        // Create blue circle feature
        const circleFeature = new Feature({
          geometry: new Circle(coords, 1000),
          featureType: 'circle'
        });
        circleFeature.setStyle(new Style({
          fill: new Fill({ color: 'rgba(0, 0, 255, 0.1)' }),
          stroke: new Stroke({
            color: 'rgba(0, 0, 255, 0.6)',
            width: 1.5
          })
        }));

        // Create bird marker feature
        const markerFeature = new Feature({
          geometry: new Point(coords),
          comName: cluster.speciesNames.join('\n'),
          lat: cluster.centerLat,
          lng: cluster.centerLng,
          obsDt: cluster.sightings.map(s => s.obsDt).join(', '),
          sightings: cluster.sightings,
          featureType: 'marker'
        });
        markerFeature.setStyle(createBirdStyle(markerFeature));

        // Add both features to array
        birdFeatures.push(markerFeature, circleFeature);
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
        new VectorLayer({
          source: birdSourceRef.current,
          zIndex: 10
        })
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
      marker.setStyle(createBirdStyle(marker));

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

