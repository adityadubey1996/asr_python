import React, { useEffect, useRef, useState } from 'react';
import {axiosInstance as axios,baseUrl, getPresignedUrl, } from 'utils'

export const MediaPlayer = ({currentTime, setCurrentTime, isPlaying, setIsPlaying, audioRef }) => {

    const [isLoading, setIsLoading] = useState(false);
    const [audioUrl, setAudioUrl] = useState(null);
    const [duration, setDuration] = useState(0);
    const [error, setError] = useState(null)

   

    const togglePlayPause = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleSeek = (time) => {
        if (audioRef.current) {
            audioRef.current.currentTime = time;
            setCurrentTime(time);

        }
    };

    const updateProgress = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
            setDuration(audioRef.current.duration);

        }
    };

    useEffect(() => {
        async function fetchSignedUrl() {
            setIsLoading(true);
            try {
                const fileName = 'McLaren P1_ The Widowmaker! _ Top Gear _ Series 21 _ BBC.mp4';
                const result = await axios.get(`${baseUrl()}/api/generate-presigned-url`, {
                    params: { fileName } // Ensures proper encoding
                });
                console.log('result from fetchSignedUrl',result )
                setAudioUrl(result.data.signedUrl);
            } catch (error) {
                console.log('Error while fetching URL', error)
                console.error('Error fetching signed URL: from media player', error);
                setError(error)

            } finally {
                setIsLoading(false);
            }
        }
        fetchSignedUrl();
    }, [baseUrl]);



    useEffect(() => {
        if (isPlaying) {
            audioRef.current?.play();
        } else {
            audioRef.current?.pause();
        }
    }, [isPlaying]);

    if (isLoading) {
        return <div>Loading...</div>;
    }
    if(error){
        return (
            <div className="flex flex-col items-center justify-center space-y-2 p-4">
                Error while downloading File
</div> 
        )
    }

    return (
        <div className="flex flex-col items-center justify-center space-y-2 p-4">
            {audioUrl && (
                <audio
                    ref={audioRef}
                    src={audioUrl}
                    onTimeUpdate={updateProgress}
                    onLoadedMetadata={updateProgress}
                />
            )}

            <div className="flex space-x-2">
                <button onClick={() => handleSeek(Math.max(0, currentTime - 3))} className="bg-gray-200 text-gray-800 p-2 rounded-full hover:bg-gray-300">
                    -3s
                </button>
                <button onClick={togglePlayPause} className="bg-gray-200 text-gray-800 p-2 rounded-full hover:bg-gray-300">
                    {isPlaying ? 'Pause' : 'Play'}
                </button>
                <button onClick={() => handleSeek(Math.min(duration, currentTime + 3))} className="bg-gray-200 text-gray-800 p-2 rounded-full hover:bg-gray-300">
                    +3s
                </button>
            </div>

            <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={(e) => handleSeek(parseFloat(e.target.value))}
                className="w-full cursor-pointer"
                style={{ backgroundSize: `${(currentTime / duration) * 100}% 100%` }}
            />
        </div>
    );
};


