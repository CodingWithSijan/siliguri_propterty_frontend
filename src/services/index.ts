import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";

const BASE_URL: AxiosInstance = axios.create({
	baseURL: import.meta.env.VITE_BACKEND_URL,
	timeout: 10000,
});

// Request Interceptor - Add token and check expiry
BASE_URL.interceptors.request.use(
	(config: InternalAxiosRequestConfig) => {
		const token = localStorage.getItem("token");

		if (token && config.headers) {
			config.headers.Authorization = `Bearer ${token}`;
		}

		if (config.data instanceof FormData && config.headers) {
			delete config.headers["Content-Type"];
			config.timeout = 60000;
		}

		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

export default BASE_URL;
