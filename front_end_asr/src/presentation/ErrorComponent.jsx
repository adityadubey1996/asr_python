import React from 'react';
import { useNavigate } from 'react-router-dom';

const ErrorComponent = ({ message, errorDetails }) => {
    // const navigate = useNavigate();
    
    return (
        <div className="bg-gray-900 text-white text-center p-4 h-screen flex flex-col justify-center items-center">
            <h1 className="text-4xl font-bold mb-3">Critical Error Occurred</h1>
            <p className="text-lg mb-5">{message}</p>
            <details className="bg-white text-red-600 p-2 rounded text-left">
                <summary className="font-bold">Error Details</summary>
                {errorDetails}
            </details>
            <button
                // onClick={() => navigate('/')}
                className="mt-4 bg-white text-red-600 font-bold py-2 px-6 rounded hover:bg-red-50"
            >
                Return Home
            </button>
        </div>
    );
};

export default ErrorComponent;
