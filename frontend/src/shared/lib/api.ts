import axios from "axios";
import { getToken } from "../../features/auth/utils/auth";

const api = axios.create({
  baseURL:import.meta.env.VITE_API_URL,
  headers:{
    "Content-Type":"application/json"
  },
})

api.interceptors.request.use((config) =>{ //Everytime an api is called, the interceptors automatically add the token as header
  const token = getToken();

  if(token){
    config.headers.Authorization = `Bearer ${token}`
  }

  return config;
});

export default api;