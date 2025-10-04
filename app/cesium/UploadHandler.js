import shapefile from 'shapefile';

const processShapefile = async (file) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const features = [];
    
    await shapefile.open(arrayBuffer)
      .then(source => source.read()
        .then(function log(result) {
          if (result.done) {
            // Create GeoJSON object
            const geoJSON = {
              type: 'FeatureCollection',
              features: features
            };
            
            // Process the GeoJSON the same way as above
            const dataSource = Cesium.GeoJsonDataSource.load(geoJSON, {
              stroke: Cesium.Color.HOTPINK,
              fill: Cesium.Color.PINK.withAlpha(0.5),
              strokeWidth: 3,
            });
            
            viewer.dataSources.add(dataSource);
            viewer.zoomTo(dataSource);
            
            // Add labels
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
            
            return;
          }
          features.push(result.value);
          return source.read().then(log);
        }));
  } catch (error) {
    console.error('Error processing shapefile:', error);
    throw new Error('Failed to process shapefile');
  }
};