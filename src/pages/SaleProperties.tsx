import React from "react";
import AllListings from "./AllListings";

const SellProperties: React.FC = () => {
	return <AllListings forcedIntent="sell" title="Properties for Sale" />;
};

export default SellProperties;
