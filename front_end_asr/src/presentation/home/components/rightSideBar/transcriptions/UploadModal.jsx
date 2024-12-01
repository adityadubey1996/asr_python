import React, { useEffect } from 'react'
import { FilePreview, Metrics } from "./ModalData";
import { Divider, Box, Button, Paper, Modal } from "@mui/material";
import Workflow from '../workflow/index'

const UploadModal = ({modalIndex, onUploadClick,setOnUploadClick, setModalIndex, setSelectedFile, selectedFile, uploadFile, setSelectedMetric,selectedMetric }) => {

  
  const showModalContent = () => {
        if (modalIndex === 0 && selectedFile) {
          return <FilePreview selectedFile={selectedFile} />;
        }
        if (modalIndex === 1) {
          return <Workflow shouldShowSelection={true} setSelectedMetric = {setSelectedMetric}  selectedMetric = {selectedMetric} />;
        }
      };

      const handleNext = () => {

        if(modalIndex === 1){
          setOnUploadClick(false)
          uploadFile(selectedFile)
          setModalIndex(null)
        } else {
          setModalIndex(modalIndex + 1);
        }
      };

      const handleBack=()=>{
        if(modalIndex > 0){
          setModalIndex(modalIndex - 1)
        }
      }
    
    return (
    <Modal
  open={onUploadClick}
  onClose={() => {
    setSelectedFile(null);
    setModalIndex(0);
    setOnUploadClick(false);
  }}
  className="flex items-center justify-center p-4 overflow-auto"
>
  <div
    className="
      bg-gray-800 border border-gray-700 rounded-lg
      flex flex-col w-full max-w-lg p-4
      overflow-y-auto
      mx-4
      sm:max-w-2xl sm:w-10/12
      md:w-8/12 md:max-w-3xl
      lg:w-6/12 lg:max-w-4xl
      xl:w-5/12 xl:max-w-lg
      2xl:w-4/12 2xl:max-w-lg
      min-h-1/2 
    "
    style={{"maxHeight" : "90vh"}}
  >
    {showModalContent()}
    <div className="mt-4 flex justify-end space-x-2">
      {modalIndex > 0 && (
        <button
          onClick={handleBack}
          className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Back
        </button>
      )}
      <button
        onClick={handleNext}
        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {modalIndex === 1 ? "Upload & Next" : "Next"}
      </button>
    </div>
  </div>
</Modal>

    )
}

export default UploadModal