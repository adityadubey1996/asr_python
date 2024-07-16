const StorageSingleton = require('./utils/strageClass')



async function updateCorsIfNecessary() {
    const bucket = StorageSingleton.getBucket();
    
   
 

  try {
    // Get the current CORS configuration
    const [metadata] = await bucket.getMetadata();
    const corsConfiguration = metadata.cors;
    console.log('Current CORS settings:', corsConfiguration);
    // Check if the specified origin is already in the CORS configuration
    const isOriginAllowed = corsConfiguration.some(config =>
      config.origin.includes(originToCheck) && config.method.includes(method)
    );

    if (!isOriginAllowed) {
      // Add the new origin to the CORS configuration
      const newCorsConfig = corsConfiguration;
      newCorsConfig.push({
        maxAgeSeconds: maxAgeSeconds,
        method: [method],
        origin: [originToCheck],
        responseHeader: [responseHeader],
      });

      // Update the bucket with the new CORS settings
      await bucket.setCorsConfiguration(newCorsConfig);
      console.log(`Updated CORS settings to include ${originToCheck}`);
    } else {
      console.log(`${originToCheck} is already allowed in CORS settings.`);
    }
  } catch (error) {
    console.error('Error updating CORS settings:', error);
  }
}

updateCorsIfNecessary().catch(console.error);

module.exports = {
    updateCorsIfNecessary
}
