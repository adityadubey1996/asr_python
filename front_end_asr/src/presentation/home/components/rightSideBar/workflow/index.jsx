import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserMetrics } from "reducers/metric.reducer";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-regular-svg-icons";

import { Divider, Box, Button, Paper, Modal,CircularProgress  } from "@mui/material";
import WorkFlowTile from './WorkFlowTile'
import { useNavigate } from "react-router-dom";

const Workflow = ({shouldShowSelection, selectedMetric, setSelectedMetric}) => {
  const dispatch = useDispatch();
  const [userMetrics, setUserMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
const navigate  = useNavigate()


  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const result = await dispatch(getUserMetrics());
        if (result.payload &&Array.isArray(result.payload) &&  result.payload.length > 0) {

          const userMetric = result.payload.map((e) => {try{return {...e, customSettings : JSON.parse(e.customSettings)}} catch(e) {
            return null
          }}).filter((e) => e );
         
          setUserMetrics(userMetric);
        } else {
          console.error("Error fetching user metrics: No data found");
        }
      } catch (error) {
        console.error("Error fetching user metrics:", error);
      } finally {
        setLoading(false);
      }
    }
   
      fetchData();
  
  }, [dispatch]);  


  
 

  return (
    <Container  maxWidth="lg" className="p-4">
    <Box
       display="flex"
       justifyContent="space-between"
       alignItems="center"
       mb={3}
     >
        <Typography variant="h6" fontWeight="bold" className="text-gray-200">
         Workflow
       </Typography>
       <Button
            
            variant="contained"
            color="primary"
          
            onClick={() =>{
              console.log('Add Workflow clicked')
              navigate('/questions')
            }}
          >
            Add Workflow
          </Button>
     </Box>

    
{loading ? (
        <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="calc(100vh - 100px)" // Adjust height as needed
      >
        <CircularProgress color="inherit" />
      </Box>
      ) : 
        userMetrics.length > 0 && userMetrics.map((metric) => {
          return   <WorkFlowTile  key = {metric.userMetricId} metric = {metric} deleteMetricFromList = {(metricId) => {
            const _metricList = [...userMetrics]
            setUserMetrics(_metricList.filter((metric) => metric.userMetricId !== metricId))

          }} updateMetricInList = {(updatedMetric) => {
const _metricList = [...userMetrics]
const metricIndex = _metricList.findIndex(metric => metric.userMetricId === updatedMetric.userMetricId);
if (metricIndex !== -1) {
  // Found the metric - update its customSettings
  _metricList[metricIndex].customSettings = updatedMetric.customSettings;
}
 // Update the state or return the new list depending on where userMetrics is stored
 setUserMetrics(_metricList); // If userMetrics is a state
          }} shouldShowSelection={shouldShowSelection}
          setSelectedMetric = {setSelectedMetric}
          selectedMetric = {selectedMetric}
          />
        })
      
      }



</Container>
)
};

export default Workflow;
