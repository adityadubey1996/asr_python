import React from 'react';

const ErrorComponent = ({ message }) => {
    return (
        <div className="bg-gray-900 h-screen flex flex-col items-center justify-center text-white">
            <h1 className="text-4xl font-bold">An Error Occurred</h1>
            <p className="text-xl mt-2">{message || "Something went wrong!"}</p>
        </div>
    );
};

export default ErrorComponent;
