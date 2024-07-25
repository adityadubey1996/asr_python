import React from 'react';
import {  Modal } from "@mui/material";

function DeleteConfirmationModal({ onUploadClick, setOnUploadClick, fileIdToBeDeleted, setFileIdToBeDeleted , onDeleteClick}) {


  const handleDeleteConfirmation = async () => {
    onDeleteClick(fileIdToBeDeleted)
  };

  const handleSkip = () => {
    setFileIdToBeDeleted(null)
    setOnUploadClick(false); // Close modal
  };

  return (
    <Modal
      open={onUploadClick}
      onClose={() => {
        setFileIdToBeDeleted(null)
        setOnUploadClick(false);
      }}
      className="flex items-center justify-center p-4 overflow-auto"
    >
        {!fileIdToBeDeleted ? <h2 className="text-lg font-semibold"> File Id Not Found </h2> : (

<div
        className="
          bg-gray-800 text-white border border-gray-700 rounded-lg
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
        style={{ maxHeight: "90vh" }}
      >

        
      
        <h2 className="text-lg font-semibold">Confirm Deletion</h2>
        <p className="mt-2 mb-4">
        Are you sure you want to delete this file? This action cannot be undone.
        </p>
       
          <div className="flex justify-between">
            <button
              onClick={handleDeleteConfirmation}
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            >
             Yes
            </button>
            <button
              onClick={handleSkip}
              className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
          </div>
          
   
    
        
       
      </div>

        )}
      
    </Modal>
  );
}

export default DeleteConfirmationModal;
