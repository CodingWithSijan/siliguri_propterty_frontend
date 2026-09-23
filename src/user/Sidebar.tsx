import React from "react";
import {
	FiPlusCircle,
	FiList,
	FiCompass,
	FiHeart,
	FiMessageSquare,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import siliguri_property_logo_noBG from "../assets/logo_siliguri_property.png";
import { getInitials } from "../utils/getInitial";
import { formatFullName } from "../utils/capitalizeName";
interface SidebarProps {
	setSidebarOpen: (open: boolean) => void;
}

const menuItems = [
	{ label: "New Post", icon: <FiPlusCircle />, path: "/dashboard/new-post" },
	{
		label: "View Your Listings",
		icon: <FiList />,
		path: "/dashboard/view-your-listings",
	},
	{
		label: "Saved Posts",
		icon: <FiHeart />,
		path: "/dashboard/saved-posts",
	},
	{
		label: "Messages",
		icon: <FiMessageSquare />,
		path: "/dashboard/messages",
	},
	{
		label: "Browse Properties",
		icon: <FiCompass />,
		path: "/properties",
	},
];

const Sidebar: React.FC<SidebarProps> = ({ setSidebarOpen }) => {
	const { user } = useSelector((state: RootState) => state.auth);

	return (
		<motion.div
			initial={{ x: -300 }}
			animate={{ x: 0 }}
			exit={{ x: -300 }}
			transition={{ type: "spring", stiffness: 100, damping: 20 }}
			className="flex h-full w-full flex-col border-r border-emerald-100 bg-gradient-to-b from-white via-emerald-50 to-sky-50 shadow-sm"
		>
			<div className="flex flex-col flex-1">
				<div className="border-b border-slate-200 bg-white block">
					<NavLink to="/" className="block">
						<img
							src={siliguri_property_logo_noBG}
							alt="Logo"
							className="object-contain h-28 w-28 mx-auto"
						/>
					</NavLink>
				</div>

				<div className="mx-4 mt-4 rounded-2xl border border-emerald-100 bg-gradient-to-r from-white to-emerald-50 p-3 shadow-sm">
					<div className="flex items-center gap-3">
						{user?.avatar ? (
							<img
								className="w-11 h-11 rounded-full border border-slate-200 object-cover"
								src={user.avatar}
								alt={user.name}
							/>
						) : (
							<div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-700 font-bold text-white">
								{getInitials(user?.name ?? "")}
							</div>
						)}
						<div className="min-w-0">
							<p className="text-sm font-semibold text-slate-900 truncate">
								{formatFullName(user?.name)}
							</p>
							<p className="text-xs text-slate-500 truncate">{user?.email}</p>
						</div>
					</div>
				</div>

				<nav
					className="flex-1 overflow-y-auto p-4"
					aria-label="Dashboard navigation"
				>
					<p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-700">
						Main Menu
					</p>
					<ul className="space-y-2">
						{menuItems.map((item) => {
							return (
								<motion.li
									key={item.label}
									whileHover={{ scale: 1.02, x: 4 }}
									whileTap={{ scale: 0.98 }}
									className="rounded-xl"
								>
									<NavLink
										to={item.path}
										onClick={() => setSidebarOpen(false)}
										className={({ isActive }) =>
											`flex items-center gap-3 rounded-xl px-4 py-3 font-medium transition-all duration-200 ease-in-out ${
												isActive
													? "bg-emerald-700 text-white shadow-md"
													: "text-slate-700 hover:bg-emerald-100 hover:text-emerald-900"
											}`
										}
									>
										<span className="text-xl">{item.icon}</span>
										<span>{item.label}</span>
									</NavLink>
								</motion.li>
							);
						})}
					</ul>
				</nav>

				<div className="h-4" />
			</div>
		</motion.div>
	);
};

export default Sidebar;
