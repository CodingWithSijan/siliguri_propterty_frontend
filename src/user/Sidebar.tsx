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
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../app/store";
import siliguri_property_logo_noBG from "../assets/logo_siliguri_property.png";
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
import { logout } from "../app/slices/authSlice";
interface SidebarProps {
	activeMenu: string;
	setActiveMenu: (menu: string) => void;
	setSidebarOpen: (open: boolean) => void;
}

const menuItems = [
	{
		label: "Your Profile",
		icon: <FiUser />,
		path: "/dashboard/your-profile",
	},
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
	const dispatch = useDispatch<AppDispatch>();
	const { user } = useSelector((state: RootState) => state.auth);

	return (
		<motion.div
			initial={{ x: -300 }}
			animate={{ x: 0 }}
			exit={{ x: -300 }}
			transition={{ type: "spring", stiffness: 100, damping: 20 }}
			className=" h-full w-full flex flex-col  border-r border-gray-200 shadow-sm bg-gray-100"
		>
			<div className="flex flex-col flex-1">
				<div className="border-b border-border bg-background/50 block">
					<NavLink to="/" className="block">
						<img
							src={siliguri_property_logo_noBG}
							alt="Logo"
							className="object-contain h-30 w-30 mx-auto"
						/>
					</NavLink>
				</div>
				{/* user profile and name display */}
				<DropdownMenu>
					<DropdownMenuTrigger>
						{" "}
						<div className="flex items-center space-x-3 p-4 border-y border-border bg-muted/30 hover:bg-muted/50 transition-all cursor-pointer">
							{user?.avatar ? (
								<img
									className="w-10 h-10 rounded-full border-2 border-primary shadow-sm"
									src={user.avatar}
									alt={user.name}
								/>
							) : (
								<div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shadow-sm">
									{getInitials(user?.name ?? "")}
								</div>
							)}
							<span className="text-foreground font-semibold text-sm">
								{formatFullName(user?.name)}
							</span>
						</div>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="w-[250px]">
						<DropdownMenuLabel>My Account</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem>
							<div className="p-2 border-t border-border">
								<motion.button
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
									className="w-full flex items-center gap-3 text-destructive hover:bg-destructive/10 rounded-lg transition-all duration-200 p-2"
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

				{/* user profile and name display */}
				<nav className="flex-1 p-4 overflow-y-auto">
					<ul className="space-y-2">
						{menuItems.map((item) => {
							const isActive = location.pathname === item.path;
							return (
								<motion.li
									key={item.label}
									whileHover={{ scale: 1.02, x: 4 }}
									whileTap={{ scale: 0.98 }}
									className={`
                                        flex items-center gap-3 px-4 py-3.5 rounded-xl cursor-pointer
                                        transition-all duration-200 ease-in-out font-medium
                                        ${
																					isActive
																						? "bg-primary text-primary-foreground shadow-md"
																						: "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
																				}
                                    `}
									onClick={() => {
										setActiveMenu(item.label);
										setSidebarOpen(false);
										navigate(item.path);
									}}
								>
									<span className="text-xl">{item.icon}</span>
									<span>{item.label}</span>
								</motion.li>
							);
						})}
					</ul>
				</nav>
			</div>
		</motion.div>
	);
};

export default Sidebar;
