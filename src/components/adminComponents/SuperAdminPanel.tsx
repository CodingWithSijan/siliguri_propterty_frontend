import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import {
	createUserBySuperAdmin,
	promoteAdminByEmail,
	resendVerificationLinkByAdmin,
	searchUsersForSuperAdmin,
	updateUserRole,
	User,
} from "../../services/fetchFunctionsForAdmin";
import useFetch from "../../hooks/useFetch";
import { showError, showInfo, showSuccess } from "../../utils/toastUtils";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Skeleton } from "../ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../ui/table";

const SuperAdminPanel = () => {
	const currentUser = useSelector((state: RootState) => state.auth.user);
	const [userSearchInput, setUserSearchInput] = useState("");
	const [userSearchQuery, setUserSearchQuery] = useState("");
	const [adminEmailInput, setAdminEmailInput] = useState("");
	const [isPromoting, setIsPromoting] = useState(false);
	const [roleActionUserId, setRoleActionUserId] = useState<string | null>(null);
	const [verificationActionUserId, setVerificationActionUserId] = useState<
		string | null
	>(null);
	const [isCreatingUser, setIsCreatingUser] = useState(false);
	const [newUserName, setNewUserName] = useState("");
	const [newUserEmail, setNewUserEmail] = useState("");
	const [newUserPhone, setNewUserPhone] = useState("");
	const [newUserPassword, setNewUserPassword] = useState("");
	const [verificationMethod, setVerificationMethod] = useState<"link" | "otp">(
		"link",
	);

	const fetchUsersByQuery = useCallback(() => {
		return searchUsersForSuperAdmin(userSearchQuery);
	}, [userSearchQuery]);

	const {
		data: searchedUsers,
		loading: isSearchingUsers,
		refetch: refetchUsers,
	} = useFetch<User[]>(fetchUsersByQuery, false);

	useEffect(() => {
		refetchUsers();
	}, [userSearchQuery, refetchUsers]);

	const normalizedEmail = useMemo(
		() => adminEmailInput.trim().toLowerCase(),
		[adminEmailInput],
	);
	const isSuperAdmin = currentUser?.role === "superadmin";

	if (!isSuperAdmin) {
		return (
			<div className="p-4 md:p-8 max-w-[1400px] mx-auto">
				<Card>
					<CardHeader>
						<CardTitle>Super Admin Access Required</CardTitle>
					</CardHeader>
					<CardContent className="text-sm text-muted-foreground">
						Only super admins can manage admin accounts.
					</CardContent>
				</Card>
			</div>
		);
	}

	const handleApplySearch = () => {
		setUserSearchQuery(userSearchInput.trim());
	};

	const generateRandomPassword = (): string => {
		const seed = Math.random().toString(36).slice(-6);
		return `Sp@${Date.now().toString().slice(-4)}${seed}`;
	};

	const handlePromoteByEmail = async () => {
		if (!normalizedEmail) {
			showError("Please enter an email address");
			return;
		}

		try {
			setIsPromoting(true);
			const updatedUser = await promoteAdminByEmail(normalizedEmail);
			showSuccess(`${updatedUser.email} is now an admin`);
			setAdminEmailInput("");
			refetchUsers();
		} catch (error) {
			showError(
				error instanceof Error ? error.message : "Failed to promote admin",
			);
		} finally {
			setIsPromoting(false);
		}
	};

	const handleDemoteToUser = async (targetUser: User) => {
		if (targetUser._id === currentUser.id) {
			showError("You cannot demote yourself");
			return;
		}

		try {
			setRoleActionUserId(targetUser._id);
			await updateUserRole(targetUser._id, "user");
			showSuccess(`${targetUser.email} has been demoted to user`);
			refetchUsers();
		} catch (error) {
			showError(
				error instanceof Error ? error.message : "Failed to demote user",
			);
		} finally {
			setRoleActionUserId(null);
		}
	};

	const handlePromoteToAdmin = async (targetUser: User) => {
		if (targetUser.role !== "user") {
			showError("Only users can be promoted to admin");
			return;
		}

		try {
			setRoleActionUserId(targetUser._id);
			await updateUserRole(targetUser._id, "admin");
			showSuccess(`${targetUser.email} has been promoted to admin`);
			refetchUsers();
		} catch (error) {
			showError(
				error instanceof Error ? error.message : "Failed to promote user",
			);
		} finally {
			setRoleActionUserId(null);
		}
	};

	const handleSendVerificationLink = async (user: User) => {
		if (user.isVerified) {
			showError("User is already verified");
			return;
		}

		try {
			setVerificationActionUserId(user._id);
			const message = await resendVerificationLinkByAdmin(user._id);
			showSuccess(message || "Verification link sent");
		} catch (error) {
			showError(
				error instanceof Error
					? error.message
					: "Failed to send verification link",
			);
		} finally {
			setVerificationActionUserId(null);
		}
	};

	const handleCreateUser = async () => {
		const name = newUserName.trim();
		const email = newUserEmail.trim().toLowerCase();
		const password = newUserPassword.trim();

		if (name.length < 2) {
			showError("Name must be at least 2 characters");
			return;
		}

		if (!email) {
			showError("Email is required");
			return;
		}

		if (password.length > 0 && password.length < 8) {
			showError("Password must be at least 8 characters");
			return;
		}

		try {
			setIsCreatingUser(true);
			const result = await createUserBySuperAdmin({
				name,
				email,
				phoneNumber: newUserPhone.trim(),
				password: password || undefined,
				verificationMethod,
			});

			const successMessage =
				verificationMethod === "otp"
					? `User created. Temp password: ${result.temporaryPassword}. OTP: ${result.otpCode ?? "N/A"}`
					: `User created. Temp password: ${result.temporaryPassword}.`;

			showSuccess(successMessage);

			if (result.onboardingEmailSent) {
				if (verificationMethod === "link") {
					showInfo("Verification link sent to user email.");
				}
			} else {
				showInfo(
					result.onboardingEmailError
						? `User created but onboarding email failed: ${result.onboardingEmailError}`
						: "User created but onboarding email could not be sent.",
				);
			}

			setNewUserName("");
			setNewUserEmail("");
			setNewUserPhone("");
			setNewUserPassword("");
			setVerificationMethod("link");
			refetchUsers();
		} catch (error) {
			showError(
				error instanceof Error ? error.message : "Failed to create user",
			);
		} finally {
			setIsCreatingUser(false);
		}
	};

	return (
		<div className="space-y-8 p-4 md:p-8 max-w-[1600px] mx-auto">
			<div>
				<h2 className="text-2xl font-semibold">Super Admin Console</h2>
				<p className="text-sm text-muted-foreground mt-1">
					Manage admin access and monitor all role-change actions.
				</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Create User (OTP or Link Verification)</CardTitle>
				</CardHeader>
				<CardContent className="space-y-3">
					<p className="text-sm text-muted-foreground">
						Super admin can create user accounts with random password generation
						and either OTP or link-based email verification.
					</p>
					<div className="grid grid-cols-1 gap-3 md:grid-cols-2">
						<Input
							placeholder="Full name"
							value={newUserName}
							onChange={(event) => setNewUserName(event.target.value)}
						/>
						<Input
							type="email"
							placeholder="user@example.com"
							value={newUserEmail}
							onChange={(event) => setNewUserEmail(event.target.value)}
						/>
						<Input
							placeholder="Phone (optional)"
							value={newUserPhone}
							onChange={(event) => setNewUserPhone(event.target.value)}
						/>
						<div className="flex gap-2">
							<Input
								type="text"
								placeholder="Temporary password (optional)"
								value={newUserPassword}
								onChange={(event) => setNewUserPassword(event.target.value)}
							/>
							<Button
								type="button"
								variant="outline"
								onClick={() => setNewUserPassword(generateRandomPassword())}
							>
								Generate
							</Button>
						</div>
					</div>
					<div className="flex items-center gap-3">
						<label className="text-sm font-medium text-slate-700">
							Verification method
						</label>
						<select
							value={verificationMethod}
							onChange={(event) =>
								setVerificationMethod(event.target.value as "link" | "otp")
							}
							className="rounded-md border border-slate-300 px-3 py-2 text-sm"
						>
							<option value="link">Verification Link</option>
							<option value="otp">OTP Code</option>
						</select>
					</div>
					<Button onClick={handleCreateUser} disabled={isCreatingUser}>
						{isCreatingUser ? "Creating user..." : "Create User"}
					</Button>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Create Admin By Email</CardTitle>
				</CardHeader>
				<CardContent className="space-y-3">
					<p className="text-sm text-muted-foreground">
						This promotes an existing signed-up user to admin using email.
					</p>
					<div className="flex flex-col sm:flex-row gap-3">
						<Input
							type="email"
							placeholder="name@example.com"
							value={adminEmailInput}
							onChange={(event) => setAdminEmailInput(event.target.value)}
						/>
						<Button onClick={handlePromoteByEmail} disabled={isPromoting}>
							{isPromoting ? "Promoting..." : "Promote To Admin"}
						</Button>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>User Directory</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex flex-col sm:flex-row gap-3">
						<Input
							placeholder="Search by name or email"
							value={userSearchInput}
							onChange={(event) => setUserSearchInput(event.target.value)}
						/>
						<Button onClick={handleApplySearch}>Search</Button>
					</div>

					<div className="rounded-md border overflow-hidden">
						<div className="w-full overflow-x-auto">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Name</TableHead>
										<TableHead>Email</TableHead>
										<TableHead>Role</TableHead>
										<TableHead>Verified</TableHead>
										<TableHead className="text-right">Actions</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{isSearchingUsers ? (
										<TableRow>
											<TableCell colSpan={5}>
												<Skeleton className="h-4 w-full" />
											</TableCell>
										</TableRow>
									) : searchedUsers && searchedUsers.length > 0 ? (
										searchedUsers.map((user) => (
											<TableRow key={user._id}>
												<TableCell>{user.name || "N/A"}</TableCell>
												<TableCell>{user.email}</TableCell>
												<TableCell>
													<Badge variant="outline">{user.role}</Badge>
												</TableCell>
												<TableCell>
													<Badge
														className={
															user.isVerified
																? "bg-green-100 text-green-800"
																: "bg-orange-100 text-orange-800"
														}
													>
														{user.isVerified ? "Verified" : "Unverified"}
													</Badge>
												</TableCell>
												<TableCell className="text-right">
													{user.role === "superadmin" ? (
														<Badge className="bg-amber-100 text-amber-800 border-0">
															Protected
														</Badge>
													) : user.role === "admin" ? (
														<div className="flex items-center justify-end gap-2">
															<Button
																size="sm"
																variant="destructive"
																disabled={roleActionUserId === user._id}
																onClick={() => handleDemoteToUser(user)}
															>
																{roleActionUserId === user._id
																	? "Updating..."
																	: "Demote"}
															</Button>
															{!user.isVerified && (
																<Button
																	size="sm"
																	variant="outline"
																	disabled={
																		verificationActionUserId === user._id
																	}
																	onClick={() =>
																		handleSendVerificationLink(user)
																	}
																>
																	{verificationActionUserId === user._id
																		? "Sending..."
																		: "Send verify"}
																</Button>
															)}
														</div>
													) : (
														<div className="flex items-center justify-end gap-2">
															<Button
																size="sm"
																variant="default"
																disabled={roleActionUserId === user._id}
																onClick={() => handlePromoteToAdmin(user)}
															>
																{roleActionUserId === user._id
																	? "Updating..."
																	: "Promote"}
															</Button>
															{!user.isVerified && (
																<Button
																	size="sm"
																	variant="outline"
																	disabled={
																		verificationActionUserId === user._id
																	}
																	onClick={() =>
																		handleSendVerificationLink(user)
																	}
																>
																	{verificationActionUserId === user._id
																		? "Sending..."
																		: "Send verify"}
																</Button>
															)}
														</div>
													)}
												</TableCell>
											</TableRow>
										))
									) : (
										<TableRow>
											<TableCell
												colSpan={5}
												className="text-center py-8 text-muted-foreground"
											>
												No users found.
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default SuperAdminPanel;
