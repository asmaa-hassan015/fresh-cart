import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import toast from 'react-hot-toast';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: 'https://ecommerce.routemisr.com/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add token to all requests
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from localStorage
    const token = localStorage.getItem('freshCartToken');
    
    // If token exists, add it to headers
    if (token) {
      config.headers.token = token;
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
  (response) => {
    console.log(response.data)
    return response;
  },
  (error: AxiosError<any>) => {
    // Handle different error status codes
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || 'An error occurred';

      switch (status) {
        case 401:
          // Unauthorized - Clear auth data and redirect to login   
          localStorage.removeItem('freshCartToken');
          localStorage.removeItem('freshCartUser');
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          toast.error('Credentials Invalid');
          break;

        case 403:
          toast.error('You do not have permission to perform this action.');
          break;

        case 404:
          toast.error('Resource not found.');
          break;

        case 409:
          // Conflict - usually email already exists
          toast.error(message);
          break;

        case 422:
          // Validation error
          toast.error(message);
          break;

        case 429:
          toast.error('Too many requests. Please try again later.');
          break;

        case 500:
          toast.error('Server error. Please try again later.');
          break;

        default:
          toast.error(message);
      }
    } else if (error.request) {
      // Request was made but no response received
      toast.error('Network error. Please check your connection.');
    } else {
      // Something else happened
      toast.error('An unexpected error occurred.');
    }

    return Promise.reject(error);


  }
);

export default apiClient;