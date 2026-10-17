import axios, { AxiosInstance } from "axios";
import { requestInterceptor, responseErrorInterceptor } from "./handlers";
import { API_URL } from "config";

const createApiInstance = (version: number): AxiosInstance => {
  return axios.create({
    baseURL: `${API_URL}v${version}/`,
  });
};

const api = createApiInstance(1);

api.interceptors.request.use(requestInterceptor);
api.interceptors.response.use((response) => response, responseErrorInterceptor);

export { api };
