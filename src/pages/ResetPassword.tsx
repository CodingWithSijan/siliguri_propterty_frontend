import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaLock, FaKey } from "react-icons/fa";
import BASE_URL from "../services";
import { showError, showSuccess } from "../utils/toastUtils";

const getErrorMessage = (error: unknown): string => {
	if (
		typeof error === "object" &&
		error !== null &&
		"response" in error &&
		typeof (error as { response?: unknown }).response === "object" &&
		(error as { response?: { data?: unknown } }).response !== null
	) {
		const response = (error as { response: { data?: { message?: unknown } } })
			.response;
		if (typeof response.data?.message === "string") {
			return response.data.message;
		}
	}

	if (error instanceof Error) {
		return error.message;
	}

	return "Failed to reset password.";
};

const ResetPassword: React.FC = () => {
	const navigate = useNavigate();
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	const { token } = useParams();

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);
		setError(null);
		setSuccess(null);

		if (!token) {
			setError("Invalid or expired reset link.");
			setLoading(false);
			return;
		}
		if (password.length < 6) {
			setError("Password must be at least 6 characters.");
			setLoading(false);
			return;
		}
		if (password !== confirmPassword) {
			setError("Passwords do not match.");
			setLoading(false);
			return;
		}
		try {
			await BASE_URL.post(`/api/auth/reset-password/${token}`, { password });
			setSuccess("Password reset successful! Redirecting to login...");
			showSuccess("Password reset successful!");
			setTimeout(() => navigate("/login"), 2000);
		} catch (error: unknown) {
			const message = getErrorMessage(error);
			setError(message);
			showError(message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 px-4">
			<div className="w-full max-w-md bg-white shadow-2xl rounded-3xl p-8">
				<h2 className="text-2xl sm:text-3xl font-bold text-center text-blue-700 mb-6 flex items-center justify-center gap-2">
					<FaKey className="text-blue-600" /> Reset Your Password
				</h2>
				<form className="space-y-5 text-black" onSubmit={handleSubmit}>
					<div className="relative">
						<FaLock className="absolute top-3 left-3 text-gray-400" />
						<input
							type="password"
							name="password"
							id="password"
							required
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="New password"
							className="w-full pl-10 pr-4 py-2 text-sm border rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>
					<div className="relative">
						<FaLock className="absolute top-3 left-3 text-gray-400" />
						<input
							type="password"
							name="confirmPassword"
							id="confirmPassword"
							required
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							placeholder="Confirm new password"
							className="w-full pl-10 pr-4 py-2 text-sm border rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>
					<button
						type="submit"
						disabled={loading}
						className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition duration-200"
					>
						{loading ? (
							<span className="animate-spin">🔄</span>
						) : (
							"Reset Password"
						)}
					</button>
					{error && (
						<p className="text-sm text-red-600 text-center mt-2">{error}</p>
					)}
					{success && (
						<p className="text-sm text-green-600 text-center mt-2">{success}</p>
					)}
				</form>
			</div>
		</div>
	);
};

export default ResetPassword;
