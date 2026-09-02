import React from "react";
import { useParams } from "react-router-dom";
import AllListings from "./AllListings";

const SellPropertyByCategory: React.FC = () => {
	const { category } = useParams<{
		category: "house" | "flat" | "shop" | "land";
	}>();
	const validCategories = ["house", "flat", "shop", "land"] as const;

	if (!category || !validCategories.includes(category)) {
		return <AllListings forcedIntent="sell" title="Properties for Sale" />;
	}

	const title = `${category.charAt(0).toUpperCase()}${category.slice(1)} for Sale`;
	return (
		<AllListings forcedIntent="sell" forcedCategory={category} title={title} />
	);
};

export default SellPropertyByCategory;
