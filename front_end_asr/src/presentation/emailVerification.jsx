import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {axiosInstance as axios,baseUrl, getPresignedUrl, } from 'utils'


const EmailVerification = () => {
  const [status, setStatus] = useState('loading'); // 'loading', 'success', 'error'
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  useEffect(() => {
    console.log('token', token)
    verifyToken();
  }, [token]);

  const verifyToken = async () => {
    try {
      const response = await axios.post(`${baseUrl()}/api/verify?token=${token}`);
    
      if (response.status === 200) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 p-4">
      {status === 'loading' && (
        <div>
          <div className="loader bg-blue-500 p-5 rounded-full flex space-x-3">
            <div className="w-5 h-5 bg-blue-100 rounded-full animate-bounce"></div>
            <div className="w-5 h-5 bg-blue-100 rounded-full animate-bounce"></div>
            <div className="w-5 h-5 bg-blue-100 rounded-full animate-bounce"></div>
          </div>
          <p className="text-center text-gray-500 mt-3">Verifying...</p>
        </div>
      )}
      {status === 'success' && (
        <div className="text-center">
          <p className="text-lg text-green-500">Email verified successfully!</p>
          <p className="text-gray-300 mt-2">You can now login to the portal.</p>
          <a href="/login" className="text-blue-500 hover:text-blue-700">Go to Login</a>
        </div>
      )}
      {status === 'error' && (
        <div className="text-center">
          <p className="text-lg text-red-500">Verification failed!</p>
          <p className="text-gray-300 mt-2">The link may be broken or expired.</p>
          <a href="/request-new-link" className="text-blue-500 hover:text-blue-700">Request a new link</a>
        </div>
      )}
    </div>
  );
};

export default EmailVerification;
