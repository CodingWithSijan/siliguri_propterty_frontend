import React, { SetStateAction } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { Link, useLocation } from "react-router-dom";
// Import shadcn sidebar components (adjust path as needed)
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuButton,
	SidebarFooter,
	SidebarHeader,
} from "../ui/sidebar";
import {
	Home,
	Edit,
	UserPenIcon,
	ChartNoAxesCombined,
	MessageSquare,
	Bell,
	UserCog,
	Shield,
} from "lucide-react";
import AdminProfile from "./AdminProfile";

const BASE_ITEMS = [
	{ title: "Overview", url: "/admin/home", icon: ChartNoAxesCombined },
	{ title: "Post Moderation", url: "/admin/posts", icon: Edit },
	{ title: "User Management", url: "/admin/users", icon: UserPenIcon },
	{ title: "Messages", url: "/admin/messages", icon: MessageSquare },
	{ title: "Notifications", url: "/admin/notifications", icon: Bell },
	{ title: "Back To Site", url: "/", icon: Home },
];
interface Props {
	activeMenu: number;
	setActiveMenu: React.Dispatch<SetStateAction<number>>;
}
const AppSidebar = ({ activeMenu, setActiveMenu }: Props) => {
	const currentUser = useSelector((state: RootState) => state.auth.user);
	const location = useLocation();
	const isSuperAdmin = currentUser?.role === "superadmin";
	const items = React.useMemo(
		() =>
			isSuperAdmin
				? [
						...BASE_ITEMS.slice(0, 3),
						{ title: "Super Admin", url: "/admin/super-admin", icon: UserCog },
						...BASE_ITEMS.slice(3),
					]
				: BASE_ITEMS,
		[isSuperAdmin],
	);

	// Set active menu based on current route
	React.useEffect(() => {
		const idx = items.findIndex((item) => item.url === location.pathname);
		setActiveMenu(idx === -1 ? 0 : idx);
	}, [items, location.pathname, setActiveMenu]);
	return (
		<Sidebar side="left" collapsible="icon">
			<SidebarHeader className="border-b border-emerald-100 bg-gradient-to-r from-emerald-700 to-emerald-600 text-white">
				<div className="flex items-center gap-2 px-2 py-1">
					<div className="rounded-md bg-white/20 p-1.5">
						<Shield className="h-4 w-4" />
					</div>
					<div>
						<p className="text-[11px] uppercase tracking-[0.12em] text-emerald-100">
							SiliguriProperty
						</p>
						<p className="text-sm font-semibold">Admin Panel</p>
					</div>
				</div>
			</SidebarHeader>
			<SidebarContent className="bg-gradient-to-b from-white via-emerald-50/25 to-sky-50/30">
				<SidebarGroup>
					<SidebarGroupLabel className="text-xs uppercase tracking-[0.12em] text-emerald-700">
						Menu
					</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{items.map((item, index) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton
										asChild
										isActive={activeMenu === index}
										className="rounded-lg text-slate-700 hover:bg-emerald-100/70 hover:text-emerald-900 data-[active=true]:bg-emerald-700 data-[active=true]:text-white data-[active=true]:shadow-sm"
									>
										<Link to={item.url}>
											<item.icon />
											<span>{item.title}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter className="border-t border-emerald-100 bg-white">
				<AdminProfile />
			</SidebarFooter>
		</Sidebar>
	);
};

export default AppSidebar;
