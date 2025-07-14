import axios from 'axios';
import { useShopStore } from '../store/useStore';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, 
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use((config) => {
    const {shopdata, isLoggedIn} = useShopStore.getState();
  if (isLoggedIn) {
    config.headers['authorization'] = `Bearer ${shopdata?.token}`;
  }
  return config;
});

export default axiosInstance;
