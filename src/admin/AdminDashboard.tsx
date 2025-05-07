import React, { useState } from "react";
import { useAuth } from "../contextAPI/UserAuthContext";
import {
	HomeIcon,
	ArrowPathIcon,
	DocumentTextIcon,
	Squares2X2Icon,
	UsersIcon,
} from "@heroicons/react/24/outline";

import logo from "../../public/logo_siliguri_property.png";
import { Divider } from "@tremor/react";
const AdminDashboard: React.FC = () => {
	const [activeMenu, setActiveMenu] = useState<string>("My Profile");
	const { user } = useAuth();
	return (
		<div className="min-h-screen bg-[#fcf4f4] text-black font-mono">
			<aside className="w-64 bg-white h-screen flex flex-col">
				<div className="flex justify-center ">
					<img
						src={logo}
						alt="Logo"
						className="rounded-full  w-[100px] h-[80px]"
					/>
				</div>
				<Divider>ADMIN PANEL</Divider>
				<ul className="flex flex-col justify-between items-start font-mono">
					<div className="flex justify-between gap-2 items-center cursor-pointer p-4 ml-2 ">
						<HomeIcon className="text-gray-600 w-5 h-5 " />
						<li className="text-xl text-gray-600">Dashboard</li>
					</div>
					<div className="flex justify-between gap-2 items-center cursor-pointer p-4 ml-2">
						<ArrowPathIcon className="w-5 h-5 text-gray-600" />
						<li className=" text-xl text-gray-600">Pending Posts</li>
					</div>
					<div className="flex justify-between gap-2 items-center cursor-pointer p-4 ml-2">
						<DocumentTextIcon className="text-gray-600 w-5 h-5" />
						<li className="text-gray-600 text-xl">Active Posts</li>
					</div>
					<div className="flex justify-between gap-2 items-center cursor-pointer p-4 ml-2">
						<Squares2X2Icon className="text-gray-600 w-5 h-5 " />
						<li className="text-gray-600 text-xl">Manage Posts</li>
					</div>
					<div className="flex justify-between gap-2 items-center cursor-pointer p-4 ml-2">
						<UsersIcon className="text-gray-600 w-5 h-5 " />
						<li className="text-gray-600 text-xl">Manage Users</li>
					</div>
				</ul>
			</aside>
		</div>
	);
};

export default AdminDashboard;
