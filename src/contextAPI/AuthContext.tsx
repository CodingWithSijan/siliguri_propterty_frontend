import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
	name: string;
}

interface AuthContextType {
	user: User | null;
	setUser: React.Dispatch<React.SetStateAction<User | null>>;
	logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [user, setUser] = useState<User | null>(() => {
		// load user from session storage on initial render
		const storedUser = sessionStorage.getItem("user");
		return storedUser ? JSON.parse(storedUser) : null;
	});

	useEffect(() => {
		// Save user to sessionStorage whenever it changes
		if (user) {
			sessionStorage.setItem("user", JSON.stringify(user));
		} else {
			sessionStorage.removeItem("user");
		}
	}, [user]);

	const logout = () => {
		setUser(null);
		sessionStorage.removeItem("user");
	};

	return (
		<AuthContext.Provider value={{ user, setUser, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be within a AuthProvider");
	}
	return context;
};
