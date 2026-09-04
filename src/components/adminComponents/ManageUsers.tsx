import { useEffect, useState, useCallback } from "react";
import type { ComponentType } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../ui/table";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";
import {
	AlertCircle,
	MoreVertical,
	ShieldCheck,
	ShieldX,
	Users,
} from "lucide-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogHeader,
	AlertDialogTitle,
} from "../ui/alert-dialog";

import useFetch from "../../hooks/useFetch";
import {
	deleteUserById,
	fetchAllUsers,
	fetchUsersByVerification,
	updateUserRole,
	User,
} from "../../services/fetchFunctionsForAdmin";
import { useNavigate } from "react-router-dom";
import { showError, showSuccess } from "../../utils/toastUtils";
import { getInitials } from "../../utils/getInitial";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";

interface StatsCardProps {
	title: string;
	value: number;
	icon: ComponentType<{ className?: string }>;
	color: "blue" | "green" | "red";
}

const STATS_CARD_STYLES: Record<
	StatsCardProps["color"],
	{ bg: string; text: string }
> = {
	blue: { bg: "bg-blue-100", text: "text-blue-600" },
	green: { bg: "bg-green-100", text: "text-green-600" },
	red: { bg: "bg-red-100", text: "text-red-600" },
};

const ManageUsers = () => {
	const [isDeleting, setIsDeleting] = useState(false);
	const [roleActionUserId, setRoleActionUserId] = useState<string | null>(null);
	const [userToDelete, setUserToDelete] = useState<string | null>(null);
	const [selectedStatus, setSelectedStatus] = useState("all");
	const [displayUsers, setDisplayUsers] = useState<User[]>([]);
	const currentUser = useSelector((state: RootState) => state.auth.user);
	const isSuperAdmin = currentUser?.role === "superadmin";
	const fetchUsersBySelectedStatus = useCallback(() => {
		return selectedStatus === "all"
			? fetchAllUsers()
			: fetchUsersByVerification(selectedStatus === "verified");
	}, [selectedStatus]);

	const {
		data: users,
		loading: isLoadingUsers,
		refetch: refetchUsers,
	} = useFetch<User[]>(fetchUsersBySelectedStatus, false);

	const verifiedUsers = displayUsers.filter((u) => u.isVerified).length;
	const unverifiedUsers = displayUsers.filter((u) => !u.isVerified).length;
	const navigate = useNavigate();

	useEffect(() => {
		refetchUsers();
	}, [selectedStatus, refetchUsers]);

	useEffect(() => {
		setDisplayUsers(users ?? []);
	}, [users]);

	const handleStatusChange = (value: string) => setSelectedStatus(value);

	const handleCancelDelete = () => {
		setIsDeleting(false);
		setUserToDelete(null);
	};
	// function for user deletion by id
	const handleDeleteUser = async () => {
		if (!userToDelete) return;
		try {
			setIsDeleting(true);
			await deleteUserById(userToDelete);
			showSuccess("User Deleted");
			setDisplayUsers((prev) => prev.filter((u) => u._id !== userToDelete));
			setUserToDelete(null);
		} catch (error) {
			showError(
				error instanceof Error ? error.message : "Failed to delete user",
			);
		} finally {
			setIsDeleting(false);
		}
	};

	const handleRoleUpdate = async (
		targetUserId: string,
		targetRole: "user" | "admin" | "superadmin",
	) => {
		try {
			setRoleActionUserId(targetUserId);
			const updatedUser = await updateUserRole(targetUserId, targetRole);
			setDisplayUsers((prev) =>
				prev.map((user) => (user._id === targetUserId ? updatedUser : user)),
			);
			showSuccess(`Role updated to ${targetRole}`);
		} catch (error) {
			showError(
				error instanceof Error ? error.message : "Failed to update role",
			);
		} finally {
			setRoleActionUserId(null);
		}
	};
	const StatsCard = ({ title, value, icon: Icon, color }: StatsCardProps) => {
		const style = STATS_CARD_STYLES[color];

		return (
			<Card className="hover:border-primary/50 transition-colors">
				<CardHeader className="flex justify-between items-center pb-2">
					<CardTitle className="text-sm text-muted-foreground">
						{title}
					</CardTitle>
					<div className={`p-2 rounded-full ${style.bg}`}>
						<Icon className={`w-4 h-4 ${style.text}`} />
					</div>
				</CardHeader>
				<CardContent>
					{isLoadingUsers ? (
						<Skeleton className="h-9 w-20" />
					) : (
						<div className="text-3xl font-bold">{value}</div>
					)}
				</CardContent>
			</Card>
		);
	};

	return (
		<>
			{/* Delete User confirmation dialog */}
			<AlertDialog
				open={!!userToDelete}
				onOpenChange={(open) => {
					if (!open) {
						handleCancelDelete();
					}
				}}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete User</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to delete this user? This action cannot be
							undone and will permanently remove the user from the system.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<div className="flex gap-3 justify-end">
						<Button onClick={handleCancelDelete} disabled={isDeleting}>
							Cancel
						</Button>
						<Button
							onClick={handleDeleteUser}
							disabled={isDeleting}
							className="bg-red-600 hover:bg-red-700"
						>
							{isDeleting ? "Deleting..." : "Delete"}
						</Button>
					</div>
				</AlertDialogContent>
			</AlertDialog>
			{/* Delete User confirmation dialog */}
			<div className="h-auto w-auto ">
				<div className="space-y-8 p-4 md:p-8 max-w-[1600px] mx-auto">
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
						<StatsCard
							title="Total Users"
							value={displayUsers.length}
							icon={Users}
							color="blue"
						/>
						<StatsCard
							title="Verified Users"
							value={verifiedUsers}
							icon={ShieldCheck}
							color="green"
						/>
						<StatsCard
							title="Unverified Users"
							value={unverifiedUsers}
							icon={ShieldX}
							color="red"
						/>
					</div>

					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-muted/50 p-4 rounded-lg">
						<h2 className="text-lg font-semibold">Users</h2>
						<Select value={selectedStatus} onValueChange={handleStatusChange}>
							<SelectTrigger className="w-full sm:w-[200px] bg-background">
								<SelectValue placeholder="Filter by status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All</SelectItem>
								<SelectItem value="verified">Verified</SelectItem>
								<SelectItem value="unverified">Unverified</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className="rounded-md border bg-card overflow-hidden">
						<div className="w-full overflow-x-auto">
							<Table>
								<TableHeader className="bg-muted/50">
									<TableRow>
										<TableHead className="hidden sm:table-cell">
											Avatar
										</TableHead>
										<TableHead>Name</TableHead>
										<TableHead className="hidden md:table-cell">
											Email
										</TableHead>
										<TableHead className="hidden lg:table-cell">
											Phone
										</TableHead>
										<TableHead className="hidden xl:table-cell">
											Auth Provider
										</TableHead>
										<TableHead className="hidden md:table-cell">Role</TableHead>
										<TableHead>Verified</TableHead>
										<TableHead className="text-right">Actions</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{isLoadingUsers ? (
										<TableRow>
											<TableCell colSpan={8}>
												<Skeleton className="h-4 w-full" />
											</TableCell>
										</TableRow>
									) : !displayUsers?.length ? (
										<TableRow>
											<TableCell colSpan={8} className="text-center py-10">
												<div className="flex flex-col items-center gap-2 text-muted-foreground">
													<AlertCircle className="h-8 w-8" />
													<p>No users found</p>
												</div>
											</TableCell>
										</TableRow>
									) : (
										displayUsers.map((user) => (
											<TableRow key={user._id}>
												<TableCell className="hidden sm:table-cell">
													{user.avatar ? (
														<img
															className="w-9 h-9 rounded-full border border-gray-300"
															src={user.avatar}
															alt={user.name}
														/>
													) : (
														<div className="w-9 h-9 rounded-full bg-blue-400 text-white flex items-center justify-center font-bold">
															{getInitials(user?.name ?? "")}
														</div>
													)}
												</TableCell>
												<TableCell className="font-medium">
													{user.name || "N/A"}
												</TableCell>
												<TableCell className="hidden md:table-cell text-sm">
													{user.email}
												</TableCell>
												<TableCell className="hidden lg:table-cell text-sm">
													{user.phoneNumber || "N/A"}
												</TableCell>
												<TableCell className="hidden xl:table-cell text-sm">
													{user.authProvider}
												</TableCell>
												<TableCell className="hidden md:table-cell">
													<Badge variant="outline">{user.role}</Badge>
												</TableCell>
												<TableCell>
													<Badge
														className={`${
															user.isVerified
																? "bg-green-100 text-green-800"
																: "bg-red-100 text-red-800"
														}`}
													>
														{user.isVerified ? "Yes" : "No"}
													</Badge>
												</TableCell>
												<TableCell className="text-right">
													<DropdownMenu>
														<DropdownMenuTrigger asChild>
															<Button
																size="sm"
																className="p-1 h-8 w-8 bg-gray-400"
															>
																<MoreVertical className="h-4 w-4" />
															</Button>
														</DropdownMenuTrigger>
														<DropdownMenuContent align="end">
															<DropdownMenuItem
																onClick={() =>
																	navigate(
																		`/admin/users/view-user/${user?._id}`,
																	)
																}
															>
																View User
															</DropdownMenuItem>
															<DropdownMenuItem
																onClick={() =>
																	navigate(
																		`/admin/messages?userId=${user?._id}`,
																	)
																}
															>
																Message User
															</DropdownMenuItem>
															{isSuperAdmin && user._id !== currentUser?.id && (
																<DropdownMenuItem
																	disabled={roleActionUserId === user._id}
																	onClick={() =>
																		handleRoleUpdate(
																			user._id,
																			user.role === "admin" ? "user" : "admin",
																		)
																	}
																>
																	{roleActionUserId === user._id
																		? "Updating role..."
																		: user.role === "admin"
																			? "Demote to User"
																			: "Promote to Admin"}
																</DropdownMenuItem>
															)}
															<DropdownMenuItem
																onClick={() =>
																	showError(
																		"Reset password is not available yet",
																	)
																}
															>
																Reset Password
															</DropdownMenuItem>
															<DropdownMenuItem
																onClick={() => setUserToDelete(user._id)}
																className="text-red-600"
															>
																Delete User
															</DropdownMenuItem>
															<DropdownMenuItem
																onClick={() =>
																	showError("Ban user is not available yet")
																}
																className="text-red-600"
															>
																Ban User
															</DropdownMenuItem>
														</DropdownMenuContent>
													</DropdownMenu>
												</TableCell>
											</TableRow>
										))
									)}
								</TableBody>
							</Table>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default ManageUsers;
