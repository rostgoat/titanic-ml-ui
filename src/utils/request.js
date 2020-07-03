import axios from "axios";

const service = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  timeout: 5000,
});

// Request interceptors
service.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptors
service.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    return Promise.reject({ ...error });
  }
);

export default service;
