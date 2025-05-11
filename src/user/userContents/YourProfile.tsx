import React, { useState } from "react";
import { useAuth } from "../../contextAPI/UserAuthContext";
import axios, { AxiosError } from "axios";
import { showSuccess, showError, showInfo } from "../../utils/toastUtils";
import BASE_URL from "../../services";
import ChangePassword from "../ChanagePassword";
import ProtectedRoute from "../../route/ProtectedRoute";
import { FiUser, FiMail, FiLock, FiCamera, FiSave } from "react-icons/fi";
import { getInitials } from "../../utils/getInitial";

const YourProfile: React.FC = () => {
	const { user, token, setUser } = useAuth();
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [preview, setPreview] = useState<string | null>(null);
	const [uploading, setUploading] = useState<boolean>(false);
	const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

	/*
	 *** Function to fetch Latest user after image upload (Profile picture upload)
	 *** Updates auth context
	 */
	const fetchLatestUserAndUpdateContext = async () => {
		const response = await BASE_URL.get(`/api/users/${user?.id}`);
		setUser((prev) => {
			if (!prev) return prev;
			return { ...prev, avatar: response.data.avatar };
		});
	};

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
			await axios.post(
				`${import.meta.env.VITE_BACKEND_URL}/api/users/upload-profile-picture`,
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
						Authorization: `Bearer ${token}`,
					},
				}
			);
			showSuccess("Profile Picture updated successfully!");
			fetchLatestUserAndUpdateContext();
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
		<div className="flex flex-col items-center min-h-screen pt-20 px-4 bg-gradient-to-br from-blue-50 to-white">
			<div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md space-y-6 text-gray-600">
				<div className="flex flex-col items-center space-y-4">
					{user?.avatar || preview ? (
						<img
							src={preview || user?.avatar}
							alt="Profile"
							className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow-md"
						/>
					) : (
						<div className="w-32 h-32 rounded-full text-white bg-blue-500 shadow-md flex items-center justify-center font-bold text-6xl">
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

				<div className="space-y-4">
					<div className="relative">
						<FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
						<input
							className="pl-10 w-full bg-gray-100 px-4 py-2 rounded-md border border-gray-300"
							type="text"
							value={user?.name || ""}
							readOnly
						/>
					</div>

					<div className="relative">
						<div className="flex justify-center ">
							<FiMail
								className={`absolute left-3 top-1/2 transform ${
									user?.isVerified ? "-translate-y-1/2" : "-translate-y-[100%]"
								} text-gray-400`}
							/>
							<input
								className={`pl-10 w-full  px-4 py-2 rounded-md border ${
									user?.isVerified
										? "border-gray-300 bg-gray-100"
										: "border-red-500 bg-red-100"
								}`}
								type="email"
								value={user?.email || ""}
								readOnly
							/>
						</div>
						<div className="flex justify-between">
							<label
								htmlFor="email"
								className={`${
									user?.isVerified ? "hidden" : "block text-red-500"
								}`}
							>
								*Email not verified
							</label>
							<button
								onClick={handleSendVerificationEmail}
								className={`${
									user?.isVerified
										? "hidden"
										: "block text-blue-500 cursor-pointer"
								}`}
							>
								Verify Email
							</button>
						</div>
					</div>
					<div className="relative">
						<FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
						<input
							className="pl-10 w-full bg-gray-100 px-4 py-2 rounded-md border border-gray-300"
							type="text"
							value={user?.phone}
							readOnly
						/>
					</div>
					<div className="relative">
						<FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
						<input
							className="pl-10 w-full bg-gray-100 px-4 py-2 rounded-md border border-gray-300"
							type="password"
							value="*********"
							readOnly
						/>
					</div>

					<div className="flex justify-end">
						<button
							type="button"
							className="text-sm text-blue-600 hover:underline"
							onClick={() => setIsChangePasswordOpen(true)}
						>
							Change Password
						</button>
					</div>
				</div>
			</div>

			{isChangePasswordOpen && (
				<ProtectedRoute>
					<ChangePassword onClose={() => setIsChangePasswordOpen(false)} />
				</ProtectedRoute>
			)}
		</div>
	);
};

export default YourProfile;
