
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";


const BASE_URL = "http://192.168.2.35:5000";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
});

// Interceptor attaches token only if it exists
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token"); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
