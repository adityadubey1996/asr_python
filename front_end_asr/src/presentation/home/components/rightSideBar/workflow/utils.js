import {axiosInstance as axios, baseUrl} from 'utils'; // Adjust the import path as necessary

// Function to get a user metric by ID
export const getUserMetricById = async (metricId) => {
  try {
    const response = await axios.get(`${baseUrl()}/api/userMetrics/${metricId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user metric:', error);
    throw error;
  }
};

// Function to update a user metric
export const updateUserMetric = async (metricId, data) => {
  try {
    const response = await axios.put(`${baseUrl()}/api/userMetrics/${metricId}`, data);
    return response.data;
  } catch (error) {
    console.error('Failed to update user metric:', error);
    throw error;
  }
};

// Function to delete a user metric
export const deleteUserMetric = async (metricId) => {
  try {
    const response = await axios.delete(`${baseUrl()}/api/userMetrics/${metricId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to delete user metric:', error);
    throw error;
  }
};
