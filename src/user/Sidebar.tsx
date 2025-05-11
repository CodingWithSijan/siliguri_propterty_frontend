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
	setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
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
			transition={{ duration: 0.3 }}
			className="h-full flex flex-col justify-between"
		>
			<div>
				<ul className="space-y-3">
					{menuItems.map((item) => (
						<li
							key={item.label}
							className={`flex items-center gap-3 cursor-pointer px-4 py-2 rounded-md transition ${
								activeMenu === item.label
									? "bg-blue-600 text-white font-semibold"
									: "text-gray-700 hover:bg-gray-100"
							}`}
							onClick={() => {
								setActiveMenu(item.label);
								setSidebarOpen(false);
							}}
						>
							{item.icon}
							<span>{item.label}</span>
						</li>
					))}
				</ul>
			</div>

			{/* Logout at Bottom (optional if you reintegrate it later) */}
			<div className="mt-auto pt-6">
				<button className="w-full flex items-center gap-2 text-sm px-4 py-2 text-red-600 hover:bg-red-50 rounded-md">
					<FiLogOut className="text-lg" />
					Logout
				</button>
			</div>
		</motion.div>
	);
};

export default Sidebar;
