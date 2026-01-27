import React, { useEffect, useState } from "react";
import { showError } from "../utils/toastUtils";
import BASE_URL from "../services";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import { AxiosError } from "axios";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { BiLoaderAlt } from "react-icons/bi";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../app/store";
import { login } from "../app/slices/authSlice";

interface UserFormDataTypes {
	email: string;
	password: string;
}

const Login: React.FC = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const dispatch = useDispatch<AppDispatch>();

	const { isAuthenticated, user } = useSelector(
		(state: RootState) => state.auth,
	);

	const [formData, setFormData] = useState<UserFormDataTypes>({
		email: "",
		password: "",
	});
	const [loading, setLoading] = useState<boolean>(false);

	// Forgot password states
	const [forgotOpen, setForgotOpen] = useState(false); // Modal open state
	const [forgotEmail, setForgotEmail] = useState(""); // Email for reset
	const [forgotLoading, setForgotLoading] = useState(false); // Loading state for reset
	const [forgotMsg, setForgotMsg] = useState<string | null>(null); // Success/failure message

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
	}, [isAuthenticated, navigate, user?.role]);

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

			dispatch(login({ user, token }));

			navigate(user?.role === "admin" ? "/admin" : "/");
		} catch (error) {
			const err = error as AxiosError<{ message: string }>;
			showError(err.response?.data?.message || "Login failed.");
		} finally {
			setLoading(false);
		}
	};

	// Handler for forgot password submit
	const handleForgotSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setForgotLoading(true);
		setForgotMsg(null);
		try {
			await BASE_URL.post("/api/auth/forgot-password", { email: forgotEmail });
			setForgotMsg("Reset link sent! Check your email.");
			setForgotEmail("");
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (err) {
			setForgotMsg("Failed to send reset link");
		}
		setForgotLoading(false);
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

						{/* Forgot password link */}
						<div className="flex justify-end mb-2">
							<button
								type="button"
								className="text-xs text-blue-600 hover:underline focus:outline-none"
								onClick={() => setForgotOpen(true)}
							>
								Forgot password?
							</button>
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
						<NavLink
							to="/signup"
							className="text-blue-600 hover:underline font-medium"
						>
							Sign up
						</NavLink>
					</p>
				</div>
			</div>

			{/* Forgot Password Modal (shadcn dialog) */}
			<Dialog open={forgotOpen} onOpenChange={setForgotOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Forgot Password</DialogTitle>
						<DialogDescription>
							Enter your email to receive a password reset link.
						</DialogDescription>
					</DialogHeader>
					<form onSubmit={handleForgotSubmit} className="space-y-4">
						<Input
							type="email"
							placeholder="Email address"
							value={forgotEmail}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
								setForgotEmail(e.target.value)
							}
							required
						/>
						<Button type="submit" disabled={forgotLoading} className="w-full">
							{forgotLoading ? "Sending..." : "Send Reset Link"}
						</Button>
						{forgotMsg && (
							<p
								className={`text-sm ${
									forgotMsg.includes("sent") ? "text-green-600" : "text-red-600"
								}`}
							>
								{forgotMsg}
							</p>
						)}
					</form>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default Login;
