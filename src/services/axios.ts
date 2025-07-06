import axios from 'axios';

const baseURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000/api/v1';

// Add retry delay helper
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Add error handler helper
const handleError = (error: any) => {
  if (error.response) {
    // Server responded with error
    console.error('Response error:', error.response.data);
    throw error.response.data;
  } else if (error.request) {
    // Request made but no response
    console.error('Network error:', error.request);
    throw new Error('Network error occurred');
  } else {
    // Error in request setup
    console.error('Request error:', error.message);
    throw error;
  }
};

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach the JWT token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error response exists before accessing status
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Add retry delay
        await wait(1000);

        const response = await axios.post(`${baseURL}/auth/refresh/`, {
          refresh: refreshToken,
        });

        const { access } = response.data;
        localStorage.setItem('access_token', access);

        originalRequest.headers.Authorization = `Bearer ${access}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Clear auth state, but do NOT hard redirect
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        localStorage.removeItem('hasPasscode');
        localStorage.removeItem('isPasscodeVerified');
        return Promise.reject(refreshError);
      }
    }
    return handleError(error);
  }
);

export default axiosInstance;