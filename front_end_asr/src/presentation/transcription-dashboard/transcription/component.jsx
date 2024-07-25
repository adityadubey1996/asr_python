import { Header } from "./header.jsx/component"
import { TranscriptionItems } from "./transcription-item/component"
import { MediaPlayer } from "./media-player/component"
import  parseSRT  from './hardCodedSrtFile';
import React, { useEffect, useRef, useState } from 'react';
import {axiosInstance as axios,baseUrl, getPresignedUrl, } from 'utils'

export const MainContent = () => {
    const [currentTime, setCurrentTime] = useState(0);
    const [subtitle, setSubtitles] = useState([])
    const [isPlaying, setIsPlaying] = useState(false);
    const [subTitleSelectedTime, setSubTitleSelectedTime] = useState(null)
    const [error, setError] = useState(null)
    const audioRef = useRef(null); 
    useEffect(() => {
        async function testign11(){
        try{

            const fileName = 'file.srt';
            const result = await axios.get(`${baseUrl()}/api/generate-presigned-url`, {
                params: { fileName } // Ensures proper encoding
            });
            console.log('result', result.data.signedUrl)
            const fetchAndParseSRT = (url) => {
                fetch(url)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Failed to fetch the file');
                        }
                        return response.text();
                    })
                    .then(data => {
                        console.log('data', data)
                        const parsedSubtitles = parseSRT(data);
                        console.log('parsedSubtitles',parsedSubtitles)
                        
                        setSubtitles(parsedSubtitles);
                        setError(null);
                    })
                    .catch(err => {
                        console.error('Error fetching or parsing the SRT file:', err);
                        setError(err.message);
                        setSubtitles([]);
                    });
            };
            fetchAndParseSRT(result.data.signedUrl)
        }
        catch(e){
            console.error('error from parent', e)
        }
        finally{

        }
    }
    testign11()
    }, [])



    return ( 
   
    <div className="bg-gray-600 text-gray-200   flex flex-col h-full">
    <div className="p-4 h-1/6" style={{minHeight: '80px', maxHeight: '100px'}}>
      <h2 className="text-2xl font-semibold mb-4">Transcript</h2>
    </div>
    <div className="flex-1 overflow-y-scroll p-4 h-4/6">
        {error ? <div>Error while Downloading transcription</div> :         <TranscriptionItems subtitles={subtitle} setCurrentTime={setCurrentTime} currentTime={currentTime} togglePlayPause={setIsPlaying} setSubTitleSelectedTime={setSubTitleSelectedTime} audioRef={audioRef}/> 
}



      {/* <div className="bg-blue-100 p-4 rounded-lg text-center">
      <p className="text-gray-800">Unlock more features</p>
      <p className="text-gray-600 text-sm mb-2">You can only view 3 minutes of file transcripts in Free Plan. Upgrade your plan to unlock more features!</p>
      <button className="bg-blue-500 text-white px-4 py-2 rounded">Unlock Transcript</button>
    </div> */}
    </div>

        <MediaPlayer  currentTime={currentTime} setCurrentTime={setCurrentTime} setIsPlaying={setIsPlaying} isPlaying={isPlaying} subTitleSelectedTime={subTitleSelectedTime} setSubTitleSelectedTime={setSubTitleSelectedTime} audioRef={audioRef}/>
    
  </div>

    )
    }
    
    export default MainContent