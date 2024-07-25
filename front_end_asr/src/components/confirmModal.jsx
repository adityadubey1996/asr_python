import React, { useState } from 'react';
import {  Modal } from "@mui/material";
import {axiosInstance as axios} from 'utils'

function VerificationModal({ onUploadClick, setOnUploadClick }) {
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSendLink = async () => {
    setIsSending(true);
    try {
        await axios.post('/api/send-verification', { email: '' });
        setIsSending(false);
        setIsSent(true);
        setTimeout(() => {
            setIsSent(false);
            setOnUploadClick(false); // Close modal after showing tick animation
        }, 2000);
    } catch (error) {
        console.error('Error:', error);
        alert('Error sending verification link: ' + (error.response?.data?.message || error.message));
        setIsSending(false);
    }
  };

  const handleSkip = () => {
    setOnUploadClick(false); // Close modal
  };

  return (
    <Modal
      open={onUploadClick}
      onClose={() => {
        setOnUploadClick(false);
      }}
      className="flex items-center justify-center p-4 overflow-auto"
    >
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
        <h2 className="text-lg font-semibold">Verify Your Account</h2>
        <p className="mt-2 mb-4">
          To ensure you can receive notifications after transcription, please verify your account.
        </p>
        {!isSending && !isSent && (
          <div className="flex justify-between">
            <button
              onClick={handleSendLink}
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Send Link
            </button>
            <button
              onClick={handleSkip}
              className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Skip for Now
            </button>
          </div>
        )}
        {isSending && (
          <div className="flex justify-center items-center">
            <div className="loader"></div> {/* You need to define CSS for this loader */}
          </div>
        )}
        {isSent && (
          <div className="flex justify-center items-center">
            <div className="checkmark animate-scale">✔</div> {/* Define animations and styles */}
          </div>
        )}
      </div>
    </Modal>
  );
}

export default VerificationModal;
