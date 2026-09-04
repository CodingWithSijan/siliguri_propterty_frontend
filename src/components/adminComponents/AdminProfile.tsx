import { useSelector, useDispatch } from "react-redux";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from "../../components/ui/dropdown-menu";
import { formatFullName } from "../../utils/capitalizeName";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import { ChevronUp, LogOut } from "lucide-react";
import { RootState, AppDispatch } from "../../app/store";
import { logout } from "../../app/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { getInitials } from "../../utils/getInitial";

const AdminProfile = () => {
	const user = useSelector((state: RootState) => state.auth.user);
	const dispatch = useDispatch<AppDispatch>();
	const navigate = useNavigate();

	const handleSignOut = () => {
		dispatch(logout());
		navigate("/login");
	};

	return (
		<div>
			<SidebarMenu>
				<SidebarMenuItem>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<SidebarMenuButton>
								{user?.avatar ? (
									<img
										src={user.avatar}
										alt={user.name}
										className="w-7 h-7 rounded-full object-cover"
									/>
								) : (
									<div className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
										{getInitials(user?.name ?? "")}
									</div>
								)}
								{formatFullName(user?.name)}
								<ChevronUp className="ml-auto" />
							</SidebarMenuButton>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							side="top"
							className="w-[--radix-popper-anchor-width] p-0"
						>
							<DropdownMenuItem asChild>
								<div
									onClick={handleSignOut}
									className="w-full px-2 py-2 bg-gray-200 hover:bg-red-200 cursor-pointer rounded flex items-center gap-2"
								>
									<LogOut className="size-4" />
									<span>Sign out</span>
								</div>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</SidebarMenuItem>
			</SidebarMenu>
		</div>
	);
};

export default AdminProfile;
