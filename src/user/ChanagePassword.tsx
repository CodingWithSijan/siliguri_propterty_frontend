import React, { useState } from "react";
// import { useAuth } from "../contextAPI/UserAuthContext";
import { showSuccess, showError } from "../utils/toastUtils";
import BASE_URL from "../services";
import { motion, AnimatePresence } from "framer-motion"; // 👈 Import

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
		} catch (error: any) {
			let message = "An error occured while changing the password.";
			if (error.response && error.response.data?.message) {
				message = error.response.data.message;
			} else if (error.message) {
				message = error.message;
			}
			showError(message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<AnimatePresence>
			<motion.div
				className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
			>
				<motion.div
					className="bg-white rounded-lg shadow-lg w-full max-w-md p-6"
					initial={{ scale: 0.8, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					exit={{ scale: 0.8, opacity: 0 }}
					transition={{ type: "spring", stiffness: 300, damping: 20 }}
				>
					<h2 className="text-xl font-bold mb-4">Change Password</h2>
					<form onSubmit={handleSubmit} className="space-y-4">
						{/* form inputs same as before */}
						<div>
							<label
								htmlFor="currentPassword"
								className="block text-sm font-medium text-gray-700"
							>
								Current Password
							</label>
							<input
								type="password"
								id="currentPassword"
								value={currentPassword}
								onChange={(e) => setCurrentPassword(e.target.value)}
								required
								className="w-full px-4 py-2 mt-1 text-sm border text-gray-700 rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
								placeholder="Enter your current password"
							/>
						</div>

						<div>
							<label
								htmlFor="newPassword"
								className="block text-sm font-medium text-gray-700"
							>
								New Password
							</label>
							<input
								type="password"
								id="newPassword"
								value={newPassword}
								onChange={(e) => setNewPassword(e.target.value)}
								required
								className="w-full px-4 py-2 mt-1 text-sm border text-gray-700 rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
								placeholder="Enter your new password"
							/>
						</div>

						<div>
							<label
								htmlFor="confirmPassword"
								className="block text-sm font-medium text-gray-700"
							>
								Confirm New Password
							</label>
							<input
								type="password"
								id="confirmPassword"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								required
								className="w-full px-4 py-2 mt-1 text-sm border rounded-md text-gray-700 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
								placeholder="Confirm your new password"
							/>
						</div>

						<div className="flex justify-end space-x-2">
							<button
								type="button"
								onClick={onClose}
								className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
							>
								Cancel
							</button>
							<button
								type="submit"
								disabled={loading}
								className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
