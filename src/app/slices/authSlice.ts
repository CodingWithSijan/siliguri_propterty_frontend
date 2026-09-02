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
	savedPosts?: string[];
}

interface AuthState {
	user: User | null;
	token: string | null;
	isAuthenticated: boolean;
}

const storedUser = localStorage.getItem("user");
const storedToken = localStorage.getItem("token");

let initialUser: User | null = null;
let initialToken: string | null = null;
let isAuthenticated = false;

if (storedToken && isTokenExpired(storedToken)) {
	localStorage.removeItem("user");
	localStorage.removeItem("token");
	showError("Session expired. Please log in again.");
} else if (storedToken && storedUser) {
	try {
		const parsedUser = JSON.parse(storedUser) as Partial<User>;
		const hasRequiredUserFields =
			typeof parsedUser.id === "string" &&
			typeof parsedUser.email === "string" &&
			(parsedUser.role === "user" || parsedUser.role === "admin");

		if (hasRequiredUserFields) {
			initialUser = parsedUser as User;
			initialToken = storedToken;
			isAuthenticated = true;
		} else {
			localStorage.removeItem("user");
			localStorage.removeItem("token");
		}
	} catch {
		localStorage.removeItem("user");
		localStorage.removeItem("token");
	}
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
			localStorage.setItem("user", JSON.stringify(action.payload.user));
			localStorage.setItem("token", action.payload.token);
		},
		logout: (state) => {
			state.user = null;
			state.token = null;
			state.isAuthenticated = false;
			localStorage.removeItem("user");
			localStorage.removeItem("token");
		},
		setSavedPosts: (state, action: PayloadAction<string[]>) => {
			if (!state.user) return;
			state.user.savedPosts = action.payload;
			localStorage.setItem("user", JSON.stringify(state.user));
		},
	},
});

export const { login, logout, setSavedPosts } = authSlice.actions;
export default authSlice.reducer;
