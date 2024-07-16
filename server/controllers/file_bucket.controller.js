const bucket = require('../utils/strageClass')

const uploadUrl =  async (req, res) => {
  const { fileName, contentType } = req.body;
  
  try {
    const options = {
      version: 'v4',
      action: 'write',
      expires: Date.now() + 15 * 60 * 1000, // URL expiration time
      contentType
    };
    const [url] = await bucket.file(fileName).getSignedUrl(options);
    res.status(200).json({ signedUrl: url });
  } catch (error) {
    console.error('Failed to create signed URL', error);
    res.status(500).json({ error: 'Failed to create signed URL' });
  }
};

const downloadUrl = async(req, res) => {
    const { fileName } = req.query;
    try {
      const options = {
        version: 'v4',
        action: 'read',
        expires: Date.now() + 15 * 60 * 1000, // URL expiration time
      };
      const [url] = await bucket.file(fileName).getSignedUrl(options);
      res.status(200).json({ signedUrl: url });
    } catch (error) {
      console.error('Failed to create signed URL', error);
      res.status(500).json({ error: 'Failed to create signed URL' });
    }
}

module.exports ={
    uploadUrl,
    downloadUrl
}
