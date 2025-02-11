import axios from "axios";
import { getEnvVariables } from "../helpers";

const { VITE_API_URL } = getEnvVariables();

const iotApi = axios.create({
  baseURL: VITE_API_URL,
});

// Interceptor para agregar el token a las peticiones
iotApi.interceptors.request.use((config) => {
  config.headers = {
    ...config.headers,
    "x-token": localStorage.getItem("token"),
  };
  return config;
});

export default iotApi;
