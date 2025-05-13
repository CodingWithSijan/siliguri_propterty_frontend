import React from "react";
import {
	FiUser,
	FiPlusCircle,
	FiList,
	FiTrendingUp,
	FiMessageCircle,
	FiLogOut,
} from "react-icons/fi";
import { motion } from "framer-motion";

interface SidebarProps {
	activeMenu: string;
	setActiveMenu: (menu: string) => void;
	setSidebarOpen: (open: boolean) => void;
}

const menuItems = [
	{ label: "Your Profile", icon: <FiUser /> },
	{ label: "New Post", icon: <FiPlusCircle /> },
	{ label: "View Your Listings", icon: <FiList /> },
	{ label: "Promote Your listings", icon: <FiTrendingUp /> },
	{ label: "Messages", icon: <FiMessageCircle /> },
];

const Sidebar: React.FC<SidebarProps> = ({
	activeMenu,
	setActiveMenu,
	setSidebarOpen,
}) => {
	return (
		<motion.div
			initial={{ x: -300 }}
			animate={{ x: 0 }}
			exit={{ x: -300 }}
			transition={{ type: "spring", stiffness: 100, damping: 20 }}
			className="h-full w-full flex flex-col bg-white border-r border-gray-200 shadow-sm"
		>
			<div className="flex flex-col flex-1">
				<div className="p-6 border-b border-gray-100">
					<h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
				</div>

				<nav className="flex-1 p-4">
					<ul className="space-y-1">
						{menuItems.map((item) => (
							<motion.li
								key={item.label}
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								className={`
									flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer
									transition-all duration-200 ease-in-out
									${
										activeMenu === item.label
											? "bg-primary text-primary-foreground shadow-sm"
											: "text-gray-700 hover:bg-gray-50"
									}
								`}
								onClick={() => {
									setActiveMenu(item.label);
									setSidebarOpen(false);
								}}
							>
								<span
									className={`text-lg ${
										activeMenu === item.label
											? "text-primary-foreground"
											: "text-gray-500"
									}`}
								>
									{item.icon}
								</span>
								<span className="font-medium">{item.label}</span>
							</motion.li>
						))}
					</ul>
				</nav>
			</div>

			<div className="p-4 border-t border-gray-100">
				<motion.button
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
					className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
				>
					<FiLogOut className="text-lg" />
					<span className="font-medium">Logout</span>
				</motion.button>
			</div>
		</motion.div>
	);
};

export default Sidebar;
