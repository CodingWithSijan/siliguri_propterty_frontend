import axios, { AxiosInstance } from "axios";

const BASE_URL: AxiosInstance = axios.create({
	baseURL: import.meta.env.VITE_BACKEND_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

export default BASE_URL;
