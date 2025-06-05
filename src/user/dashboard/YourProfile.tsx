import React, { useState } from "react";
import axios from "axios";
import { showSuccess, showError, showInfo } from "../../utils/toastUtils";
import BASE_URL from "../../services";
import ChangePassword from "../ChanagePassword";
import ProtectedRoute from "../../route/ProtectedRoute";
import {
	FiUser,
	FiMail,
	FiLock,
	FiCamera,
	FiSave,
	FiPhone,
} from "react-icons/fi";
import { getInitials } from "../../utils/getInitial";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import { login } from "../../app/slices/authSlice";

const YourProfile: React.FC = () => {
	const { user } = useSelector((state: RootState) => state.auth);
	const dispatch = useDispatch<AppDispatch>();
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [preview, setPreview] = useState<string | null>(null);
	const [uploading, setUploading] = useState<boolean>(false);
	const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

	/*
	 *** Function to fetch Latest user after image upload (Profile picture upload)
	 *** Updates auth context
	 */
	// const fetchLatestUserAndUpdateContext = async () => {
	// 	const response = await BASE_URL.get(`/api/users/${user?.id}`);
	// 	setUser((prev) => {
	// 		if (!prev) return prev;
	// 		return { ...prev, avatar: response.data.avatar };
	// 	});
	// };

	/*
	 ** Handle File Change (Profile Picture Preview)
	 */
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0];
			setSelectedFile(file);
			setPreview(URL.createObjectURL(file));
		}
	};

	/*
	 ** Handle Image uploads (Profile picture)
	 */
	const handleUpload = async () => {
		if (!selectedFile)
			return showError("Please select a profile picture first.");

		const formData = new FormData();
		formData.append("profilePicture", selectedFile);

		try {
			setUploading(true);
			const response = await BASE_URL.post(
				`${import.meta.env.VITE_BACKEND_URL}/api/users/upload-profile-picture`,
				formData
			);
			const updatedUser = response.data.user;
			showSuccess("Profile Picture updated successfully!");
			dispatch(
				login({ user: updatedUser, token: sessionStorage.getItem("token")! })
			);
			setSelectedFile(null);
		} catch (error: any) {
			showError(error.response?.data?.message || "Upload failed.");
		} finally {
			setUploading(false);
		}
	};

	/*
	 ***Send Verification Email***
	 */
	const handleSendVerificationEmail = async () => {
		try {
			const res = await BASE_URL.post("/api/auth/resend-verification", {
				email: user?.email,
			});
			showInfo(res.data.message);
		} catch (error) {
			if (axios.isAxiosError(error)) {
				showError(`${error.response?.data?.message}`);
			} else {
				showError("Error while sending verification email");
			}
		}
	};
	return (
		<>
			<div className="flex justify-center items-start min-h-screen pt-20 px-4">
				<div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 sm:p-8 space-y-6 border-4">
					{/* Avatar Section */}
					<div className="flex flex-col items-center gap-4">
						{user?.avatar || preview ? (
							<img
								src={preview || user?.avatar}
								alt="Profile"
								className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-blue-500 shadow"
							/>
						) : (
							<div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-blue-600 text-white flex items-center justify-center text-4xl font-bold shadow">
								{getInitials(user?.name)}
							</div>
						)}

						<label className="flex items-center gap-2 cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md text-sm shadow hover:bg-blue-700">
							<FiCamera /> Change Picture
							<input
								type="file"
								accept="image/*"
								onChange={handleFileChange}
								className="hidden"
							/>
						</label>

						{selectedFile && (
							<button
								onClick={handleUpload}
								disabled={uploading}
								className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm"
							>
								<FiSave /> {uploading ? "Saving..." : "Save Picture"}
							</button>
						)}
					</div>

					{/* Info Fields */}
					<div className="space-y-4">
						{/* Name */}
						<div className="relative">
							<FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
							<input
								className="pl-10 w-full bg-gray-100 px-4 py-2 rounded-md border border-gray-300"
								type="text"
								value={user?.name || ""}
								readOnly
							/>
						</div>

						{/* Email */}
						<div className="relative">
							<FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
							<input
								className={`pl-10 w-full px-4 py-2 rounded-md border ${
									user?.isVerified
										? "border-gray-300 bg-gray-100"
										: "border-red-500 bg-red-100"
								}`}
								type="email"
								value={user?.email || ""}
								readOnly
							/>
						</div>

						{/* Email Verification */}
						{!user?.isVerified && (
							<div className="flex justify-between text-sm text-red-500">
								<span>*Email not verified</span>
								<button
									onClick={handleSendVerificationEmail}
									className="text-blue-600 hover:underline"
								>
									Verify Email
								</button>
							</div>
						)}

						{/* Phone */}
						<div className="relative">
							<FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
							<input
								className="pl-10 w-full bg-gray-100 px-4 py-2 rounded-md border border-gray-300"
								type="text"
								value={user?.phone || ""}
								readOnly
							/>
						</div>

						{/* Password */}
						<div className="relative">
							<FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
							<input
								className="pl-10 w-full bg-gray-100 px-4 py-2 rounded-md border border-gray-300"
								type="password"
								value="*********"
								readOnly
							/>
						</div>

						{/* Change Password */}
						<div className="flex justify-end">
							<button
								type="button"
								onClick={() => setIsChangePasswordOpen(true)}
								className="text-sm text-blue-600 hover:underline"
							>
								Change Password
							</button>
						</div>
					</div>
				</div>

				{/* Change Password Modal */}
				{isChangePasswordOpen && (
					<ProtectedRoute>
						<ChangePassword onClose={() => setIsChangePasswordOpen(false)} />
					</ProtectedRoute>
				)}
			</div>
		</>
	);
};

export default YourProfile;
