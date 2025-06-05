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
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import siliguri_property_logo_noBG from "../assets/logo_siliguri_property.png";
import { getInitials } from "../utils/getInitial";
import { formatFullName } from "../utils/capitalizeName";

interface SidebarProps {
	activeMenu: string;
	setActiveMenu: (menu: string) => void;
	setSidebarOpen: (open: boolean) => void;
}

const menuItems = [
	{ label: "Your Profile", icon: <FiUser />, path: "/dashboard" },
	{ label: "New Post", icon: <FiPlusCircle />, path: "/dashboard/new-post" },
	{
		label: "View Your Listings",
		icon: <FiList />,
		path: "/dashboard/view-your-listings",
	},
	{
		label: "Promote Your listings",
		icon: <FiTrendingUp />,
		path: "/dashboard/promote",
	},
	{ label: "Messages", icon: <FiMessageCircle />, path: "/dashboard/messages" },
];

const Sidebar: React.FC<SidebarProps> = ({ setActiveMenu, setSidebarOpen }) => {
	const navigate = useNavigate();
	const location = useLocation();

	const { user } = useSelector((state: RootState) => state.auth);

	return (
		<motion.div
			initial={{ x: -300 }}
			animate={{ x: 0 }}
			exit={{ x: -300 }}
			transition={{ type: "spring", stiffness: 100, damping: 20 }}
			className="h-full w-full flex flex-col  border-r border-gray-200 shadow-sm bg-gray-200"
		>
			<div className="flex flex-col flex-1">
				<div className=" border-b border-gray-100 block">
					<NavLink to="/" className="block">
						<img
							src={siliguri_property_logo_noBG}
							alt="Logo"
							className="object-contain h-30 w-30 mx-auto"
						/>
					</NavLink>
				</div>
				<div className="flex items-center space-x-3 p-4 border-b-2 border-gray-100">
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

				<nav className="flex-1 p-4">
					<ul className="space-y-1">
						{menuItems.map((item) => {
							const isActive = location.pathname === item.path;
							return (
								<motion.li
									key={item.label}
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
									className={`
                                        flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer
                                        transition-all duration-200 ease-in-out 
                                        ${
																					isActive
																						? "bg-primary text-primary-foreground shadow-sm"
																						: "text-gray-700 hover:bg-gray-50"
																				}
                                    `}
									onClick={() => {
										setActiveMenu(item.label);
										setSidebarOpen(false);
										navigate(item.path);
									}}
								>
									<span
										className={`text-lg ${
											isActive ? "text-primary-foreground" : "text-gray-500"
										}`}
									>
										{item.icon}
									</span>
									<span className="font-medium">{item.label}</span>
								</motion.li>
							);
						})}
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
