import { useEffect, useState } from "react";
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
	AlertDialogAction,
	AlertDialogCancel,
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
} from "../../services/fetchFunctionsForAdmin";
import { useNavigate } from "react-router-dom";
import { showError, showSuccess } from "../../utils/toastUtils";
import { getInitials } from "../../utils/getInitial";

const ManageUsers = () => {
	const [isDeleting, setIsDeleting] = useState(false);
	const [userToDelete, setUserToDelete] = useState<string | null>(null);
	const [selectedStatus, setSelectedStatus] = useState("all");
	const {
		data: users,
		loading: isLoadingUsers,
		refetch: refetchUsers,
	} = useFetch(
		() =>
			selectedStatus === "all"
				? fetchAllUsers()
				: fetchUsersByVerification(selectedStatus === "verified"),
		false,
	);

	const verifiedUsers = users?.filter((u) => u.isVerified)?.length || 0;
	const unverifiedUsers = users?.filter((u) => !u.isVerified)?.length || 0;
	const navigate = useNavigate();

	useEffect(() => {
		refetchUsers();
	}, [selectedStatus]);

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
			setUserToDelete(null);
			// Refresh the users list after deletion
			await refetchUsers();
		} catch (error) {
			showError(
				error instanceof Error ? error.message : "Failed to delete user",
			);
		} finally {
			setIsDeleting(false);
		}
	};
	const StatsCard = ({ title, value, icon: Icon, color }: any) => (
		<Card className="hover:border-primary/50 transition-colors">
			<CardHeader className="flex justify-between items-center pb-2">
				<CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
				<div className={`p-2 rounded-full bg-${color}/10`}>
					<Icon className={`w-4 h-4 text-${color}`} />
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

	return (
		<>
			{/* Delete User confirmation dialog */}
			<AlertDialog
				open={!!userToDelete}
				onOpenChange={(open) => {
					if (!open && !isDeleting) {
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
						<AlertDialogCancel
							onClick={handleCancelDelete}
							disabled={isDeleting}
						>
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDeleteUser}
							disabled={isDeleting}
							className="bg-red-600 hover:bg-red-700"
						>
							{isDeleting ? "Deleting..." : "Delete"}
						</AlertDialogAction>
					</div>
				</AlertDialogContent>
			</AlertDialog>
			{/* Delete User confirmation dialog */}
			<div className="h-auto w-auto ">
				<div className="space-y-8 p-4 md:p-8 max-w-[1600px] mx-auto">
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
						<StatsCard
							title="Total Users"
							value={users?.length || 0}
							icon={Users}
							color="blue-500"
						/>
						<StatsCard
							title="Verified Users"
							value={verifiedUsers}
							icon={ShieldCheck}
							color="green-500"
						/>
						<StatsCard
							title="Unverified Users"
							value={unverifiedUsers}
							icon={ShieldX}
							color="red-500"
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
									) : !users?.length ? (
										<TableRow>
											<TableCell colSpan={8} className="text-center py-10">
												<div className="flex flex-col items-center gap-2 text-muted-foreground">
													<AlertCircle className="h-8 w-8" />
													<p>No users found</p>
												</div>
											</TableCell>
										</TableRow>
									) : (
										users.map((user) => (
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
																	console.log("Reset password", user._id)
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
																onClick={() => console.log("Ban", user._id)}
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
