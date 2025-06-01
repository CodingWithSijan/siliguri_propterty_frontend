import React from "react";
import { Home, Store, TreePalm, Building2, DoorOpen } from "lucide-react";

const PropertyIconHelper: React.FC<{
	propertyCategory: string;
	className: string;
}> = ({ propertyCategory, className }) => {
	const renderIcon = () => {
		switch (propertyCategory) {
			case "land":
				return <TreePalm className={className} />;

			case "shop":
				return <Store className={className} />;

			case "apartment":
				return <Building2 className={className} />;

			case "house":
				return <Home className={className} />;

			case "room":
				return <DoorOpen className={className} />;

			default:
				break;
		}
	};

	return <>{renderIcon()}</>;
};

export default PropertyIconHelper;
