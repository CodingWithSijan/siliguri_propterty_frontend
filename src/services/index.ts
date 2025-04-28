import axios, { AxiosInstance } from "axios";

const BASE_URL: AxiosInstance = axios.create({
	baseURL: import.meta.env.VITE_BACKEND_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

// intercepter to attach token automatically
BASE_URL.interceptors.request.use(
	(config) => {
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
// BASE_URL.interceptors.response.use(
// 	(response) => response,
// 	(error) => {
// 		if (error.response.status === 401) {
// 			// Token invalid, auto logout
// 			sessionStorage.removeItem("user");
// 			sessionStorage.removeItem("token");
// 			window.location.href = "/login";
// 		}
// 		return Promise.reject(error);
// 	}
// );
export default BASE_URL;
