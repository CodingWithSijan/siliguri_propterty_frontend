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
				formData,
			);
			const updatedUser = response.data.user;
			showSuccess("Profile Picture updated successfully!");
			dispatch(
				login({ user: updatedUser, token: sessionStorage.getItem("token")! }),
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
				login({ user: updatedUser, token: sessionStorage.getItem("token")! }),
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
		<div className="flex justify-center items-start min-h-screen py-8 px-4">
			<div className="w-full max-w-2xl bg-card rounded-2xl shadow-xl p-8 border border-border">
				{/* Header */}
				<div className="text-center mb-8">
					<h2 className="text-3xl font-bold text-foreground mb-2">
						Your Profile
					</h2>
					<p className="text-sm text-muted-foreground">
						Manage your personal information
					</p>
				</div>

				{/* Avatar */}
				<div className="flex flex-col items-center gap-4 mb-8 pb-8 border-b border-border">
					{user?.avatar || preview ? (
						<img
							src={preview || user?.avatar}
							alt="Profile"
							className="w-32 h-32 rounded-full object-cover border-4 border-primary shadow-lg"
						/>
					) : (
						<div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-primary/60 text-primary-foreground flex items-center justify-center text-4xl font-bold shadow-lg">
							{getInitials(user?.name)}
						</div>
					)}

					<label className="bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-medium shadow-md cursor-pointer flex items-center gap-2 transition-all hover:shadow-lg">
						<FiCamera className="text-lg" /> Change Picture
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
							className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-5 py-2.5 rounded-lg text-sm font-medium shadow-md transition-all hover:shadow-lg"
						>
							<FiSave className="text-lg" />
							{uploading ? "Saving..." : "Save Picture"}
						</button>
					)}
				</div>

				{/* Form */}
				<div className="space-y-6">
					{/* Name */}
					<div>
						<label className="block text-sm font-medium text-muted-foreground mb-2">
							Full Name
						</label>
						<div className="relative">
							<FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
							<input
								className="w-full pl-12 pr-4 py-3 bg-muted/50 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
								type="text"
								value={user?.name || ""}
								readOnly
							/>
						</div>
					</div>

					{/* Email */}
					<div>
						<label className="block text-sm font-medium text-muted-foreground mb-2">
							Email Address
						</label>
						<div className="relative">
							<FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
							<input
								className={`w-full pl-12 pr-4 py-3 rounded-lg border text-sm focus:outline-none transition-all ${
									user?.isVerified
										? "bg-muted/50 border-input focus:ring-2 focus:ring-ring"
										: "bg-destructive/10 border-destructive focus:ring-2 focus:ring-destructive"
								}`}
								type="email"
								value={user?.email || ""}
								readOnly
							/>
						</div>
						{user?.isVerified !== true && (
							<p className="text-xs text-destructive mt-2 flex justify-between items-center">
								<span>Email not verified</span>
								<button
									onClick={handleSendVerificationEmail}
									className="text-primary hover:underline font-medium"
								>
									Resend Link
								</button>
							</p>
						)}
					</div>
					{/* Phone */}
					<div>
						<label className="block text-sm font-medium text-muted-foreground mb-2">
							Phone Number
						</label>
						<div className="relative">
							<FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
							<input
								className="w-full pl-12 pr-4 py-3 bg-muted/50 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
								type="text"
								value={user?.phone || ""}
								readOnly
							/>
						</div>
					</div>

					{/* Password */}
					<div>
						<label className="block text-sm font-medium text-muted-foreground mb-2">
							Password
						</label>
						<div className="relative">
							<FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
							<input
								className="w-full pl-12 pr-4 py-3 bg-muted/50 border border-input rounded-lg text-sm"
								type="password"
								value="*********"
								readOnly
							/>
						</div>
					</div>

					{/* Change Password */}
					<div className="flex justify-end pt-2">
						<button
							type="button"
							onClick={() => setIsChangePasswordOpen(true)}
							className="text-sm text-primary hover:underline font-medium transition-all"
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
