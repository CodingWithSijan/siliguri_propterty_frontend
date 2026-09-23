import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { AnimatePresence } from "framer-motion";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../app/store";
import { LogOut, UserRound } from "lucide-react";
import { logout } from "../app/slices/authSlice";
import NotificationBell from "../components/common/NotificationBell";
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "../components/ui/alert-dialog";
import { Button } from "../components/ui/button";

const DashboardLayout: React.FC = () => {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
	const navigate = useNavigate();
	const location = useLocation();
	const dispatch = useDispatch<AppDispatch>();

	const sectionMeta: Record<string, { title: string; subtitle: string }> = {
		"/dashboard/your-profile": {
			title: "Your Profile",
			subtitle: "Update personal information and account security settings.",
		},
		"/dashboard/new-post": {
			title: "Create New Listing",
			subtitle: "Add a complete listing with details, photos and pricing.",
		},
		"/dashboard/view-your-listings": {
			title: "Your Listings",
			subtitle: "Track approval status and manage all your properties.",
		},
		"/dashboard/saved-posts": {
			title: "Saved Posts",
			subtitle: "Revisit properties you bookmarked for later.",
		},
		"/dashboard/messages": {
			title: "Messages",
			subtitle: "Respond quickly to buyers, renters and owners.",
		},
		"/dashboard/notifications": {
			title: "Notifications",
			subtitle: "Stay updated on listing activity and platform alerts.",
		},
	};

	const currentSection = sectionMeta[location.pathname] ??
		sectionMeta["/dashboard/your-profile"] ?? {
			title: "Dashboard",
			subtitle: "Manage your account and listings.",
		};

	const handleLogout = () => {
		dispatch(logout());
		setSidebarOpen(false);
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/40 to-sky-50/60">
			<div className="flex min-h-screen">
				<div className="hidden md:block md:w-72 md:shrink-0 md:border-r md:border-emerald-100 md:bg-white">
					<Sidebar setSidebarOpen={setSidebarOpen} />
				</div>

				{sidebarOpen && (
					<>
						<div
							className="fixed inset-0 z-40 bg-black/35 md:hidden"
							onClick={() => setSidebarOpen(false)}
						/>
						<div className="fixed inset-y-0 left-0 z-50 w-72 md:hidden">
							<AnimatePresence>
								<Sidebar setSidebarOpen={setSidebarOpen} />
							</AnimatePresence>
						</div>
					</>
				)}

				<main className="relative min-w-0 flex-1 overflow-y-auto">
					<header className="sticky top-0 z-30 border-b border-emerald-100 bg-gradient-to-r from-white/95 to-emerald-50/90 px-3 py-3 shadow-sm backdrop-blur md:px-6">
						<div className="flex items-start justify-between gap-3">
							<div className="flex min-w-0 items-start gap-2">
								<button
									type="button"
									onClick={() => setSidebarOpen((prev) => !prev)}
									className="md:hidden inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm"
									aria-label="Toggle menu"
								>
									<Bars3Icon className="h-5 w-5" />
								</button>
								<div className="min-w-0">
									<p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-700">
										User Dashboard
									</p>
									<h1 className="truncate text-lg font-bold text-slate-900 md:text-xl">
										{currentSection.title}
									</h1>
									<p className="hidden text-sm text-slate-600 sm:block">
										{currentSection.subtitle}
									</p>
								</div>
							</div>
							<div className="flex items-center justify-end gap-2">
								<div className="rounded-full border border-slate-200 bg-white p-1 shadow-sm">
									<button
										type="button"
										onClick={() => navigate("/dashboard/your-profile")}
										className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-700 transition-colors hover:bg-emerald-50 hover:text-emerald-700"
										aria-label="Open profile"
										title="Profile"
									>
										<UserRound className="h-4.5 w-4.5" />
									</button>
								</div>
								<div className="rounded-full border border-slate-200 bg-white p-1 shadow-sm">
									<NotificationBell buttonClassName="h-9 w-9 rounded-full bg-white p-2 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700" />
								</div>
								<div className="rounded-full border border-rose-200 bg-white p-1 shadow-sm">
									<button
										type="button"
										onClick={() => setShowLogoutConfirm(true)}
										className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-rose-600 transition-colors hover:bg-rose-50 hover:text-rose-700"
										aria-label="Sign out"
										title="Sign out"
									>
										<LogOut className="h-4.5 w-4.5" />
									</button>
								</div>
							</div>
						</div>
						<div className="mt-3 hidden items-center gap-2 md:flex">
							<Link
								to="/dashboard/new-post"
								className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800 transition hover:border-emerald-300 hover:bg-emerald-100 hover:text-emerald-900"
							>
								+ Add New Listing
							</Link>
							<Link
								to="/properties"
								className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-800 transition hover:border-sky-300 hover:bg-sky-100 hover:text-sky-900"
							>
								Browse Public Listings
							</Link>
						</div>
					</header>

					<div className="px-3 pb-4 pt-4 md:px-6 md:pb-6 md:pt-5">
						<Outlet />
					</div>
				</main>
			</div>

			<AlertDialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Sign out now?</AlertDialogTitle>
						<AlertDialogDescription>
							You will need to log in again to access your dashboard.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => setShowLogoutConfirm(false)}
						>
							Cancel
						</Button>
						<Button
							type="button"
							onClick={handleLogout}
							className="bg-rose-600 hover:bg-rose-700"
						>
							Logout
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
};

export default DashboardLayout;
