import { AxiosError, InternalAxiosRequestConfig } from "axios";
import { accessTokenStorage } from "hooks/storage/accessToken";

let onUnauthorized: (() => void) | undefined;

/** Registrado pelo AuthContext: chamado quando a API responde 401. */
export function setUnauthorizedHandler(handler?: () => void) {
  onUnauthorized = handler;
}

export const requestInterceptor = (config: InternalAxiosRequestConfig) => {
  const token = accessTokenStorage.get();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

export const responseErrorInterceptor = (error: AxiosError) => {
  if (error.response?.status === 401) {
    onUnauthorized?.();
  }
  return Promise.reject(error);
};
