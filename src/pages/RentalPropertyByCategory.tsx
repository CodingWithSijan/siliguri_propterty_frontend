import React from "react";
import { useParams } from "react-router-dom";
import AllListings from "./AllListings";

const RentalPropertyByCategory: React.FC = () => {
	const { category } = useParams<{ category: "house" | "flat" | "shop" }>();
	const validCategories = ["house", "flat", "shop"] as const;

	if (!category || !validCategories.includes(category)) {
		return <AllListings forcedIntent="rent" title="Rental Properties" />;
	}

	const title = `${category.charAt(0).toUpperCase()}${category.slice(1)} for Rent`;
	return (
		<AllListings forcedIntent="rent" forcedCategory={category} title={title} />
	);
};

export default RentalPropertyByCategory;
