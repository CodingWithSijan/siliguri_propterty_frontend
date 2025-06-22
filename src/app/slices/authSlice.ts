import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { isTokenExpired } from "../../utils/IsTokenExpired";
import { showError } from "../../utils/toastUtils";

export interface User {
	id: string;
	name: string;
	email: string;
	avatar?: string;
	authProvider: "local" | "google";
	role: "user" | "admin";
	phone: string;
	isVerified: boolean;
}

interface AuthState {
	user: User | null;
	token: string | null;
	isAuthenticated: boolean;
}

const storedUser = sessionStorage.getItem("user");
const storedToken = sessionStorage.getItem("token");

let initialUser: User | null = null;
let initialToken: string | null = null;
let isAuthenticated = false;

if (storedToken && isTokenExpired(storedToken)) {
	sessionStorage.removeItem("user");
	sessionStorage.removeItem("token");
	showError("Session expired. Please log in again.");
} else if (storedToken && storedUser) {
	initialUser = JSON.parse(storedUser);
	initialToken = storedToken;
	isAuthenticated = true;
}
const initialState: AuthState = {
	user: initialUser,
	token: initialToken,
	isAuthenticated,
};
const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		login: (state, action: PayloadAction<{ user: User; token: string }>) => {
			state.user = action.payload.user;
			state.token = action.payload.token;
			state.isAuthenticated = true;
			sessionStorage.setItem("user", JSON.stringify(action.payload.user));
			sessionStorage.setItem("token", action.payload.token);
		},
		logout: (state) => {
			state.user = null;
			state.token = null;
			state.isAuthenticated = false;
			sessionStorage.removeItem("user");
			sessionStorage.removeItem("token");
		},
	},
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
