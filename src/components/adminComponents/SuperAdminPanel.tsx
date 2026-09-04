import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import {
	fetchAdminUsers,
	promoteAdminByEmail,
	updateUserRole,
	User,
} from "../../services/fetchFunctionsForAdmin";
import useFetch from "../../hooks/useFetch";
import { showError, showSuccess } from "../../utils/toastUtils";
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
	const [adminSearchInput, setAdminSearchInput] = useState("");
	const [adminSearchQuery, setAdminSearchQuery] = useState("");
	const [adminEmailInput, setAdminEmailInput] = useState("");
	const [isPromoting, setIsPromoting] = useState(false);
	const [roleActionUserId, setRoleActionUserId] = useState<string | null>(null);

	const fetchAdminsByQuery = useCallback(() => {
		return fetchAdminUsers(adminSearchQuery);
	}, [adminSearchQuery]);

	const {
		data: adminUsers,
		loading: isAdminUsersLoading,
		refetch: refetchAdminUsers,
	} = useFetch<User[]>(fetchAdminsByQuery, false);

	useEffect(() => {
		refetchAdminUsers();
	}, [adminSearchQuery, refetchAdminUsers]);

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
		setAdminSearchQuery(adminSearchInput.trim());
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
			refetchAdminUsers();
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
			refetchAdminUsers();
		} catch (error) {
			showError(
				error instanceof Error ? error.message : "Failed to demote user",
			);
		} finally {
			setRoleActionUserId(null);
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
					<CardTitle>Admin Directory</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex flex-col sm:flex-row gap-3">
						<Input
							placeholder="Search by name or email"
							value={adminSearchInput}
							onChange={(event) => setAdminSearchInput(event.target.value)}
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
										<TableHead className="text-right">Action</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{isAdminUsersLoading ? (
										<TableRow>
											<TableCell colSpan={4}>
												<Skeleton className="h-4 w-full" />
											</TableCell>
										</TableRow>
									) : adminUsers && adminUsers.length > 0 ? (
										adminUsers.map((user) => (
											<TableRow key={user._id}>
												<TableCell>{user.name || "N/A"}</TableCell>
												<TableCell>{user.email}</TableCell>
												<TableCell>
													<Badge variant="outline">{user.role}</Badge>
												</TableCell>
												<TableCell className="text-right">
													{user.role === "superadmin" ? (
														<Badge className="bg-amber-100 text-amber-800 border-0">
															Protected
														</Badge>
													) : (
														<Button
															size="sm"
															variant="destructive"
															disabled={roleActionUserId === user._id}
															onClick={() => handleDemoteToUser(user)}
														>
															{roleActionUserId === user._id
																? "Updating..."
																: "Revoke Admin"}
														</Button>
													)}
												</TableCell>
											</TableRow>
										))
									) : (
										<TableRow>
											<TableCell
												colSpan={4}
												className="text-center py-8 text-muted-foreground"
											>
												No admin users found.
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
