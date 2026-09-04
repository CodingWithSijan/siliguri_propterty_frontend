import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { showSuccess, showError, showInfo } from "../../utils/toastUtils";
import BASE_URL from "../../services";
import ChangePassword from "../ChanagePassword";
import ProtectedRoute from "../../route/ProtectedRoute";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import {
	Camera,
	Edit3,
	Lock,
	Mail,
	Phone,
	Save,
	UserRound,
} from "lucide-react";
import { getInitials } from "../../utils/getInitial";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import { login, User as AuthUser } from "../../app/slices/authSlice";

const YourProfile: React.FC = () => {
	const { user } = useSelector((state: RootState) => state.auth);
	const dispatch = useDispatch<AppDispatch>();
	const [isEditOpen, setIsEditOpen] = useState(false);
	const [fullName, setFullName] = useState(user?.name ?? "");
	const [phoneNumber, setPhoneNumber] = useState(user?.phone ?? "");
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [preview, setPreview] = useState<string | null>(null);
	const [isSavingProfile, setIsSavingProfile] = useState(false);
	const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

	useEffect(() => {
		setFullName(user?.name ?? "");
		setPhoneNumber(user?.phone ?? "");
	}, [user?.name, user?.phone]);

	const isProfileDirty = useMemo(() => {
		return (
			fullName.trim() !== (user?.name ?? "").trim() ||
			phoneNumber.trim() !== (user?.phone ?? "").trim()
		);
	}, [fullName, phoneNumber, user?.name, user?.phone]);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0];
			setSelectedFile(file);
			setPreview(URL.createObjectURL(file));
		}
	};

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

	const openEditProfile = () => {
		setFullName(user?.name ?? "");
		setPhoneNumber(user?.phone ?? "");
		setSelectedFile(null);
		setPreview(null);
		setIsEditOpen(true);
	};

	const handleSaveProfile = async () => {
		const trimmedName = fullName.trim();
		const trimmedPhone = phoneNumber.trim();
		const hasProfileFieldChanges =
			trimmedName !== (user?.name ?? "").trim() ||
			trimmedPhone !== (user?.phone ?? "").trim();
		const hasPictureChange = Boolean(selectedFile);

		if (!hasProfileFieldChanges && !hasPictureChange) {
			showInfo("No changes to save");
			return;
		}

		if (trimmedName.length < 2) {
			showError("Name must be at least 2 characters");
			return;
		}

		if (trimmedPhone && !/^\+?[0-9]{10,15}$/.test(trimmedPhone)) {
			showError("Enter a valid phone number");
			return;
		}

		try {
			setIsSavingProfile(true);
			let updatedUserPayload: AuthUser | null = null;

			if (hasPictureChange && selectedFile) {
				const formData = new FormData();
				formData.append("profilePicture", selectedFile);
				const imageResponse = await BASE_URL.post(
					"/api/users/upload-profile-picture",
					formData,
				);
				updatedUserPayload = (imageResponse.data?.user as AuthUser) ?? null;
			}

			if (hasProfileFieldChanges) {
				const profileResponse = await BASE_URL.patch(
					"/api/users/update-profile",
					{
						name: trimmedName,
						phone: trimmedPhone,
					},
				);
				updatedUserPayload = (profileResponse.data?.user as AuthUser) ?? null;
			}

			const token = localStorage.getItem("token");
			if (token && updatedUserPayload) {
				dispatch(login({ user: updatedUserPayload, token }));
			}
			showSuccess("Profile updated successfully");
			setIsEditOpen(false);
			setSelectedFile(null);
			setPreview(null);
		} catch (error) {
			if (axios.isAxiosError(error)) {
				showError(error.response?.data?.message || "Failed to update profile");
			} else {
				showError("Failed to update profile");
			}
		} finally {
			setIsSavingProfile(false);
		}
	};

	return (
		<div className="flex justify-center items-start min-h-screen py-4 md:py-8 px-0 md:px-2">
			<div className="w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-4 md:p-5 shadow-sm">
				<div className="flex items-center justify-between gap-3">
					<div>
						<h2 className="text-xl md:text-2xl font-bold text-slate-900">
							Profile
						</h2>
						<p className="text-xs md:text-sm text-slate-500">
							Your account overview and preferences.
						</p>
					</div>
					<Button
						type="button"
						onClick={openEditProfile}
						className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800"
					>
						<Edit3 className="h-4 w-4" />
						Edit
					</Button>
				</div>

				<div className="mt-4 grid grid-cols-1 gap-4 rounded-xl border border-slate-200 bg-slate-50/70 p-4 md:grid-cols-[auto_1fr_auto] md:items-center">
					{user?.avatar ? (
						<img
							src={user.avatar}
							alt="Profile"
							className="h-16 w-16 rounded-full border border-slate-200 object-cover"
						/>
					) : (
						<div className="h-16 w-16 rounded-full bg-sky-700 text-white flex items-center justify-center text-xl font-semibold">
							{getInitials(user?.name)}
						</div>
					)}

					<div className="min-w-0">
						<p className="truncate text-base font-semibold text-slate-900">
							{user?.name || "-"}
						</p>
						<p className="truncate text-sm text-slate-500">
							{user?.email || "-"}
						</p>
						<p className="mt-1 text-sm text-slate-600">
							{user?.phone || "No phone added"}
						</p>
					</div>

					<div className="flex items-center gap-2 text-xs text-slate-500">
						<Lock className="h-4 w-4" />
						Secured
					</div>
				</div>

				{user?.isVerified !== true && (
					<div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
						<span>Email not verified.</span>
						<button
							type="button"
							onClick={handleSendVerificationEmail}
							className="font-semibold text-sky-700 hover:underline"
						>
							Resend Link
						</button>
					</div>
				)}

				<div className="mt-4 flex justify-end">
					<button
						type="button"
						onClick={() => setIsChangePasswordOpen(true)}
						className="text-sm text-sky-700 hover:underline font-medium"
					>
						Change Password
					</button>
				</div>

				{/* Password Modal */}
				{isChangePasswordOpen && (
					<ProtectedRoute>
						<ChangePassword onClose={() => setIsChangePasswordOpen(false)} />
					</ProtectedRoute>
				)}

				<Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Edit Profile</DialogTitle>
							<DialogDescription>
								Update your profile photo, full name, and phone number.
							</DialogDescription>
						</DialogHeader>

						<div className="space-y-4">
							<div className="flex items-center gap-3">
								{preview || user?.avatar ? (
									<img
										src={preview || user?.avatar}
										alt="Preview"
										className="h-16 w-16 rounded-full border border-slate-200 object-cover"
									/>
								) : (
									<div className="h-16 w-16 rounded-full bg-sky-700 text-white flex items-center justify-center text-lg font-semibold">
										{getInitials(fullName || user?.name)}
									</div>
								)}
								<label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
									<Camera className="h-4 w-4" />
									Upload picture
									<input
										type="file"
										accept="image/*"
										onChange={handleFileChange}
										className="hidden"
									/>
								</label>
							</div>

							<div>
								<label className="mb-1 block text-sm font-medium text-slate-600">
									Full Name
								</label>
								<div className="relative">
									<UserRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
									<input
										className="w-full rounded-md border border-slate-200 bg-slate-50 py-2 pl-10 pr-3 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
										type="text"
										value={fullName}
										onChange={(event) => setFullName(event.target.value)}
									/>
								</div>
							</div>

							<div>
								<label className="mb-1 block text-sm font-medium text-slate-600">
									Phone Number
								</label>
								<div className="relative">
									<Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
									<input
										className="w-full rounded-md border border-slate-200 bg-slate-50 py-2 pl-10 pr-3 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
										type="text"
										value={phoneNumber}
										onChange={(event) => setPhoneNumber(event.target.value)}
									/>
								</div>
							</div>

							<div>
								<label className="mb-1 block text-sm font-medium text-slate-600">
									Email
								</label>
								<div className="relative">
									<Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
									<input
										className="w-full rounded-md border border-slate-200 bg-slate-100 py-2 pl-10 pr-3 text-sm text-slate-600"
										type="email"
										value={user?.email ?? ""}
										readOnly
									/>
								</div>
							</div>
						</div>

						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={() => setIsEditOpen(false)}
							>
								Cancel
							</Button>
							<Button
								type="button"
								onClick={handleSaveProfile}
								disabled={(!isProfileDirty && !selectedFile) || isSavingProfile}
								className="inline-flex items-center gap-2"
							>
								<Save className="h-4 w-4" />
								{isSavingProfile ? "Saving..." : "Save"}
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>
		</div>
	);
};

export default YourProfile;
