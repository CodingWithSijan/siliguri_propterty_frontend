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

const normalizeIndianPhone = (value: string): string | null => {
	const digits = value.trim();

	if (!/^[6-9]\d{9}$/.test(digits)) {
		return null;
	}

	return `+91${digits}`;
};

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
		const normalizedPhone = normalizeIndianPhone(phone);
		if (!normalizedPhone) {
			showError("Please enter a valid Indian phone number");
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
					<div className="space-y-1">
						<label
							htmlFor="phone-completion"
							className="text-xs font-medium text-slate-700"
						>
							Phone Number
						</label>
						<div className="flex items-center">
							<span className="rounded-l-md border border-r-0 border-slate-300 bg-slate-100 px-3 py-2 text-sm text-slate-700">
								+91
							</span>
							<Input
								id="phone-completion"
								type="tel"
								inputMode="numeric"
								placeholder="9876543210"
								value={phone}
								onChange={(event) => {
									const digitsOnly = event.target.value.replace(/\D/g, "");
									setPhone(digitsOnly.slice(0, 10));
								}}
								maxLength={10}
								disabled={saving}
								className="rounded-l-none"
							/>
						</div>
					</div>
					<p className="text-[11px] text-slate-500">
						Use a 10-digit Indian mobile number starting with 6-9.
					</p>
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
