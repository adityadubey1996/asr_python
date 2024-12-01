import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {MainContent} from './transcription'
export const TranscriptionDashboard = () => {
    const { fileId } = useParams(); 

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    if(!fileId){
        return ( <div className="bg-gray-900 h-screen flex flex-col items-center justify-center text-white">
        <h1 className="text-4xl font-bold">File Not Found</h1>
        
    </div>)
    }

    return (

        <div className="flex h-screen w-full bg-gray-800 text-gray-200">  {/* Ensure full width */}
            {/* Left Sidebar */}
            <div className={`transition-all ease-in-out duration-500 ${isSidebarOpen ? 'w-1/3' : 'w-0'} bg-gray-700 relative flex-shrink-0 border-r-2 border-gray-600`}>
                <button className="absolute top-1/2 right-0 -mr-6 transform -translate-y-1/2 bg-blue-500 text-white p-2 rounded-full focus:outline-none" onClick={toggleSidebar}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className={`w-6 h-6 transform ${isSidebarOpen ? '' : 'rotate-180'}`}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                {/* Your content here */}
                <p className="p-4">Left Content</p>
            </div>

            {/* Main Content */}
            <div className={`flex-auto transition-all ease-in-out duration-500 ${isSidebarOpen ? 'w-2/3' : 'w-full'} bg-gray-800`}>
               <MainContent />
            </div>
        </div>
    );
};






