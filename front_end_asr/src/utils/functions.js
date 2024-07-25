 import {questions} from './constants'

  export const getFileNameFromURL = (url) => {
    const fileNameWithPrefix = url.substring(url.lastIndexOf('/') + 1); // Get the part of the URL after the last '/'
    const fileName = fileNameWithPrefix.substring(fileNameWithPrefix.lastIndexOf('_') + 1); // Extract the part after the last '_'
    return fileName;
};

  export const getFileExtensionFromURL = (url) => {
    const fileName = url.substring(url.lastIndexOf('/') + 1);
    const extension = fileName.substring(fileName.lastIndexOf('.') + 1);
    return extension;
  };

 export const getFileSizeFromURL = async (url) => {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const contentLength = response.headers.get('Content-Length');
      return contentLength ? parseInt(contentLength, 10) : null;
    } catch (error) {
      console.error('Error fetching file size:', error);
      return null;
    }
  };

 export const getFileSubNameFromURL = (url) => {
    return url.substring(url.lastIndexOf('/') + 1);
  };


  const [items, setItems] = ([
    {
      id: 1,
      fileName: "file1.txt",
      timestamp: "2024-05-23 10:00",
      size: "15KB",
      language: "EN",
      noOfSpeakers: 1,
      audioType: "General",
    },
  ]);


  export const fromDictsToList = (questions, answers, followUpAnswers) =>{
    return questions.map(question => ({
        question: question.text,
        answerSelected: answers[question.id],
        textInfoTyped: followUpAnswers[question.id] || null
    }));



}


export const  fromListToDicts = (questionList) => {
  const answers = {};
  const followUpAnswers = {};
try{
  questionList.forEach(item => {
      const questionId = questions.find((e) => e.text === item.question)?.id  
 
      answers[questionId] = item.answerSelected;

      if (item.textInfoTyped && Object.keys(item.textInfoTyped).length > 0) {
          followUpAnswers[questionId] = item.textInfoTyped;
      }
  });
  return { answers, followUpAnswers };

}
catch(e){
  console.error('Error from utils fromListToDicts', e)
  return {};
}

}

  