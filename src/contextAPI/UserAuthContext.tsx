import React, { createContext, useContext, useState, useEffect } from "react";
import { isTokenExpired } from "../utils/IsTokenExpired";
import { showError } from "../utils/toastUtils";
interface User {
	id: string;
	name: string;
	email: string;
	avatar?: string;
	authProvider: "local" | "google";
	role: "user" | "admin";
	phone: string;
	isVerified: boolean;
}

interface UserAuthContextType {
	isAuthenticated: boolean;
	user: User | null;
	setUser: React.Dispatch<React.SetStateAction<User | null>>;
	token: string | null;
	login: (userData: User, jwtToken: string) => void;
	logout: () => void;
}

const UserAuthContext = createContext<UserAuthContextType | undefined>(
	undefined
);

export const UserAuthProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
	const [user, setUser] = useState<User | null>(null);
	const [token, setToken] = useState<string | null>(null);
	// Login context
	const login = (userData: User, jwtToken: string) => {
		setUser(userData);
		setToken(jwtToken);
		setIsAuthenticated(true);
		sessionStorage.setItem("user", JSON.stringify(userData));
		sessionStorage.setItem("token", jwtToken);
	};

	// Logout Context
	const logout = () => {
		setUser(null);
		sessionStorage.removeItem("user");
		sessionStorage.removeItem("token");
		setIsAuthenticated(false);
	};

	useEffect(() => {
		const storedUser = sessionStorage.getItem("user");
		const storedToken = sessionStorage.getItem("token");
		if (storedToken && isTokenExpired(storedToken)) {
			sessionStorage.removeItem("token");
			sessionStorage.removeItem("token");
			setUser(null);
			showError("Session expired. Please log in again.");
		} else if (storedToken && storedUser) {
			setUser(JSON.parse(storedUser));
			setToken(storedToken);
			setIsAuthenticated(true);
		}
	}, []);

	return (
		<UserAuthContext.Provider
			value={{ isAuthenticated, user, setUser, token, login, logout }}
		>
			{children}
		</UserAuthContext.Provider>
	);
};
export const useAuth = (): UserAuthContextType => {
	const context = useContext(UserAuthContext);
	if (!context) {
		throw new Error("useAuth must be within a UserAuthProvider");
	}
	return context;
};
