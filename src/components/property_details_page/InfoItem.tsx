import React from "react";

type Variant = "primary" | "secondary" | "success" | "danger";

interface InfoItemProps {
	icon: React.ReactNode;
	label: string;
	value: string | number | undefined | null | "";
	variant?: Variant;
}

const getVariantClasses = (variant: Variant) => {
	switch (variant) {
		case "primary":
			return { bg: "bg-blue-50/80", border: "border-blue-200/60" };
		case "success":
			return { bg: "bg-emerald-50/80", border: "border-emerald-200/60" };
		case "danger":
			return { bg: "bg-red-50/80", border: "border-red-200/60" };
		default:
			return { bg: "bg-gray-50/80", border: "border-gray-200/60" };
	}
};

const InfoItem: React.FC<InfoItemProps> = ({
	icon,
	label,
	value,
	variant = "secondary",
}) => {
	const variantClasses = getVariantClasses(variant);

	return (
		<div
			className={`group flex items-center gap-4 p-4 ${variantClasses.bg} border ${variantClasses.border} shadow-sm`}
		>
			<div className="flex-shrink-0 w-11 h-11 flex items-center justify-center bg-white shadow-sm">
				{icon}
			</div>
			<div className="min-w-0 flex-1">
				<span className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
					{label}
				</span>
				<span
					className="font-semibold text-gray-900 text-sm sm:text-base truncate block"
					title={String(value)}
				>
					{value || "-"}
				</span>
			</div>
		</div>
	);
};

export default InfoItem;
