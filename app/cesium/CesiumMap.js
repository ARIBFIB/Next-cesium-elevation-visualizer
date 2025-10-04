// In CesiumMap.js, add this function after the viewer initialization
const loadDefaultGeoJSON = async () => {
  try {
    const response = await fetch('/assets/example_data/pakistan_points.geojson');
    const geoJSON = await response.json();
    
    const dataSource = await Cesium.GeoJsonDataSource.load(geoJSON, {
      stroke: Cesium.Color.HOTPINK,
      fill: Cesium.Color.PINK.withAlpha(0.5),
      strokeWidth: 3,
      markerSymbol: '?',
    });
    
    viewer.dataSources.add(dataSource);
    viewer.zoomTo(dataSource);
    
    // Add labels for each point
    const entities = dataSource.entities.values;
    for (let i = 0; i < entities.length; i++) {
      const entity = entities[i];
      if (entity.position) {
        entity.label = {
          text: entity.properties.name || `Point ${i + 1}`,
          font: '14pt monospace',
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          outlineWidth: 2,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          pixelOffset: new Cesium.Cartesian2(0, -9),
        };
      }
    }
  } catch (error) {
    console.error('Error loading default GeoJSON:', error);
  }
};

// Call this function after viewer initialization
loadDefaultGeoJSON();