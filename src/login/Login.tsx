import React, { useEffect, useState } from "react";
import Navbar from "../header_and_footer/Navbar";
import { showSuccess, showError } from "../utils/toastUtils";
import BASE_URL from "../services";
import { SiGoogle } from "react-icons/si";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contextAPI/UserAuthContext";
import { AxiosError } from "axios";

interface UserFormDataTypes {
	email: string;
	password: string;
}

const Login: React.FC = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const { isAuthenticated, login, user } = useAuth();
	const [formData, setFormData] = useState<UserFormDataTypes>({
		email: "",
		password: "",
	});
	const [loading, setLoading] = useState<boolean>(false);

	// Handle query parameters for errors
	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const error = params.get("error");
		if (error) {
			showError(decodeURIComponent(error));
		}
	}, [location]);

	// Redirect if already authenticated
	useEffect(() => {
		if (isAuthenticated && user?.role == "user") {
			navigate("/");
		} else if (isAuthenticated && user?.role == "admin") {
			navigate("/admin");
		}
	}, [isAuthenticated, navigate]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);

		try {
			const response = await BASE_URL.post("/api/auth/login", {
				email: formData.email,
				password: formData.password,
			});
			/*
			 ***If user navigate to homepage, if admin navigate to admin dashboard***
			 */
			if (response.status === 200) {
				if (user?.role == "user") {
					const { user, token } = response.data;
					login(user, token);
					showSuccess("Login successful.");
					navigate("/");
				} else {
					const { user, token } = response.data;
					login(user, token);
					showSuccess("Login successful.");
					navigate("/admin");
				}
			} else {
				showError(response.data.message || "Login failed.");
			}
		} catch (error) {
			const err = error as AxiosError<{ message: string }>;
			if (err.response?.data?.message) {
				showError(err.response.data.message);
			} else {
				showError("An error occurred during login.");
			}
		} finally {
			setLoading(false);
		}
	};

	const handleGoogleLogin = () => {
		window.location.href = `${
			import.meta.env.VITE_BACKEND_URL
		}/api/auth/google`;
	};

	return (
		<>
			<Navbar />
			<div className="flex items-center justify-center min-h-screen bg-gray-100 pt-16">
				<div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
					<h2 className="text-2xl font-bold text-center text-gray-800">
						Login
					</h2>

					<form className="space-y-4" onSubmit={handleSubmit}>
						<div>
							<label
								htmlFor="email"
								className="block text-sm font-medium text-gray-700"
							>
								Email Address
							</label>
							<input
								type="email"
								id="email"
								name="email"
								value={formData.email}
								onChange={handleChange}
								required
								className="w-full px-4 py-2 mt-1 text-sm text-black border rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
								placeholder="Enter your email"
							/>
						</div>

						<div>
							<label
								htmlFor="password"
								className="block text-sm font-medium text-gray-700"
							>
								Password
							</label>
							<input
								type="password"
								id="password"
								name="password"
								value={formData.password}
								onChange={handleChange}
								required
								className="w-full px-4 py-2 mt-1 text-sm border text-black rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
								placeholder="Enter your password"
							/>
						</div>

						<button
							type="submit"
							disabled={loading}
							className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
						>
							{loading ? "Logging in..." : "Login"}
						</button>
					</form>

					<div className="text-center">
						<p className="text-sm text-gray-600">Or login using</p>
						<button
							onClick={handleGoogleLogin}
							disabled={loading}
							className="mt-2 w-full px-4 py-2 text-sm font-medium text-white bg-red-400 rounded-md hover:bg-red-500 flex items-center justify-center"
						>
							<SiGoogle className="w-5 h-5 mr-2" />
							Login with Google
						</button>
					</div>

					<p className="text-sm text-center text-gray-600">
						Don’t have an account?{" "}
						<a href="/signup" className="text-blue-600 hover:underline">
							Sign up
						</a>
					</p>
				</div>
			</div>
		</>
	);
};

export default Login;
