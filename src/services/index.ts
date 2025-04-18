import axios, { AxiosInstance } from "axios";

const BASE_URL: AxiosInstance = axios.create({
	baseURL: "http://localhost:5000",
	headers: {
		"Content-Type": "application/json",
		Authorization: `Bearer ${localStorage.getItem("token")}`,
	},
});

export default BASE_URL;
