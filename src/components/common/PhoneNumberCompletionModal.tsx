import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import { login } from "../../app/slices/authSlice";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import BASE_URL from "../../services";
import { showError, showSuccess } from "../../utils/toastUtils";

const PhoneNumberCompletionModal: React.FC = () => {
	const dispatch = useDispatch<AppDispatch>();
	const { isAuthenticated, user } = useSelector(
		(state: RootState) => state.auth,
	);
	const [open, setOpen] = useState(false);
	const [phone, setPhone] = useState("");
	const [saving, setSaving] = useState(false);
	const [dismissed, setDismissed] = useState(false);

	useEffect(() => {
		if (!isAuthenticated || !user) {
			setOpen(false);
			setDismissed(false);
			return;
		}

		const dismissedFlag = sessionStorage.getItem(
			`phone-modal-dismissed-${user.id}`,
		);
		setDismissed(dismissedFlag === "1");
	}, [isAuthenticated, user]);

	useEffect(() => {
		if (!isAuthenticated || !user) return;
		const hasPhone = Boolean(user.phone && user.phone.trim().length > 0);
		setOpen(!hasPhone && !dismissed);
	}, [dismissed, isAuthenticated, user]);

	const handleSavePhone = async () => {
		const normalizedPhone = phone.trim();
		if (!/^\+?[0-9]{10,15}$/.test(normalizedPhone)) {
			showError("Please enter a valid phone number");
			return;
		}

		try {
			setSaving(true);
			const response = await BASE_URL.patch("/api/users/update-phone", {
				phone: normalizedPhone,
			});

			const updatedUser = response.data?.user;
			const token = localStorage.getItem("token");
			if (updatedUser && token) {
				dispatch(login({ user: updatedUser, token }));
			}

			showSuccess("Phone number added successfully");
			if (user?.id) {
				sessionStorage.removeItem(`phone-modal-dismissed-${user.id}`);
			}
			setOpen(false);
		} catch (error) {
			console.error("Phone update failed:", error);
			showError("Unable to save phone number");
		} finally {
			setSaving(false);
		}
	};

	return (
		<Dialog
			open={open}
			onOpenChange={(nextOpen) => {
				setOpen(nextOpen);
				if (!nextOpen && user?.id) {
					sessionStorage.setItem(`phone-modal-dismissed-${user.id}`, "1");
				}
			}}
		>
			<DialogContent className="sm:max-w-md">
				<DialogTitle>Complete your profile</DialogTitle>
				<DialogDescription>
					Please add your phone number to receive inquiries and messages from
					interested buyers or renters.
				</DialogDescription>

				<div className="space-y-3">
					<p className="text-xs font-medium text-blue-700 bg-blue-50 border border-blue-100 rounded-md px-3 py-2">
						Add your phone number now to finish first-time signup setup.
					</p>
					<Input
						type="tel"
						placeholder="Enter phone number (e.g. +919876543210)"
						value={phone}
						onChange={(event) => setPhone(event.target.value)}
						disabled={saving}
					/>
					<Button
						type="button"
						onClick={handleSavePhone}
						disabled={saving}
						className="w-full"
					>
						{saving ? "Saving..." : "Save phone number"}
					</Button>
					<Button
						type="button"
						variant="outline"
						onClick={() => {
							setOpen(false);
							if (user?.id) {
								sessionStorage.setItem(`phone-modal-dismissed-${user.id}`, "1");
							}
						}}
						className="w-full"
					>
						Add Later
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default PhoneNumberCompletionModal;
