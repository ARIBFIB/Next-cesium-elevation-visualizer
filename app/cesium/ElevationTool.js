'use client'
import { useState, useEffect } from 'react'
import * as Cesium from 'cesium'
import { saveElevationData } from '@/lib/api'
// import styles from './cesium.module.css'

export function ElevationTool({ viewer, selectedPoint, setSelectedPoint, elevationData, setElevationData }) {
  const [distance, setDistance] = useState(1) // Default 1km
  const [isProcessing, setIsProcessing] = useState(false)
  const [status, setStatus] = useState('')
  const [handler, setHandler] = useState(null)

  useEffect(() => {
    if (!viewer) return

    // Set up click handler for point selection
    const clickHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    
    clickHandler.setInputAction(async (click) => {
      // Get the position of the click
      const pickedObject = viewer.scene.pick(click.position);
      
      if (Cesium.defined(pickedObject)) {
        // If we clicked on an existing entity, don't do anything
        return;
      }
      
      // Get the cartesian position
      const cartesian = viewer.scene.camera.pickEllipsoid(
        click.position,
        viewer.scene.globe.ellipsoid
      );
      
      if (cartesian) {
        // Convert to cartographic (longitude, latitude, height)
        const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
        
        // Get the terrain height at this position
        const height = await viewer.scene.globe.getHeight(cartographic);
        
        // Create a point entity
        const pointEntity = viewer.entities.add({
          position: Cesium.Cartesian3.fromRadians(
            cartographic.longitude,
            cartographic.latitude,
            height
          ),
          point: {
            pixelSize: 10,
            color: Cesium.Color.YELLOW,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 2,
          },
          label: {
            text: `Selected Point (${Cesium.Math.toDegrees(cartographic.longitude).toFixed(6)}, ${Cesium.Math.toDegrees(cartographic.latitude).toFixed(6)})`,
            font: '14pt monospace',
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            outlineWidth: 2,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: new Cesium.Cartesian2(0, -9),
          },
        });
        
        // Store the selected point
        setSelectedPoint({
          longitude: Cesium.Math.toDegrees(cartographic.longitude),
          latitude: Cesium.Math.toDegrees(cartographic.latitude),
          height: height,
          entity: pointEntity,
        });
        
        setStatus('Point selected. Enter distance and click "Compare Elevation" to analyze surrounding points.');
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    
    setHandler(clickHandler);
    
    return () => {
      if (handler) {
        handler.destroy();
      }
    };
  }, [viewer]);

  const compareElevation = async () => {
    if (!selectedPoint) {
      setStatus('Please select a point first by clicking on the map.');
      return;
    }
    
    setIsProcessing(true);
    setStatus('Analyzing elevation data...');
    
    try {
      // Calculate the number of sample points based on distance
      const numSamples = Math.max(10, Math.floor(distance * 10));
      const lowerPoints = [];
      
      // Sample points in a grid around the selected point
      for (let i = 0; i < numSamples; i++) {
        for (let j = 0; j < numSamples; j++) {
          // Calculate offset in degrees
          const lonOffset = (i - numSamples / 2) * (distance / 111) / (numSamples / 2);
          const latOffset = (j - numSamples / 2) * (distance / 111) / (numSamples / 2);
          
          // Calculate new position
          const longitude = selectedPoint.longitude + lonOffset;
          const latitude = selectedPoint.latitude + latOffset;
          
          // Skip the center point (our selected point)
          if (Math.abs(lonOffset) < 0.0001 && Math.abs(latOffset) < 0.0001) continue;
          
          // Get the height at this position
          const cartographic = Cesium.Cartographic.fromDegrees(longitude, latitude);
          const height = await viewer.scene.globe.getHeight(cartographic);
          
          // If this point has a lower elevation, add it to our list
          if (height < selectedPoint.height) {
            lowerPoints.push({
              longitude,
              latitude,
              height,
            });
            
            // Add a point entity to visualize it
            viewer.entities.add({
              position: Cesium.Cartesian3.fromDegrees(longitude, latitude, height),
              point: {
                pixelSize: 5,
                color: Cesium.Color.BLUE,
                outlineColor: Cesium.Color.BLACK,
                outlineWidth: 1,
              },
            });
          }
        }
      }
      
      // Store the elevation data
      const elevationResult = {
        referencePoint: selectedPoint,
        surroundingPoints: lowerPoints,
        distance,
        timestamp: new Date().toISOString(),
      };
      
      setElevationData(elevationResult);
      
      // Save to database
      await saveElevationData(elevationResult);
      
      setStatus(`Analysis complete. Found ${lowerPoints.length} points with lower elevation within ${distance}km.`);
    } catch (error) {
      console.error('Error comparing elevation:', error);
      setStatus(`Error: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const clearSelection = () => {
    if (selectedPoint && selectedPoint.entity) {
      viewer.entities.remove(selectedPoint.entity);
    }
    
    // Remove all blue points
    const entities = viewer.entities.values;
    for (let i = 0; i < entities.length; i++) {
      const entity = entities[i];
      if (entity.point && entity.point.color.getValue() === Cesium.Color.BLUE) {
        viewer.entities.remove(entity);
      }
    }
    
    setSelectedPoint(null);
    setElevationData(null);
    setStatus('');
  };

  return (
    <div className={styles.elevationPanel}>
      <h3>Elevation Analysis</h3>
      <p>Click on the map to select a point for elevation analysis.</p>
      
      {selectedPoint && (
        <div className={styles.formGroup}>
          <p>Selected Point:</p>
          <p>Lat: {selectedPoint.latitude.toFixed(6)}</p>
          <p>Lon: {selectedPoint.longitude.toFixed(6)}</p>
          <p>Elevation: {selectedPoint.height.toFixed(2)}m</p>
        </div>
      )}
      
      <div className={styles.formGroup}>
        <label htmlFor="distance">Distance (km):</label>
        <input
          type="number"
          id="distance"
          value={distance}
          onChange={(e) => setDistance(parseFloat(e.target.value))}
          min="0.1"
          step="0.1"
        />
      </div>
      
      <div>
        <button
          className={styles.button}
          onClick={compareElevation}
          disabled={isProcessing || !selectedPoint}
        >
          {isProcessing ? 'Analyzing...' : 'Compare Elevation'}
        </button>
        <button
          className={styles.button}
          onClick={clearSelection}
          disabled={!selectedPoint}
        >
          Clear Selection
        </button>
      </div>
      
      {status && <p className={styles.info}>{status}</p>}
      
      {elevationData && (
        <div className={styles.info}>
          <p>Analysis Results:</p>
          <p>Reference Point Elevation: {elevationData.referencePoint.height.toFixed(2)}m</p>
          <p>Lower Elevation Points Found: {elevationData.surroundingPoints.length}</p>
          <p>Analysis Distance: {elevationData.distance}km</p>
        </div>
      )}
    </div>
  )
}