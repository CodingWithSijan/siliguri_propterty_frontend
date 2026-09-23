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
			<SidebarHeader />
			<SidebarContent className="bg-white">
				<SidebarGroup>
					<SidebarGroupLabel className="text-xs uppercase tracking-[0.12em] text-slate-500">
						Menu
					</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{items.map((item, index) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton
										asChild
										isActive={activeMenu === index}
										className="rounded-lg"
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
			<SidebarFooter>
				<AdminProfile />
			</SidebarFooter>
		</Sidebar>
	);
};

export default AppSidebar;
