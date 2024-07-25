import {axiosInstance as axios11} from './axios-interceptor';
import { baseUrl } from './url';



export const getPresignedUrl = async (fileName, contentType) => {
    try {
        console.log('fileName contentType', contentType, fileName)
        const response = await axios11.post(`${baseUrl()}/api/cloud-postsignedUrl`, {
         fileName, contentType 
        });
        return response.data.signedUrl;
    } catch (error) {
        console.error('Error obtaining presigned URL', error);
        throw error;
    }
};

export const uploadFileToGCS = async (file, fileId, fileName,fileType,  onProgress = () => {}) => {
 
    return new Promise(async (resolve, reject) => {
        try {
            const url = await getPresignedUrl(fileName, fileType);
            if (!url) {
                throw Error('URL not found');
            }

            const xhr = new XMLHttpRequest();
            xhr.open('PUT', url, true);
            xhr.setRequestHeader('Content-Type', fileType || 'application/octet-stream');

            // Handle the progress event
            xhr.upload.onprogress = function(event) {
                if (event.lengthComputable) {
                    const percentCompleted = Math.round((event.loaded * 100) / event.total);
                    
                    onProgress({percentCompleted,fileId}); // Callback to update progress in the UI
                }
            };

            // Handle the response from the server
            xhr.onload = function() {
                if (xhr.status === 200) {
                    console.log('File uploaded successfully');
                    resolve({ status: 'success', data: xhr.responseText }); // Return an object with status and data
                } else {
                    onProgress({percentCompleted : null,fileId})

                    reject(new Error(`HTTP error! status: ${xhr.status}`));
                }
            };

            // Handle network errors
            xhr.onerror = function() {
                console.error('Error during the upload process.');
                onProgress({percentCompleted : null,fileId})

                reject(new Error('Network or other error during the upload process.'));
            };

            xhr.send(file);
        } catch (error) {
            console.error('Failed to upload file', error);
            onProgress({percentCompleted : null,fileId})
            reject(error);
        }
    });
};
