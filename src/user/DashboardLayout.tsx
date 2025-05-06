import React, { useState } from "react";
import Sidebar from "./Sidebar";
import ContentDisplay from "./ContentDisplay";
import { ArrowDownIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Navbar from "../header_and_footer/Navbar";
import ProtectedRoute from "../route/ProtectedRoute";

const DashboardLayout: React.FC = () => {
	const [activeMenu, setActiveMenu] = useState("Your Profile");
	const [sidebarOpen, setSidebarOpen] = useState(false);

	return (
		<>
			<Navbar />
			<div className="min-h-screen bg-gray-50">
				{/* Mobile toggle button */}
				<div className="md:hidden fixed -top-4 left-1/2 transform -translate-x-1/2 z-50">
					<button
						onClick={() => setSidebarOpen(!sidebarOpen)}
						className="p-2 bg-blue-600 text-white rounded-full"
					>
						{sidebarOpen ? (
							<XMarkIcon className="h-6 w-6" />
						) : (
							<ArrowDownIcon className="h-6 w-6" />
						)}
					</button>
				</div>

				<div className="flex flex-col md:flex-row min-h-screen">
					{/* Sidebar */}
					<div
						className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-white shadow-lg p-4 transition-transform duration-300 md:relative md:translate-x-0 md:block ${
							sidebarOpen ? "translate-x-0" : "-translate-x-full"
						}`}
					>
						<Sidebar
							activeMenu={activeMenu}
							setActiveMenu={setActiveMenu}
							setSidebarOpen={setSidebarOpen}
						/>
					</div>
					Overlay on mobile when sidebar is open
					{sidebarOpen && (
						<div
							className="fixed inset-0 bg-black opacity-30 z-30 md:hidden"
							onClick={() => setSidebarOpen(false)}
						></div>
					)}
					{/* Content */}
					<main className="flex-1 p-4">
						<ProtectedRoute allowedRoles={["user"]}>
							<ContentDisplay activeMenu={activeMenu} />
						</ProtectedRoute>
					</main>
				</div>
			</div>
		</>
	);
};

export default DashboardLayout;
