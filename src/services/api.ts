import axios from "axios";
import { requestInterceptor, responseErrorInterceptor } from "./handlers";
import { API_URL } from "config";

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(requestInterceptor);
api.interceptors.response.use((response) => response, responseErrorInterceptor);

export { api };
