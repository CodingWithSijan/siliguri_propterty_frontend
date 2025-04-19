import React, { useState } from "react";
import Navbar from "../header_and_footer/Navbar";
import { showSuccess, showError } from "../utils/toastUtils";
import BASE_URL from "../services";
import { SiGoogle } from "react-icons/si";
import { useNavigate } from "react-router-dom";

interface UserFormDataTypes {
	email: string;
	password: string;
}

const Login = () => {
	const [formData, setFormData] = useState<UserFormDataTypes>({
		email: "",
		password: "",
	});
	const [loading, setLoading] = useState<boolean>(false);

	const navigate = useNavigate();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);
		try {
			const response = await BASE_URL.post("/api/auth/login", {
				email: formData.email,
				password: formData.password,
			});
			if (response.status === 401 || response.status === 500) {
				return showError(response.data.message);
			} else {
				showSuccess("Login successful! Redirecting...");
				// Redirect logic here
				setTimeout(() => {
					navigate("/");
				}, 2000);
			}
		} catch (error: any) {
			showError(
				error.response?.data?.message || "An error occurred during login."
			);
			console.error("Login error:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleGoogleLogin = () => {
		// Logic for Google login integration
		showSuccess("Google login is not implemented yet.");
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
								className="w-full px-4 py-2 mt-1 text-sm text-black border rounded-md focus:ring-blue-500 focus:border-blue-500 border-gray-300"
								placeholder="Enter your email"
							/>
						</div>
						<div>
							<label
								htmlFor="password"
								className="block text-sm font-medium  text-gray-700"
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
								className="w-full px-4 py-2 mt-1 text-sm border text-black rounded-md focus:ring-blue-500 focus:border-blue-500 border-gray-300"
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
							className="mt-2 w-full px-4 py-2 text-sm font-medium text-white bg-red-400 border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
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
