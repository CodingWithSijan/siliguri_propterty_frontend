import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import ContentDisplay from "./ContentDisplay";
import { Bars3Icon } from "@heroicons/react/24/outline";
import Navbar from "../header_and_footer/Navbar";
import ProtectedRoute from "../route/ProtectedRoute";
import { AnimatePresence } from "framer-motion";
import { useAuth } from "../contextAPI/UserAuthContext";
import BASE_URL from "../services";

const DashboardLayout: React.FC = () => {
	const [activeMenu, setActiveMenu] = useState("Your Profile");
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const { user, setUser, token } = useAuth();

	useEffect(() => {
		const fetchLatestUser = async () => {
			if (!user?.id || !token) return;
			try {
				const res = await BASE_URL.get(
					`${import.meta.env.VITE_BACKEND_URL}/api/users/${user.id}`
				);
				setUser((prev) => ({ ...prev, ...res.data }));
			} catch (err) {
				console.error("Failed to refresh user context", err);
			}
		};

		fetchLatestUser();
	}, []);

	return (
		<>
			<Navbar />

			{/* Main Layout Below Navbar */}
			<div className="h-[calc(100vh-4rem)] bg-gray-50 relative overflow-hidden">
				{/* Mobile Menu Button */}
				<div className="md:hidden fixed top-2 left-2 z-50">
					<button
						onClick={() => setSidebarOpen(!sidebarOpen)}
						className="p-2 bg-blue-600 text-white rounded-full shadow-lg"
					>
						<Bars3Icon className="h-6 w-6" />
					</button>
				</div>

				{/* Overlay */}
				{sidebarOpen && (
					<div
						className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
						onClick={() => setSidebarOpen(false)}
					></div>
				)}

				{/* Content Wrapper */}
				<div className="flex w-full h-full md:flex-row flex-col overflow-hidden">
					{/* Sidebar */}
					<div
						className={`
							bg-white w-64 shadow-lg pt-10 p-4 transition-transform duration-300
							${
								sidebarOpen
									? "fixed z-40 inset-y-0 left-0 translate-x-0"
									: "absolute -translate-x-full"
							}
							md:relative md:translate-x-0 md:z-auto
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

					{/* Main Dashboard Content */}
					<main className="flex-1 p-4 overflow-y-auto">
						<ProtectedRoute allowedRoles={["user"]}>
							<div className="bg-white rounded-2xl shadow-md h-full">
								<ContentDisplay activeMenu={activeMenu} />
							</div>
						</ProtectedRoute>
					</main>
				</div>
			</div>
		</>
	);
};

export default DashboardLayout;
