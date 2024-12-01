// axios-setup.js
import axios from 'axios';
import {baseUrl} from './url';
import { useHistory } from 'react-router-dom';

const axiosInstance = axios.create({
  baseURL: baseUrl(), // Replace with your API base URL
  withCredentials: true
});

axiosInstance.interceptors.request.use(
  config => {
    let user = JSON.parse(localStorage.getItem("user"))
  ? JSON.parse(localStorage.getItem("user"))
  : undefined;
    const token = user?.data?.access_token;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Assuming you're using react-router
    //   window.location = '/login'; // Redirect to login page
    //   localStorage.clear();
    }
    return Promise.reject(error);
  }
);

export  {axiosInstance};
