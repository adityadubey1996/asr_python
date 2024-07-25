import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFoundComponent = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-gray-900 h-screen flex flex-col items-center justify-center text-white">
            <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
            <p className="text-xl mt-2">Sorry, the page you are looking for does not exist.</p>
            <button onClick={() => navigate('/')} className="mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
                Go Home
            </button>
        </div>
    );
};

export default NotFoundComponent;
