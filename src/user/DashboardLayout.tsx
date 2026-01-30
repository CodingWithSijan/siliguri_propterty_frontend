import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { Bars3Icon } from "@heroicons/react/24/outline";
import ProtectedRoute from "../route/ProtectedRoute";
import { AnimatePresence } from "framer-motion";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../app/store";
import { getInitials } from "../utils/getInitial";
import { formatFullName } from "../utils/capitalizeName";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { FiLogOut } from "react-icons/fi";
import { logout } from "../app/slices/authSlice";

const DashboardLayout: React.FC = () => {
	const [activeMenu, setActiveMenu] = useState("Your Profile");
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const { user } = useSelector((state: RootState) => state.auth);
	const dispatch = useDispatch<AppDispatch>();
	return (
		<div className="flex flex-col h-screen bg-background">
			{/* Fixed Mobile Top Bar */}
			<div className="md:hidden fixed top-0 left-0 right-0 bg-card border-b border-border shadow-sm z-50 flex items-center justify-between px-4 py-3">
				<button
					onClick={() => setSidebarOpen(!sidebarOpen)}
					className="p-2 bg-primary text-primary-foreground rounded-lg shadow-sm hover:bg-primary/90 transition-all flex items-center space-x-2"
					aria-label="Toggle menu"
				>
					<Bars3Icon className="h-6 w-6" />
					<span className="text-sm font-semibold">Menu</span>
				</button>
				<DropdownMenu>
					<DropdownMenuTrigger>
						{" "}
						<div className="flex items-center gap-2">
							{user?.avatar ? (
								<img
									className="w-8 h-8 rounded-full border-2 border-blue-500"
									src={user.avatar}
									alt={user.name}
								/>
							) : (
								<div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
									{getInitials(user?.name ?? "")}
								</div>
							)}
							<span className="text-blue-900 font-medium">
								{formatFullName(user?.name)}
							</span>
						</div>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="w-[250px]">
						<DropdownMenuLabel>My Account</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem>
							<div className="p-2 border-t border-gray-100">
								<motion.button
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
									className="w-full flex items-center gap-3  text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
								>
									<FiLogOut className="text-lg" />
									<button
										className="font-medium"
										onClick={() => dispatch(logout())}
									>
										Logout
									</button>
								</motion.button>
							</div>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			<div className="flex flex-1 pt-[60px] md:pt-0 h-screen">
				{/* Overlay */}
				{sidebarOpen && (
					<div
						className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden transition-all"
						onClick={() => setSidebarOpen(false)}
					></div>
				)}

				{/* Sidebar */}
				<div
					className={`
						fixed md:relative md:flex flex-shrink-0 w-64 h-full z-40
						transition-transform duration-300 ease-in-out
						${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
					`}
				>
					<AnimatePresence>
						<Sidebar
							activeMenu={activeMenu}
							setActiveMenu={setActiveMenu}
							setSidebarOpen={setSidebarOpen}
						/>
					</AnimatePresence>
				</div>

				{/* Main Content */}
				<main className="flex-1 overflow-auto bg-muted/30">
					<ProtectedRoute allowedRoles={["user"]}>
						<div className="h-full">
							<Outlet />
						</div>
					</ProtectedRoute>
				</main>
			</div>
		</div>
	);
};

export default DashboardLayout;
