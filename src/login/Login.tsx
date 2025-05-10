import React, { useEffect, useState } from "react";
import Navbar from "../header_and_footer/Navbar";
import { showSuccess, showError } from "../utils/toastUtils";
import BASE_URL from "../services";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contextAPI/UserAuthContext";
import { AxiosError } from "axios";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { BiLoaderAlt } from "react-icons/bi";

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

	// Show error from URL
	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const error = params.get("error");
		if (error) showError(decodeURIComponent(error));
	}, [location]);

	// Auto-redirect if already logged in
	useEffect(() => {
		if (isAuthenticated && user?.role === "user") navigate("/");
		else if (isAuthenticated && user?.role === "admin") navigate("/admin");
	}, [isAuthenticated, navigate]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);

		try {
			const response = await BASE_URL.post("/api/auth/login", formData);
			const { user, token } = response.data;
			login(user, token);
			showSuccess("Login successful.");
			navigate(user?.role === "admin" ? "/admin" : "/");
		} catch (error) {
			const err = error as AxiosError<{ message: string }>;
			showError(err.response?.data?.message || "Login failed.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 px-4">
				<div className="w-full max-w-md bg-white shadow-2xl rounded-3xl p-8">
					<h2 className="text-2xl sm:text-3xl font-bold text-center text-blue-700 mb-6">
						Welcome Back
					</h2>
					<form className="space-y-5 text-black" onSubmit={handleSubmit}>
						{/* Email */}
						<div className="relative">
							<FaEnvelope className="absolute top-3 left-3 text-gray-400" />
							<input
								type="email"
								name="email"
								id="email"
								required
								value={formData.email}
								onChange={handleChange}
								placeholder="Email address"
								className="w-full pl-10 pr-4 py-2 text-sm border rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
							/>
						</div>

						{/* Password */}
						<div className="relative">
							<FaLock className="absolute top-3 left-3 text-gray-400" />
							<input
								type="password"
								name="password"
								id="password"
								required
								value={formData.password}
								onChange={handleChange}
								placeholder="Password"
								className="w-full pl-10 pr-4 py-2 text-sm border rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
							/>
						</div>

						{/* Submit */}
						<button
							type="submit"
							disabled={loading}
							className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition duration-200"
						>
							{loading && <BiLoaderAlt className="animate-spin" />}
							{loading ? "Logging in..." : "Login"}
						</button>
					</form>

					<p className="text-sm text-center text-gray-600 mt-4">
						Don’t have an account?{" "}
						<a
							href="/signup"
							className="text-blue-600 hover:underline font-medium"
						>
							Sign up
						</a>
					</p>
				</div>
			</div>
		</>
	);
};

export default Login;
