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
							<SidebarMenuButton className="rounded-lg border border-emerald-100 bg-white text-slate-700 hover:bg-emerald-50 hover:text-emerald-800">
								{user?.avatar ? (
									<img
										src={user.avatar}
										alt={user.name}
										className="w-7 h-7 rounded-full object-cover"
									/>
								) : (
									<div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-700 text-xs font-bold text-white">
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
									className="flex w-full cursor-pointer items-center gap-2 rounded px-2 py-2 text-slate-700 hover:bg-rose-50 hover:text-rose-700"
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
