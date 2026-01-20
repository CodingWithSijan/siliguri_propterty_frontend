import React, { SetStateAction } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import { toggleTheme } from "../../app/slices/themeSlice";
// Import shadcn switch
import { Switch } from "../ui/switch";
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
	Settings,
	UserPenIcon,
	ClipboardEditIcon,
} from "lucide-react";
import AdminProfile from "./AdminProfile";

const items = [
	{ title: "Home", url: "/admin/home", icon: Home },
	{ title: "Manage Posts", url: "/admin/posts", icon: Edit },
	{ title: "Manage Users", url: "/admin/users", icon: UserPenIcon },
	{
		title: "Manage Pending Posts",
		url: "/admin/pending-posts",
		icon: ClipboardEditIcon,
	},
	{ title: "Settings", url: "/admin/settings", icon: Settings },
];
interface Props {
	activeMenu: number;
	setActiveMenu: React.Dispatch<SetStateAction<number>>;
}
const AppSidebar = ({ activeMenu, setActiveMenu }: Props) => {
	const dispatch = useDispatch<AppDispatch>();
	const theme = useSelector((state: RootState) => state.theme.mode);
	const location = useLocation();

	// Set active menu based on current route
	React.useEffect(() => {
		const idx = items.findIndex((item) => item.url === location.pathname);
		setActiveMenu(idx === -1 ? 0 : idx);
	}, [location.pathname, setActiveMenu]);
	// Initialize dark theme
	React.useEffect(() => {
		if (theme === "dark") {
			document.documentElement.classList.add("dark");
		}
	}, [theme]);

	// Toggle theme handler
	const handleThemeToggle = () => {
		dispatch(toggleTheme());
		if (theme === "light") {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	};

	return (
		<Sidebar side="left" collapsible="icon">
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem className="overflow-hidden">
						{/* Theme toggle switch at top */}
						<div className="flex items-center gap-2 px-4 py-4 border-b">
							<span className="text-sm font-medium">Light</span>
							<Switch
								checked={theme === "dark"}
								onCheckedChange={handleThemeToggle}
								className="data-[state=checked]:bg-gray-800 data-[state=unchecked]:bg-gray-200"
							/>
							<span className="text-sm font-medium">Dark</span>
						</div>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Menu</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{items.map((item, index) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild isActive={activeMenu === index}>
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
