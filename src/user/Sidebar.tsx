import React from "react";

interface SidebarProps {
	activeMenu: string;
	setActiveMenu: (menu: string) => void;
}

const menuItems = [
	"Your Profile",
	"New Post",
	"View Your Listings",
	"Promote Your listings",
	"Messages",
];

const Sidebar: React.FC<SidebarProps> = ({ activeMenu, setActiveMenu }) => {
	return (
		<div>
			<h2 className="text-xl font-semibold mb-6">Dashboard</h2>
			<ul className="space-y-3">
				{menuItems.map((item) => (
					<li
						key={item}
						className={`cursor-pointer px-4 py-2 rounded-md hover:bg-blue-100 transition ${
							activeMenu === item ? "bg-blue-500 text-white" : "text-gray-700"
						}`}
						onClick={() => setActiveMenu(item)}
					>
						{item}
					</li>
				))}
			</ul>
		</div>
	);
};

export default Sidebar;
