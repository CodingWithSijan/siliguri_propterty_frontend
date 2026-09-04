import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { AnimatePresence } from "framer-motion";
import { Outlet, useNavigate } from "react-router-dom";
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
	const [activeMenu, setActiveMenu] = useState("Profile");
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
	const navigate = useNavigate();
	const dispatch = useDispatch<AppDispatch>();

	const handleLogout = () => {
		dispatch(logout());
		setSidebarOpen(false);
	};

	return (
		<div className="min-h-screen bg-slate-50">
			<div className="flex min-h-screen">
				<div className="hidden md:block md:w-72 md:shrink-0 md:border-r md:border-slate-200 md:bg-white">
					<Sidebar
						activeMenu={activeMenu}
						setActiveMenu={setActiveMenu}
						setSidebarOpen={setSidebarOpen}
					/>
				</div>

				<button
					type="button"
					onClick={() => setSidebarOpen((prev) => !prev)}
					className="md:hidden fixed left-3 top-3 z-50 inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm"
					aria-label="Toggle menu"
				>
					<Bars3Icon className="h-5 w-5" />
				</button>

				{sidebarOpen && (
					<>
						<div
							className="fixed inset-0 z-40 bg-black/35 md:hidden"
							onClick={() => setSidebarOpen(false)}
						/>
						<div className="fixed inset-y-0 left-0 z-50 w-72 md:hidden">
							<AnimatePresence>
								<Sidebar
									activeMenu={activeMenu}
									setActiveMenu={setActiveMenu}
									setSidebarOpen={setSidebarOpen}
								/>
							</AnimatePresence>
						</div>
					</>
				)}

				<main className="relative min-w-0 flex-1 overflow-y-auto">
					<div className="fixed right-3 top-3 z-40 flex items-center gap-2 md:right-6 md:top-5 md:gap-3">
						<div className="rounded-full border border-slate-200 bg-white/95 p-1 shadow-sm backdrop-blur">
							<button
								type="button"
								onClick={() => navigate("/dashboard/your-profile")}
								className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-700 transition-colors hover:bg-sky-50 hover:text-sky-700"
								aria-label="Open profile"
								title="Profile"
							>
								<UserRound className="h-4.5 w-4.5" />
							</button>
						</div>
						<div className="rounded-full border border-slate-200 bg-white/95 p-1 shadow-sm backdrop-blur">
							<NotificationBell buttonClassName="h-9 w-9 rounded-full bg-white p-2 text-slate-700 hover:bg-sky-50 hover:text-sky-700" />
						</div>
						<div className="rounded-full border border-rose-200 bg-white/95 p-1 shadow-sm backdrop-blur">
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

					<div className="px-3 pb-4 pt-16 md:px-6 md:pb-6 md:pt-20">
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
