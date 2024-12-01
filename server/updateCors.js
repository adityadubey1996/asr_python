const StorageSingleton = require('./utils/strageClass')
const {allowlist} = require('./utils/constants')



async function updateCorsIfNecessary() {
    const bucket = StorageSingleton.getBucket();
    
   
 

  try {
    // Get the current CORS configuration
    const [metadata] = await bucket.getMetadata();
    const existingCorsConfigs = metadata.cors || [];
        console.log('Current CORS settings:', existingCorsConfigs);

       // Check if all allowlist origins are already included
       const allOriginsAllowed = allowlist.every(origin => 
        existingCorsConfigs.some(config => config.origin.includes(origin))
    );
    await  bucket.setCorsConfiguration([
        {
          origin: ['http://localhost:3000', 'https://voicequant.com'],
          method: ['PUT', 'GET', 'POST', 'OPTIONS'],
          responseHeader: ['Content-Type'],
          maxAgeSeconds: 3600
        },
      ]);
    
      console.log(`Bucket  CORS configuration updated.`);
  } catch (error) {
    console.error('Error updating CORS settings:', error);
  }
}

updateCorsIfNecessary().catch(console.error);

module.exports = {
    updateCorsIfNecessary
}
