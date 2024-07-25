import React, { useEffect, useRef } from 'react';

export const TranscriptionItems = ({ subtitles, currentTime, setCurrentTime, togglePlayPause, setSubTitleSelectedTime, audioRef}) => {
    const subtitleRefs = useRef([]);
    subtitleRefs.current = subtitles.map((_, i) => subtitleRefs.current[i] ?? React.createRef());
    const formatTime = (timeString) => {
        const [hours, minutes, seconds] = timeString.split(":");
        return parseFloat(hours) * 3600 + parseFloat(minutes) * 60 + parseFloat(seconds);
    };

    const handlePlayFrom = (startTime) => {
        if(audioRef.current){
            setCurrentTime(formatTime(startTime))
            audioRef.current.currentTime = formatTime(startTime);
        }
        togglePlayPause(true);  
    };

    useEffect(() => {
        const activeIndex = subtitles.findIndex(sub => {
            const startTime = formatTime(sub.start);
            const endTime = formatTime(sub.end);
            return currentTime >= startTime && currentTime <= endTime;
        });
        
        if (activeIndex !== -1 && subtitleRefs.current[activeIndex].current) {
            subtitleRefs.current[activeIndex].current.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            });
        }
    }, [currentTime, subtitles]);
if(subtitles && Array.isArray(subtitles) && subtitles.length > 0){
    return (
        <div className="flex-1 overflow-y-scroll p-4">
            {subtitles.map((sub, index) => {
                const startTime = formatTime(sub.start);
                const endTime = formatTime(sub.end);
                const isActive = currentTime >= startTime && currentTime <= endTime;
                return (
                    <div 
                        ref={subtitleRefs.current[index]} 
                        key={sub.id} 
                        className={`mb-4 bg-transparent`}
                    >
                        <div className="flex items-start mb-2">
                            
                            {/* <span className="bg-yellow-200 text-yellow-800 rounded-full px-2 py-1 mr-2">Speaker 1</span> */}
                            <span className="text-gray-400">{sub.start}</span>
                            <button onClick={() => handlePlayFrom(sub.start)} className="mr-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.293a1 1 0 00-1.555.832v4.586a1 1 0 001.555.832l3.197-2.293a1 1 0 000-1.664z" />
                                    </svg>
                                </button>
                        </div>
                        <p className={`${isActive ? 'text-yellow-300' : 'text-gray-200'}`}>
                            {sub.text}
                        </p>
                    </div>
                );
            })}
        </div>
    );
        }
        return (
            <>No transcription Found</>
        )
};
