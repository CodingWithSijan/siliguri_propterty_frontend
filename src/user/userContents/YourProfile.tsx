import React, { useEffect, useState } from "react";
import { useAuth } from "../../contextAPI/UserAuthContext"; // Assuming you already have auth context
import axios from "axios";
import { showSuccess, showError } from "../../utils/toastUtils";
import { NavLink } from "react-router-dom";
import BASE_URL from "../../services";

const YourProfile: React.FC = () => {
	const { user, token, setUser } = useAuth();
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [preview, setPreview] = useState<string | null>(null);
	const [uploading, setUploading] = useState<boolean>(false);

	useEffect(() => {
		const response = BASE_URL.get(`/api/users/${user?.id}`);
		console.log(response);
	}, []);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0];
			setSelectedFile(file);
			setPreview(URL.createObjectURL(file)); // ✅ Preview before uploading
		}
	};

	const handleUpload = async () => {
		if (!selectedFile) {
			showError("Please select a profile picture first.");
			return;
		}

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
						Authorization: `Bearer ${token}`, // Send token if needed
					},
				}
			);

			showSuccess("Profile Picture updated successfully!");

			// Optionally you can reload page or refetch user
			// setTimeout(() => {
			// 	window.location.reload();
			// }, 1000);
		} catch (error: any) {
			showError(error.response?.data?.message || "Upload failed.");
		} finally {
			setUploading(false);
		}
	};

	return (
		<div className="flex flex-col items-center  min-h-screen pt-20 bg-gray-100 px-4">
			<div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md space-y-6">
				{/* Profile Picture */}
				<div className="flex flex-col items-center space-y-4">
					<div className="relative">
						<img
							src={preview || user?.avatar}
							alt="Profile"
							className="w-32 h-32 rounded-full object-cover border-4 border-blue-400"
						/>
					</div>

					{/* Upload new picture */}
					<label className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm">
						Change Profile Picture
						<input
							type="file"
							accept="image/*"
							onChange={handleFileChange}
							className="hidden"
						/>
					</label>

					{/* Upload Button */}
					{selectedFile && (
						<button
							onClick={handleUpload}
							disabled={uploading}
							className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm"
						>
							{uploading ? "Saving..." : "Save Picture"}
						</button>
					)}
				</div>

				{/* User Details */}
				<div className="space-y-2 text-gray-500">
					<div className="flex flex-col">
						<label className="text-gray-700 text-sm">Name</label>
						<input
							className="bg-gray-100 px-4 py-2 rounded-md"
							type="text"
							value={user?.name}
						/>
					</div>
					<div className="flex flex-col">
						<label className="text-gray-700 text-sm">Email</label>
						<input
							className="bg-gray-100 px-4 py-2 rounded-md"
							type="text"
							value={user?.email}
						/>
					</div>
					<div className="flex flex-col">
						<label className="text-gray-700 text-sm">Password</label>
						<input
							className="bg-gray-100 px-4 py-2 rounded-md"
							type="password"
							value="*********"
						/>
					</div>
					<div>
						<NavLink to="/change-password" className="text-sm text-blue-600">
							Change Password
						</NavLink>
					</div>
					<div>
						<button className="p-4 rounded-b-md text-white bg-green-700">
							Save
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default YourProfile;
