import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";

const BASE_URL: AxiosInstance = axios.create({
	baseURL: import.meta.env.VITE_BACKEND_URL,
});

BASE_URL.interceptors.request.use(
	(config: InternalAxiosRequestConfig) => {
		const token = sessionStorage.getItem("token");

		if (token && config.headers) {
			config.headers.Authorization = `Bearer ${token}`;
		}

		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

export default BASE_URL;
