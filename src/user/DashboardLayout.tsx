import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import ContentDisplay from "./ContentDisplay";
import { Bars3Icon } from "@heroicons/react/24/outline";
import Navbar from "../components/header_and_footer/Navbar";
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
	}, [user?.id, token, setUser]);

	return (
		<div className="flex flex-col h-screen bg-gray-50">
			<Navbar />
			<div className="flex flex-1 overflow-hidden">
				{/* Mobile Menu Button */}
				<div className="md:hidden fixed top-20 left-4 z-50">
					<button
						onClick={() => setSidebarOpen(!sidebarOpen)}
						className="p-2 bg-primary text-primary-foreground rounded-lg shadow-lg hover:bg-primary/90 transition-colors"
						aria-label="Toggle menu"
					>
						<Bars3Icon className="h-6 w-6" />
					</button>
				</div>

				{/* Overlay */}
				{sidebarOpen && (
					<div
						className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden transition-opacity"
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

				{/* Main Content Area */}
				<main className="flex-1 overflow-hidden">
					<ProtectedRoute allowedRoles={["user"]}>
						<div className="h-full bg-white">
							<ContentDisplay activeMenu={activeMenu} />
						</div>
					</ProtectedRoute>
				</main>
			</div>
		</div>
	);
};

export default DashboardLayout;
