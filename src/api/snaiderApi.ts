import axios from 'axios'

const snaiderApi = axios.create({
    baseURL:import.meta.env.VITE_API_URL,
})

snaiderApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && token !== 'undefined' && token !== 'null') {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export {snaiderApi}