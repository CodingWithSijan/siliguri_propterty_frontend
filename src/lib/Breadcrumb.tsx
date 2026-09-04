import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
	label: string;
	path: string;
}

interface BreadcrumbProps {
	items?: BreadcrumbItem[];
}

const segmentToLabel = (segment: string): string => {
	const map: Record<string, string> = {
		properties: "Properties",
		rentals: "For Rent",
		buys: "For Sale",
		about: "About Us",
		privacy: "Privacy Policy",
		terms: "Terms",
		admin: "Admin",
		dashboard: "Dashboard",
	};

	if (map[segment]) {
		return map[segment];
	}

	return segment
		.split("-")
		.map((token) => `${token.charAt(0).toUpperCase()}${token.slice(1)}`)
		.join(" ");
};

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
	const location = useLocation();

	const autoItems: BreadcrumbItem[] = React.useMemo(() => {
		const segments = location.pathname.split("/").filter(Boolean);
		let runningPath = "";

		return segments.map((segment) => {
			runningPath += `/${segment}`;
			return {
				label: segmentToLabel(segment),
				path: runningPath,
			};
		});
	}, [location.pathname]);

	const breadcrumbItems = items && items.length > 0 ? items : autoItems;

	return (
		<nav
			aria-label="Breadcrumb"
			className="bg-white/90 border-b border-slate-200 py-3 px-4 md:px-6 backdrop-blur-sm"
		>
			<div className="max-w-7xl mx-auto">
				<ol className="flex flex-wrap items-center space-x-2 text-sm">
					<li>
						<Link
							to="/"
							className="flex items-center text-slate-600 hover:text-slate-900 transition-colors"
						>
							<Home className="w-4 h-4" />
						</Link>
					</li>

					{breadcrumbItems.map((item, index) => (
						<li key={index} className="flex items-center">
							<ChevronRight className="w-4 h-4 text-slate-400 mx-1" />
							{index === breadcrumbItems.length - 1 ? (
								<span className="text-slate-900 font-medium">{item.label}</span>
							) : (
								<Link
									to={item.path}
									className="text-slate-600 hover:text-slate-900 transition-colors"
								>
									{item.label}
								</Link>
							)}
						</li>
					))}
				</ol>
			</div>
		</nav>
	);
};

export default Breadcrumb;
