const db = require("../models");
const { catchError } = require("../utils/catchBlock");
const { delay } = require("../utils/functions");

const createFileEntry = async (req, res) => {
  const id = req.user.id;
  const { fileUrl, status } = req.body;
  try {
    const newFile = await db.audioFiles.create({
      fileUrl: fileUrl ? fileUrl : "NA",
      status,
      userId: id,
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
//TODO: connect websocket server to this server
const getFileByIdForWebsocket = async (req,res) => {
  const {fileId, userId} = req
  try{

  }
  catch(error){

  }
}
  
const updateFile = async (req, res) => {
  console.log('from updateFile')
  const { fileId, fileUrl ,status } = req.body;
  const id = req.user.id;
  try {
    await db.audioFiles.update(
      { fileUrl,status},
      { where: { userId: id, fileId } }
    );
  //  await delay(3000);
   return res.status(200).json({}) 
  } catch (error) {
    console.log('error from updateFIle', error)
    catchError(res,error)
  }
};

module.exports = {
  createFileEntry,
  getAllFiles,
  updateFile
};
