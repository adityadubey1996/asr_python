import React, { useEffect, useState } from "react";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { ExpandMore } from "@mui/icons-material";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import CircularProgress from "@mui/material/CircularProgress"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe, faMicrophone, faUser, faUsers } from "@fortawesome/free-solid-svg-icons";
import { red, grey, white } from "@mui/material/colors";
import {questions, fromListToDicts,fromDictsToList } from 'utils'
import {updateUserMetric,deleteUserMetric } from './utils'
import  './styles.css'

const WorkFlowTile = ({metric, deleteMetricFromList, updateMetricInList, shouldShowSelection,setSelectedMetric, selectedMetric}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [answers, setAnswers] = useState({});
  const [followUpAnswers, setFollowUpAnswers] = useState({});
  const [workflowTitle, setWorkflowTitle] = useState('');
  const [isEditMode, setEditMode] = useState(false)
  const [loading, setLoading] = useState(false)

useEffect(() => {
  setWorkflowTitle(metric?.workflowTitle)
const {answers , followUpAnswers} = fromListToDicts(metric?.customSettings)
if(answers && followUpAnswers){
setAnswers(answers)
setFollowUpAnswers(followUpAnswers)
}
if(shouldShowSelection && !setSelectedMetric){
console.error('setSelectedMetric is required when shouldShowSelection is true')
}
},[metric])

useEffect(() => {
console.log('selectedMetric from titile', selectedMetric)

},[selectedMetric])

const handleUpdateMetric = async (metricId, updatedData) => {
  setLoading(true);
  try {
    const updatedMetric = await updateUserMetric(metricId, updatedData);
    updateMetricInList(updatedMetric)
    setEditMode(false)
  } catch (err) {
    alert('Failed to update metric');
    console.error(err);
  } finally {
    setLoading(false);
  }
};

const handleDeleteMetric = async (metricId) => {

  setLoading(true);
  try {
    await deleteUserMetric(metricId);
    deleteMetricFromList(metricId)
    setEditMode(false)
  } catch (err) {
    alert('Failed to delete metric');
    console.error(err);
  } finally {
    setLoading(false);
  }
};


  const onDeleteClick = () => {
    handleDeleteMetric(metric.userMetricId)
    // Add deletion logic here
  };

  const onEditClick = () => {
    setEditMode(!isEditMode)
  }

  const onSaveClick = () => {

    let    updatedQuestions =  fromDictsToList(questions, answers, followUpAnswers)
    handleUpdateMetric(metric.userMetricId,{customSettings : updatedQuestions, workflowTitle : workflowTitle} )
  }



  const handleOptionChange = (id, option) => {
    const currentQuestion = questions.find((e) => e.id === id)

    const newAnswers = {
      ...answers,
      [currentQuestion.id]: option,
    };
    setAnswers(newAnswers);

 
  const newFollowUpAnswers = {...followUpAnswers};

  if (currentQuestion.optionsRequiringFollowUp.includes(option)) {
    // Ensure the structure exists to hold follow-up answers
    newFollowUpAnswers[currentQuestion.id] = newFollowUpAnswers[currentQuestion.id] || {};
  } else {
    // If new option does not require follow-up, clear previous entries
    delete newFollowUpAnswers[currentQuestion.id];
  }
  setFollowUpAnswers(newFollowUpAnswers);
  };

  const handleFollowUpAnswer = (id, text) => {
   const currentQuestion = questions.find((e) => e.id === id)
    setFollowUpAnswers({
      ...followUpAnswers,
      [currentQuestion.id]: text,
    });
  };

  const handleTextChange = (id, value) => {
    const currentQuestion = questions.find((e) => e.id === id)

    const newText = value;
    // For question type 'text', we ensure only numerical input for question 3
    if (id === 3 && isNaN(Number(newText))) {
      return;  // Ignore non-numeric input
    }
    
    setAnswers({
      ...answers,
      [currentQuestion.id]: newText,
    });
  };

const handleMultiChoiceChange = (id, isChecked, option) => {
    
    const currentSelections = answers[id] || [];
    if (isChecked) {
      setAnswers({
        ...answers,
        [id]: [...currentSelections, option]
      });
    } else {
      setAnswers({
        ...answers,
        [id]: currentSelections.filter(o => o !== option)
      });
      // Also remove the detailed input associated with this option
      const newFollowUpAnswers = {...followUpAnswers};
      delete newFollowUpAnswers[option];
      setFollowUpAnswers(newFollowUpAnswers);
    }
  };

  const handleDetailedInputChange = (questionId, option, value) => {
    setFollowUpAnswers({
        ...followUpAnswers,
        [questionId]: {
            ...followUpAnswers[questionId],
            [option]: value
        }
    });
};


  const renderOptions = (currentQuestion) => {
  
  
  
    switch (currentQuestion.type) {
      case "single-choice":
        return currentQuestion.options.map((option, index) => (
          <label key={index} className="block">
            <input
              type="radio"
              name={`question_${currentQuestion.id}`}
              value={option}
              disabled={!isEditMode}
              checked={answers[currentQuestion.id]?.includes(option)}
              onChange={(e) => handleOptionChange(currentQuestion.id, e.target.value)}
              className="mr-2"
            />
            {option}

            {currentQuestion.optionsRequiringFollowUp.includes(option) && answers[currentQuestion.id] === option && (
              <input
                type="text"
                disabled={!isEditMode}

                placeholder={currentQuestion.followUpQuestion}
                value={followUpAnswers[currentQuestion.id]?.[option] || ""}
                onChange={(e) => handleDetailedInputChange(currentQuestion.id,option,  e.target.value)}
                className="mt-2 block w-full p-2 bg-gray-700 text-white rounded"
              />
            )}
          </label>
        ));
  
      case "multi-choice":
        return (
          <div>
            {currentQuestion.options.map((option, index) => (
              <div key={index} className="mb-4">
                <label className="block">
                  <input
                                disabled={!isEditMode}

                    type="checkbox"
                    name={`question_${currentQuestion.id}`}
                    value={option}
                    checked={answers[currentQuestion.id]?.includes(option)}
                    onChange={(e) => handleMultiChoiceChange(currentQuestion.id, e.target.checked, option)}
                    className="mr-2"
                  />
                  {option}
                </label>
               
                {answers[currentQuestion.id]?.includes(option) && currentQuestion.optionsRequiringFollowUp.includes(option) && (
                  <textarea
                                disabled={!isEditMode}

                    placeholder={currentQuestion.followUpQuestion}
                    value={followUpAnswers[currentQuestion.id]?.[option] || ""}
                    onChange={(e) => handleDetailedInputChange(currentQuestion.id, option, e.target.value)}
                    className="mt-2 block w-full p-2 bg-gray-700 text-white rounded"
                    style={{ minHeight: '50px', resize: 'vertical' }}
                  />
                )}
              </div>
            ))}
          </div>
        );
  
      case "boolean":
        return currentQuestion.options.map((option, index) => (
          <label key={index} className="block">
            <input
                          disabled={!isEditMode}

              type="radio"
              name={`question_${currentQuestion.id}`}
              value={option}
              checked={answers[currentQuestion.id] === option}
              onChange={(e) => handleOptionChange(currentQuestion.id, e.target.value)}
              className="mr-2"
            />
            {option}
            {currentQuestion.optionsRequiringFollowUp.includes(option) && answers[currentQuestion.id] === option &&(
              <input
                            disabled={!isEditMode}

                type="text"
                placeholder={currentQuestion.followUpQuestion}
                value={followUpAnswers[currentQuestion.id]?.[option] || ""}
                onChange={(e) => handleDetailedInputChange(currentQuestion.id, option, e.target.value)}
                className="mt-2 block w-full p-2 bg-gray-700 text-white rounded"
              />
            )}
          </label>
        ));
  
      case "text":
        return (
          <input
                        disabled={!isEditMode}

            type="text"
            placeholder={currentQuestion.placeholder}
            value={answers[currentQuestion.id] || ""}
            onChange={(e) => handleTextChange(currentQuestion.id, e.target.value)}
            className="mt-2 block w-full p-2 bg-gray-700 text-white rounded"
          />
        );
  
      default:
        return null;
    }

  };

  function getClassName(isExpanded, metric, selectedMetric) {
    let baseClass = "flex flex-col text-white p-4 mb-4 border border-gray-800 rounded-lg";
  
    // Check if the item is expanded
    if (isExpanded) {
      // Use gray background when expanded
      return `${baseClass} bg-gray-600`;
    } else if (metric.userMetricId === selectedMetric) {
      // Use green background and hover effect if selected and not expanded
      return `${baseClass} bg-green-500 hover:scale-105 transition-transform duration-200 ease-in-out`;
    } else {
      // Use gray background and hover effect if not selected and not expanded
      return `${baseClass} bg-gray-600 hover:scale-105 transition-transform duration-200 ease-in-out`;
    }
  }

  return (
    <div className = {getClassName(isExpanded, metric, selectedMetric)} onClick={() => {
      if(shouldShowSelection && !isExpanded){
        setSelectedMetric(metric.userMetricId)
      }
    }}>
     {loading ? <div className="flex justify-center items-center w-full h-screen"><CircularProgress/></div> : (

<>
    



     
      <div className="flex justify-between items-center">
     
        <span className="font-semibold text-xl text-gray-200">
          {workflowTitle}
        </span>
     
        <div className="flex items-center space-x-2">
        {isExpanded && <Tooltip title="Delete">
            <IconButton size="small" onClick={onDeleteClick}>
              <DeleteIcon style={{ color: red[500] }} />
            </IconButton>
          </Tooltip>}
          {isExpanded && <Tooltip title="Edit">
            <IconButton size="small" onClick={onEditClick}>
              {/* <EditIcon  style={{ color: grey[300] }}/> */}
            </IconButton>
          </Tooltip>}
          <Tooltip title="Expand/Collapse">
            <IconButton onClick={() => {
              setIsExpanded(!isExpanded)
              if(shouldShowSelection){
                setSelectedMetric(null);

              }
            }}>
              <ExpandMore style={{ color: grey[300] }} />
            </IconButton>
          </Tooltip>
         
        </div>
      </div>
      
      {isExpanded && !loading && questions.map((currentQuestion) => {
        if(currentQuestion?.doNotShowOnEditMode) return <></>;
        
        return  (
 <div className="p-4">
 <h1 className="text-l font-bold mb-4">{currentQuestion.text}</h1>
<div className="space-y-4">
{renderOptions(currentQuestion)}
</div>

</div>
        )
      })
     
         
      }
      {isEditMode && <div className="flex  mt-6">
      <button
        onClick={onSaveClick}
        className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Save
      </button>
     
    </div>}
    </>
    )}
    
    </div>
  );
};

export default WorkFlowTile;
