import React, { useState } from "react";
// import { useAuth } from "../contextAPI/UserAuthContext";
import { showSuccess, showError } from "../utils/toastUtils";
import BASE_URL from "../services";
import { motion, AnimatePresence } from "framer-motion";

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

	return "An error occured while changing the password.";
};

const ChangePassword: React.FC<{ onClose: () => void }> = ({ onClose }) => {
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (newPassword !== confirmPassword) {
			showError("New password and confirm password do not match.");
			return;
		}
		if (newPassword === currentPassword) {
			showError("New password cannot be same as the old one.");
			return;
		}
		setLoading(true);
		try {
			const response = await BASE_URL.patch("/api/users/change-password", {
				currentPassword,
				newPassword,
			});

			if (response.status === 200) {
				showSuccess("Password changed successfully!");
				onClose();
			} else {
				showError(response.data.message || "Failed to change password.");
			}
		} catch (error: unknown) {
			showError(getErrorMessage(error));
		} finally {
			setLoading(false);
		}
	};

	return (
		<AnimatePresence>
			<motion.div
				className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
			>
				<motion.div
					className="bg-card rounded-2xl shadow-2xl w-full max-w-md p-8 border border-border"
					initial={{ scale: 0.8, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					exit={{ scale: 0.8, opacity: 0 }}
					transition={{ type: "spring", stiffness: 300, damping: 20 }}
				>
					<h2 className="text-2xl font-bold mb-6 text-foreground">
						Change Password
					</h2>
					<form onSubmit={handleSubmit} className="space-y-5">
						{/* form inputs same as before */}
						<div>
							<label
								htmlFor="currentPassword"
								className="block text-sm font-medium text-muted-foreground mb-2"
							>
								Current Password
							</label>
							<input
								type="password"
								id="currentPassword"
								value={currentPassword}
								onChange={(e) => setCurrentPassword(e.target.value)}
								required
								className="w-full px-4 py-3 text-sm border text-foreground bg-muted/50 rounded-lg border-input focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
								placeholder="Enter your current password"
							/>
						</div>

						<div>
							<label
								htmlFor="newPassword"
								className="block text-sm font-medium text-muted-foreground mb-2"
							>
								New Password
							</label>
							<input
								type="password"
								id="newPassword"
								value={newPassword}
								onChange={(e) => setNewPassword(e.target.value)}
								required
								className="w-full px-4 py-3 text-sm border text-foreground bg-muted/50 rounded-lg border-input focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
								placeholder="Enter your new password"
							/>
						</div>

						<div>
							<label
								htmlFor="confirmPassword"
								className="block text-sm font-medium text-muted-foreground mb-2"
							>
								Confirm New Password
							</label>
							<input
								type="password"
								id="confirmPassword"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								required
								className="w-full px-4 py-3 text-sm border rounded-lg text-foreground bg-muted/50 border-input focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
								placeholder="Confirm your new password"
							/>
						</div>

						<div className="flex justify-end space-x-3 pt-2">
							<button
								type="button"
								onClick={onClose}
								className="px-5 py-2.5 text-sm font-medium text-muted-foreground bg-secondary hover:bg-secondary/80 rounded-lg transition-all"
							>
								Cancel
							</button>
							<button
								type="submit"
								disabled={loading}
								className="px-5 py-2.5 text-sm font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
							>
								{loading ? "Changing..." : "Change Password"}
							</button>
						</div>
					</form>
				</motion.div>
			</motion.div>
		</AnimatePresence>
	);
};

export default ChangePassword;
