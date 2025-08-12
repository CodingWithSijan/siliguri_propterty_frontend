import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import AppSidebar from "./AppSidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
	const [activeMenu, setActiveMenu] = useState<number>(0);
	return (
		<SidebarProvider>
			<AppSidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
			<SidebarTrigger />
			<main className="flex justify-center items-center max-w-[800px] min-w-[78vw]">
				{children}
			</main>
		</SidebarProvider>
	);
}
