import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import AppSidebar from "./AppSidebar";
import NotificationBell from "../common/NotificationBell";

export default function Layout({ children }: { children: React.ReactNode }) {
	const [activeMenu, setActiveMenu] = useState<number>(0);
	return (
		<SidebarProvider defaultOpen={true}>
			<AppSidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
			<div className="flex min-h-screen w-full flex-col bg-slate-50 dark:bg-slate-950">
				<header className="sticky top-0 z-30 flex h-16 items-center border-b border-slate-200 bg-white/95 px-3 shadow-sm backdrop-blur md:px-4 dark:border-slate-800 dark:bg-slate-900/95">
					<SidebarTrigger className="h-9 w-9" />
					<h1 className="ml-2 text-sm font-semibold text-slate-800 dark:text-slate-100 md:text-base">
						Admin Dashboard
					</h1>
					<div className="ml-auto rounded-full border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-900">
						<NotificationBell buttonClassName="h-9 w-9 rounded-full bg-white p-2 text-slate-700 hover:bg-sky-50 hover:text-sky-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-slate-100" />
					</div>
				</header>

				<main className="flex-1 overflow-auto p-3 md:p-4">{children}</main>
			</div>
		</SidebarProvider>
	);
}
