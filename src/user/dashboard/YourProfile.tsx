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
		} catch (error) {
			if (axios.isAxiosError(error)) showError(error.response?.data?.message);
			else showError("Upload Failed! Please Try again");
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

			const updatedUser = res.data.user;

			dispatch(
				login({ user: updatedUser, token: sessionStorage.getItem("token")! })
			);
		} catch (error) {
			if (axios.isAxiosError(error)) {
				showError(`${error.response?.data?.message}`);
			} else {
				showError("Error while sending verification email");
			}
		}
	};
	return (
		<div className="flex justify-center items-start min-h-screen pt-24 px-4 bg-gradient-to-br from-slate-100 to-slate-200">
			<div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-200">
				{/* Header */}
				<div className="text-center mb-6">
					<h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
						Your Profile
					</h2>
					<p className="text-sm text-gray-500">
						Manage your personal information
					</p>
				</div>

				{/* Avatar */}
				<div className="flex flex-col items-center gap-3 mb-8">
					{user?.avatar || preview ? (
						<img
							src={preview || user?.avatar}
							alt="Profile"
							className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-primary shadow"
						/>
					) : (
						<div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-bold shadow">
							{getInitials(user?.name)}
						</div>
					)}

					<label className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md text-sm shadow cursor-pointer flex items-center gap-2 transition">
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
							className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm shadow transition"
						>
							<FiSave className="text-lg" />
							{uploading ? "Saving..." : "Save Picture"}
						</button>
					)}
				</div>

				{/* Form */}
				<div className="space-y-5">
					{/* Name */}
					<div className="relative">
						<FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
						<input
							className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
							type="text"
							value={user?.name || ""}
							readOnly
						/>
					</div>

					{/* Email */}
					<div className="relative">
						<FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
						<input
							className={`w-full pl-10 pr-4 py-2 rounded-md border text-sm focus:outline-none ${
								user?.isVerified
									? "bg-gray-100 border-gray-300 focus:ring-primary"
									: "bg-red-100 border-red-500 focus:ring-red-400"
							}`}
							type="email"
							value={user?.email || ""}
							readOnly
						/>
					</div>

					{user?.isVerified !== true && (
						<p className="text-xs text-red-500 mt-1 flex justify-between items-center">
							<span>Email not verified</span>
							<button
								onClick={handleSendVerificationEmail}
								className="text-blue-600 hover:underline ml-2"
							>
								Resend Link
							</button>
						</p>
					)}
					{/* Phone */}
					<div className="relative">
						<FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
						<input
							className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
							type="text"
							value={user?.phone || ""}
							readOnly
						/>
					</div>

					{/* Password */}
					<div className="relative">
						<FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
						<input
							className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-300 rounded-md text-sm"
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

				{/* Password Modal */}
				{isChangePasswordOpen && (
					<ProtectedRoute>
						<ChangePassword onClose={() => setIsChangePasswordOpen(false)} />
					</ProtectedRoute>
				)}
			</div>
		</div>
	);
};

export default YourProfile;
