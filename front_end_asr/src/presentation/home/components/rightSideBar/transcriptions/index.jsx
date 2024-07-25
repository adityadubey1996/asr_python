import React, { useState, useRef, useEffect } from "react";
import Item from "./Item";
import { useSelector } from "react-redux";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-regular-svg-icons";
import { Divider, Box, Button, Paper, Modal } from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import {axiosInstance as axios,baseUrl, uploadFileToGCS, } from 'utils'
import UploadModal from './UploadModal'
import VerificationModal from "components/confirmModal";
import DeleteConfirmationModal from 'components/deleteConfirmModal'
import { useNavigate } from "react-router-dom";

const Transcriptions = () => {
  const [fileList, setFileList] = useState([]);
  const [selectedFile, setSelectedFile] = useState("");
  const [onUploadClick, setOnUploadClick] = useState(false)
  const fileInputRef = useRef(null);
  const [modalIndex, setModalIndex] = useState(0);
  const [fileIdUploading, setFileIdUploading] = useState(null)
  const[uploadPercentage, setUploadPercentage] = useState(null)
  const  [selectedMetric,  setSelectedMetric] = useState(null);
  const [progress, setProgress]= useState({})
  const token = useSelector((state) => state?.user?.userData?.access_token)
const [verificationModal, setVerificationModal] = useState(false)
const [onDeleteClick, setOnDeleteClick] = useState(false)
const  [fileIdToBeDeleted,setFileIdToBeDeleted] = useState()
const navigate = useNavigate();
  const deleteFileDueToProcessingError = async (fileId) => {
    try{
    const res = await axios.delete(`${baseUrl()}/api/audio-files/${fileId}`);
    if (res.status === 200) {
    
  setFileList(currentFiles => currentFiles.filter(file => file.fileId !== fileId));
 

  } else {
      alert("Something went wrong while deleting the file");
    }
  }
  catch(e){
    alert('something went wrong with error', e)
  }
  }

  useEffect(() => {
    console.log('fileList', fileList)
  
    return () => {
      
    }
  }, [fileList])
  



  const getFiles = async () => {
    const res = await axios.get(`${baseUrl()}/api/audio-files`);
    if (res.status === 200) {
    
      setFileList(res.data);
    } else {
      alert("Something went wrong");
    }
  };

  useEffect(() => {
    getFiles();
    if(!token){
      alert('File Upload not available')
      return;
    }

    return () => {
      
    };
  }, []);



  const handleShowTranscription = (id) => {
    console.log("Show transcription for item", id);
    navigate('/transcription-dashboard/101')
    // setVerificationModal(true)
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    event.target.value = null;
    setOnUploadClick(true)
  };

  // Upon successful upload or when an error occurs
const resetProgress = (fileId) => {
  setProgress(prev => {
      const updatedProgress = { ...prev };
      delete updatedProgress[fileId]; // Remove the progress entry for this file
      return updatedProgress;
  });
};





  const uploadFile = async (file) => {
    let fileId = null; // This will hold the ID of the file entry
    try {
        // Create an entry in the database with the initial status 'processing'
        const initResponse = await axios.post(`${baseUrl()}/api/audio-file`, {
            status: "processing",
            userMetricId: selectedMetric
        });

        if (initResponse.status === 200 && initResponse.data) {
            fileId = initResponse.data.fileId;
            setFileIdUploading(fileId);
            setFileList(prev => [...prev, initResponse.data]);
            const { name, type} = file
            const dateTimeString = new Date().toISOString().replace(/:/g, '-').replace(/\..+/, '');
            const uniqueFileName = `${dateTimeString}_${fileId}_${name}`;
            // Upload the file using the pre-signed URL
            const uploadStatus = await uploadFileToGCS(file,fileId, uniqueFileName,type , progress => {
              console.log('prgress fromu ploadStatus ', progress)
              setProgress(prev => ({
                ...prev,
                [progress.fileId]: progress.percentCompleted
            }));
            });
            if (uploadStatus) {
              // Generate a unique file name
           

          
                // If the upload is successful, update the status in the database to 'uploaded'
                const updateResponse = await axios.put(`${baseUrl()}/api//audio-files`, {
                    fileId: fileId,
                    fileUrl: uniqueFileName,
                    status: 'uploaded'
                });

                

                if (updateResponse.status === 200 && updateResponse.data) {
                  console.log(updateResponse.data)
                  resetProgress(fileId)
                  setFileList(prev => {
                    const updatedList = [...prev]
                    const index = updatedList.findIndex((e) => e.fileId === updateResponse.data.fileId)
                    if(index !== -1){
                      updatedList[index] = {...updatedList[index], ...updateResponse.data}
                   
                    }
                    return updatedList
                  });
                    console.log('File status updated to uploaded.');
                } else {
                    throw new Error('Failed to update file status.');
                }
            }
        }
    } catch (error) {
        console.error('Upload process failed', error);
        alert('Upload process failed');
        
        // Clean up any created file record on error if the file was actually created
        if (fileId) {
            deleteFileDueToProcessingError(fileId);
        }
    }
}


 



  return (
    <Container maxWidth="lg" className="p-4">
      <form onSubmit={(e) => e.preventDefault()}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h6" fontWeight="bold" className="text-gray-200">
            <FontAwesomeIcon icon={faEdit} /> Transcriptions
          </Typography>
          <Button
            
            variant="contained"
            color="primary"
            startIcon={<UploadIcon />}
            onClick={handleUploadClick}
          >
            Upload
          </Button>
         
        </Box>
        <input
          type="file"
          accept="audio/*,video/*"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
         
        />
      </form>
      <Divider />
      <br />
      {fileList && Array.isArray(fileList) &&  fileList.length === 0
        ? <div class="flex items-center justify-center">
        <h1 class="text-xl font-bold text-gray-200">Welcome! Please upload a file to begin.</h1>
    </div>
        : fileList.map((item) => (
            <Item
              
              key={item.fileId}
              item={item}
              onShowTranscription={handleShowTranscription}
              onDeleteClick={() => {
                setOnDeleteClick(true)
                setFileIdToBeDeleted(item.fileId)
              }}
              progress={progress}
            />
          ))}
    { onUploadClick && <UploadModal
      modalIndex ={modalIndex}
      onUploadClick={onUploadClick}
      setOnUploadClick={setOnUploadClick}
      setModalIndex={setModalIndex}
      setSelectedFile={setSelectedFile}
      uploadFile={uploadFile}
      selectedFile={selectedFile}
      selectedMetric={selectedMetric}
      setSelectedMetric = {setSelectedMetric}
     />}
     {verificationModal && <VerificationModal onUploadClick={verificationModal} setOnUploadClick={setVerificationModal}/>}
     {onDeleteClick && <DeleteConfirmationModal onUploadClick = {onDeleteClick} fileIdToBeDeleted = {fileIdToBeDeleted} setFileIdToBeDeleted = {setFileIdToBeDeleted} setOnUploadClick = {setOnDeleteClick} onDeleteClick = {(fileId) => deleteFileDueToProcessingError(fileId).then(() => setOnDeleteClick(false)).catch((e)=> {
      console.error('error while deleting file', e)
     }).finally(() => {setOnDeleteClick(false)
      setFileIdToBeDeleted(null)})}/>}
    </Container>
  );
};

export default Transcriptions;

