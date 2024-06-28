import axios from "axios";

const axiosConfig = axios.create({
  baseURL: 'http://localhost:8000', //replace with your BaseURL
  headers: {
    'Content-Type': 'application/json', // change according header type accordingly
  },
});
const BASE_URL = 'http://localhost:8000';

axiosConfig.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    console.log(error)

    if (error.response.status === 401 && !(originalRequest._retry !== undefined)) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken !== null) {
        try {
          const response = await axios.post(`${BASE_URL}/token/refresh/`, {refresh: refreshToken}, {headers: {
            'Content-Type': 'application/json',
          }});
          // don't use axious instance that already configured for refresh token api call
          const newAccessToken = response.data.access;
          const newRefreshToken = response.data.refresh;
          localStorage.setItem('access_token', newAccessToken); 
          localStorage.setItem('refresh_token', newRefreshToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axios(originalRequest); //recall Api with new token
        } catch (error) {
          console.log(error)
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('access_token');
          // Handle token refresh failure
          // mostly logout the user and re-authenticate by login again
        }
      }
    }
    return Promise.reject(error);
  }
);

axiosConfig.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('access_token'); // get stored access token
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`; // set in header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosConfig;