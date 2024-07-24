const StorageSingleton = require('../utils/strageClass')

const uploadUrl =  async (req, res) => {
  const { fileName, contentType } = req.body;
 const decodedFileName = decodeURIComponent(fileName);
  try {
    const bucket = StorageSingleton.getBucket();
    const options = {
      version: 'v4',
      action: 'write',
      expires: Date.now() + 15 * 60 * 1000, // URL expiration time
      contentType
    };
    const [url] = await bucket.file(decodedFileName).getSignedUrl(options);
    res.status(200).json({ signedUrl: url });
  } catch (error) {
    console.error('Failed to create signed URL', error);
    res.status(500).json({ error: 'Failed to create signed URL' });
  }
};

const downloadUrl = async(req, res) => {
    const { fileName } = req.query;
    try {
        const bucket = StorageSingleton.getBucket();

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

const getFileByFileId = async (req, res) => {
    const { fileId } = req.params;
    const userId = req.user.id;  // Assuming you have user authentication

    try {
        // Fetch the file metadata from the database
        const file = await db.audioFiles.findOne({
            where: { fileId, userId }
        });

        if (!file) {
            return res.status(404).json({ message: 'File not found.' });
        }

        // Generate a presigned URL for download
        const bucket = StorageSingleton.getBucket();
        const options = {
            version: 'v4',
            action: 'read',
            expires: Date.now() + 10 * 60 * 1000, // URL valid for 10 minutes
        };

        const [url] = await bucket.file(getFileNameFromURL(file.fileUrl)).getSignedUrl(options);
        res.status(200).json({ url });
    } catch (error) {
        console.error('Failed to generate download URL', error);
        res.status(500).json({ error: 'Failed to generate download URL' });
    }
}

module.exports ={
    uploadUrl,
    downloadUrl,
    getFileByFileId
}
