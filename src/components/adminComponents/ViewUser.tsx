// components/UserProfileCard.tsx
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
	ShieldCheck,
	ShieldX,
	User as UserIcon,
	Mail,
	Phone,
	Key,
	UserCheck,
	Calendar,
	Crown,
	Fingerprint,
} from "lucide-react";
import useFetch from "../../hooks/useFetch";
import { fetchUserById, User } from "../../services/fetchFunctionsForAdmin";
import { useParams } from "react-router-dom";
import { convert_ISO_Date_to_Normal } from "../../utils/convert_ISO_Date_to_Normal";
import { useEffect } from "react";

const UserProfileCard = () => {
	const { id } = useParams();

	const {
		data: user,
		loading: isLoadingUser,
		refetch: refetchUser,
	} = useFetch<User>(() => fetchUserById(id as string), false);

	useEffect(() => {
		refetchUser();
	}, []);

	if (isLoadingUser) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
			</div>
		);
	}

	return (
		<div className="min-h-scree p-4 md:p-6 lg:p-8">
			<div className="max-w-4xl mx-auto">
				<Card className="h-full  border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
					{/* Header Section */}
					<CardHeader className="pb-8 pt-8 px-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
						<div className="flex flex-col md:flex-row items-center md:items-start gap-6">
							<div className="relative">
								{user?.avatar ? (
									<img
										src={user.avatar}
										alt="Avatar"
										className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-white/20 shadow-lg"
									/>
								) : (
									<div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white/20 border-4 border-white/20 shadow-lg flex items-center justify-center">
										<UserIcon className="w-12 h-12 md:w-16 md:h-16 text-white/70" />
									</div>
								)}
								<div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg">
									{user?.isVerified ? (
										<ShieldCheck className="w-6 h-6 text-green-500" />
									) : (
										<ShieldX className="w-6 h-6 text-red-500" />
									)}
								</div>
							</div>

							<div className="text-center md:text-left flex-1">
								<CardTitle className="text-2xl md:text-3xl font-bold mb-2">
									{user?.name || "Unknown User"}
								</CardTitle>
								<div className="flex items-center justify-center md:justify-start gap-2 mb-3">
									<Mail className="w-4 h-4" />
									<p className="text-white/90">{user?.email}</p>
								</div>
								<div className="flex items-center justify-center md:justify-start gap-2">
									<Badge
										variant={
											user?.role === "admin" ? "destructive" : "secondary"
										}
										className="text-sm font-medium px-3 py-1"
									>
										{user?.role === "admin" && (
											<Crown className="w-3 h-3 mr-1" />
										)}
										{user?.role?.toUpperCase() || "USER"}
									</Badge>
									<Badge
										variant={user?.isVerified ? "default" : "destructive"}
										className={`text-sm font-medium px-3 py-1 ${
											user?.isVerified
												? "bg-green-500 hover:bg-green-600"
												: "bg-red-500 hover:bg-red-600"
										}`}
									>
										{user?.isVerified ? (
											<>
												<ShieldCheck className="w-3 h-3 mr-1" />
												Verified
											</>
										) : (
											<>
												<ShieldX className="w-3 h-3 mr-1" />
												Unverified
											</>
										)}
									</Badge>
								</div>
							</div>
						</div>
					</CardHeader>

					{/* Content Section */}
					<CardContent className="p-8">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
							{/* Personal Information */}
							<div className="space-y-6">
								<h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 pb-2">
									Personal Information
								</h3>

								<div className="space-y-4">
									<div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
										<div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
											<Fingerprint className="w-5 h-5 text-blue-600 dark:text-blue-400" />
										</div>
										<div>
											<p className="text-sm font-medium text-slate-600 dark:text-slate-400">
												User ID
											</p>
											<p className="text-slate-800 dark:text-slate-200 font-mono text-sm">
												{user?._id || "N/A"}
											</p>
										</div>
									</div>

									<div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
										<div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
											<Phone className="w-5 h-5 text-green-600 dark:text-green-400" />
										</div>
										<div>
											<p className="text-sm font-medium text-slate-600 dark:text-slate-400">
												Phone Number
											</p>
											<p className="text-slate-800 dark:text-slate-200">
												{user?.phoneNumber || "Not provided"}
											</p>
										</div>
									</div>

									<div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
										<div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
											<Key className="w-5 h-5 text-purple-600 dark:text-purple-400" />
										</div>
										<div>
											<p className="text-sm font-medium text-slate-600 dark:text-slate-400">
												Auth Provider
											</p>
											<p className="text-slate-800 dark:text-slate-200 capitalize">
												{user?.authProvider || "N/A"}
											</p>
										</div>
									</div>
								</div>
							</div>

							{/* Account Details */}
							<div className="space-y-6">
								<h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 pb-2">
									Account Details
								</h3>

								<div className="space-y-4">
									<div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
										<div className="p-2 bg-orange-100 dark:bg-orange-900/50 rounded-lg">
											<UserCheck className="w-5 h-5 text-orange-600 dark:text-orange-400" />
										</div>
										<div>
											<p className="text-sm font-medium text-slate-600 dark:text-slate-400">
												Account Role
											</p>
											<div className="flex items-center gap-2 mt-1">
												<Badge
													variant={
														user?.role === "admin" ? "destructive" : "default"
													}
													className="text-sm"
												>
													{user?.role === "admin" && (
														<Crown className="w-3 h-3 mr-1" />
													)}
													{user?.role?.toUpperCase() || "USER"}
												</Badge>
											</div>
										</div>
									</div>

									<div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
										<div
											className={`p-2 rounded-lg ${
												user?.isVerified
													? "bg-green-100 dark:bg-green-900/50"
													: "bg-red-100 dark:bg-red-900/50"
											}`}
										>
											{user?.isVerified ? (
												<ShieldCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
											) : (
												<ShieldX className="w-5 h-5 text-red-600 dark:text-red-400" />
											)}
										</div>
										<div>
											<p className="text-sm font-medium text-slate-600 dark:text-slate-400">
												Verification Status
											</p>
											<Badge
												variant={user?.isVerified ? "default" : "destructive"}
												className={`mt-1 ${
													user?.isVerified
														? "bg-green-500 hover:bg-green-600"
														: "bg-red-500 hover:bg-red-600"
												}`}
											>
												{user?.isVerified
													? "Verified Account"
													: "Unverified Account"}
											</Badge>
										</div>
									</div>

									<div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
										<div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
											<Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
										</div>
										<div>
											<p className="text-sm font-medium text-slate-600 dark:text-slate-400">
												Member Since
											</p>
											<p className="text-slate-800 dark:text-slate-200">
												{user?.createdAt
													? convert_ISO_Date_to_Normal(user.createdAt)
													: "N/A"}
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* Additional Actions Section */}
						<div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
							<div className="flex items-center justify-center gap-4 text-sm text-slate-500 dark:text-slate-400">
								<span>
									Profile last updated: {new Date().toLocaleDateString()}
								</span>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default UserProfileCard;
