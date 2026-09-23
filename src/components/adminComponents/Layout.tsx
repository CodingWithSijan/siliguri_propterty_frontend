import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import AppSidebar from "./AppSidebar";
import NotificationBell from "../common/NotificationBell";
import { useLocation } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
	const [activeMenu, setActiveMenu] = useState<number>(0);
	const location = useLocation();

	const sectionMeta: Record<string, { title: string; subtitle: string }> = {
		"/admin/home": {
			title: "Overview",
			subtitle: "Track moderation throughput and account health at a glance.",
		},
		"/admin/posts": {
			title: "Post Moderation",
			subtitle:
				"Review, approve or reject posts quickly with clear status cues.",
		},
		"/admin/users": {
			title: "User Management",
			subtitle: "Manage verification, roles and support actions for all users.",
		},
		"/admin/messages": {
			title: "Messages",
			subtitle: "Respond to user conversations and keep communication moving.",
		},
		"/admin/notifications": {
			title: "Notifications",
			subtitle: "Stay updated on platform events and moderation changes.",
		},
		"/admin/super-admin": {
			title: "Super Admin",
			subtitle:
				"Perform elevated administrative tasks and permissions control.",
		},
	};

	const currentSection = sectionMeta[location.pathname] ??
		sectionMeta["/admin/home"] ?? {
			title: "Admin Dashboard",
			subtitle: "Manage content, users and operations.",
		};

	return (
		<SidebarProvider defaultOpen={true}>
			<AppSidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
			<div className="flex min-h-screen w-full flex-col bg-gradient-to-br from-slate-50 via-emerald-50/35 to-sky-50/45">
				<header className="sticky top-0 z-30 border-b border-emerald-100 bg-white/95 px-3 py-3 shadow-sm backdrop-blur md:px-4">
					<div className="flex items-start justify-between gap-3">
						<div className="flex min-w-0 items-start gap-2">
							<SidebarTrigger className="h-9 w-9 shrink-0" />
							<div className="min-w-0">
								<p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-700">
									Admin Dashboard
								</p>
								<h1 className="truncate text-base font-bold text-slate-900 md:text-lg">
									{currentSection.title}
								</h1>
								<p className="hidden text-sm text-slate-600 sm:block">
									{currentSection.subtitle}
								</p>
							</div>
						</div>
						<div className="flex items-center gap-2">
							<div className="hidden items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 md:flex">
								<ShieldCheck className="h-4 w-4 text-emerald-700" />
								<span className="text-xs font-semibold text-emerald-800">
									Moderation Console
								</span>
							</div>
							<div className="rounded-full border border-slate-200 bg-white p-1">
								<NotificationBell buttonClassName="h-9 w-9 rounded-full bg-white p-2 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700" />
							</div>
						</div>
					</div>
				</header>

				<main className="flex-1 overflow-auto p-3 md:p-4">{children}</main>
			</div>
		</SidebarProvider>
	);
}
