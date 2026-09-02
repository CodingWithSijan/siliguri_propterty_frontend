import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import AppSidebar from "./AppSidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
	const [activeMenu, setActiveMenu] = useState<number>(0);
	return (
		<SidebarProvider defaultOpen={true}>
			<AppSidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
			<div className="flex min-h-screen w-full flex-col">
				<header className="sticky top-0 z-30 flex h-14 items-center border-b bg-background/95 px-3 backdrop-blur md:px-4">
					<SidebarTrigger className="h-9 w-9" />
					<h1 className="ml-2 text-sm font-semibold text-foreground md:text-base">
						Admin Dashboard
					</h1>
				</header>

				<main className="flex-1 overflow-auto p-3 md:p-4">{children}</main>
			</div>
		</SidebarProvider>
	);
}
