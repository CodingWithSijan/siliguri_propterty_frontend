import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contextAPI/UserAuthContext";
import { jwtDecode } from "jwt-decode";
import chalk from "chalk";
interface DecodedToken {
	id: string;
	name: string;
	email: string;
	avatar?: string;
	authProvider: "local" | "google";
}

const GoogleSuccess: React.FC = () => {
	const { login } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const token = params.get("token");

		if (token) {
			const decoded = jwtDecode<DecodedToken>(token);

			console.log(chalk.bgCyan`${decoded}`);
			login(
				{
					id: decoded.id,
					name: decoded.name,
					email: decoded.email,
					avatar: decoded.avatar,
					authProvider: decoded.authProvider,
				},
				token
			);

			navigate("/");
		} else {
			navigate("/login");
		}
	}, [location, login, navigate]);

	return (
		<>
			<div className="text-center mt-10">Logging you in...</div>
		</>
	);

	// <div className="text-center mt-10">Logging you in...</div>;
};

export default GoogleSuccess;
