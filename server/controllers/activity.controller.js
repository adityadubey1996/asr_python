const db = require("../models");
const { catchError } = require("../utils/catchBlock");
const StorageSingleton  = require('../utils/strageClass')

  // Validation function to check required fields
  const validateFields = (fileUrl ,  status ,userMetricId) => {
    const errors = [];

    if (!status) {
      errors.push("status is required.");
    } else if (!['uploaded', 'processing', 'completed', 'failed'].includes(status)) {
      errors.push("status must be one of the following: 'uploaded', 'processing', 'completed', 'failed'.");
    }
    if (!userMetricId) {
      errors.push("userMetricId is required.");
    } else if (isNaN(parseInt(userMetricId))) {
      errors.push("userMetricId must be a valid number.");
    }

    return errors;
  };

const createFileEntry = async (req, res) => {
  const id = req.user.id;
  const { fileUrl, status, userMetricId } = req.body;
  try {
    const errors = validateFields(fileUrl, status ,userMetricId  );
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }
    const newFile = await db.audioFiles.create({
      fileUrl: fileUrl ? fileUrl : "NA",
      status,
      userId: id,
      userMetricId : userMetricId,
    });
    return res.status(200).json(newFile);
  } catch (error) {
    catchError(res, error);
  }
};

const getAllFiles = async (req, res) => {
    const id = req.user.id;
    try {
      const files = await db.audioFiles.findAll({
        where: { userId: id },
        order: [['createdAt', 'DESC']] 
      });
      return res.status(200).json(files);
    } catch (error) {
      console.log('error', error)
      catchError(res, error);
    }
  };



const updateFile = async (req, res) => {
  const { fileId, fileUrl, status } = req.body;
  const id = req.user.id;
  try {
    const [updated] = await db.audioFiles.update(
      { fileUrl, status },
      { where: { userId: id, fileId } }
    );

    if (updated) {
      const updatedFile = await db.audioFiles.findOne({ where: { userId: id, fileId } });
      if (updatedFile) {
        return res.status(200).json(updatedFile);  // Return the updated file details to the client
      } else {
        return res.status(404).json({ error: 'No file found with the specified ID.' });
      }
    } else {
      return res.status(404).json({ error: 'File update failed or no changes were made.' });
    }
  } catch (error) {
    console.log('Error from updateFile', error);
    catchError(res, error);
  }
};



const deleteFile = async(req, res) => {
  const {id :fileId} = req.params


  try{
    if (!fileId) {
      // If fileId is not provided, send a 400 Bad Request response
      return res.status(400).json({ message: 'File ID not provided' });
  }

  // Find the file in the database to ensure it exists
  const fileToBeDeleted = await db.audioFiles.findOne({
      where: { fileId: fileId }
  });


  if (!fileToBeDeleted) {
      // If the file does not exist, send a 404 Not Found response
      return res.status(404).json({ message: 'File not found' });
  }

   // If the file has a URL pointing to a bucket, delete it from the bucket
   if (fileToBeDeleted.fileUrl) {
    const bucket = StorageSingleton.getBucket();
    const fileName = extractFileName(fileToBeDeleted.fileUrl); // Helper function to extract file name from URL
    await bucket.file(fileName).delete();
  }

  // If the file exists, delete it
  await fileToBeDeleted.destroy();

  // Send a 200 OK response indicating the file was successfully deleted
  return res.status(200).json({ message: 'File deleted successfully' });

  }
  catch(error){
    catchError(res,error)
  }
}

const extractFileName = (url) => {
  const fileNameWithPrefix = url.substring(url.lastIndexOf('/') + 1); // Get the part of the URL after the last '/'
  const fileName = fileNameWithPrefix.substring(fileNameWithPrefix.lastIndexOf('_') + 1); // Extract the part after the last '_'
  return fileName;
}

module.exports = {
  createFileEntry,
  getAllFiles,
  updateFile,
  deleteFile,
};
