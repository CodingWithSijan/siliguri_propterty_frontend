import React from "react";
import AllListings from "./AllListings";

const RentalProperties: React.FC = () => {
	return <AllListings forcedIntent="rent" title="Rental Properties" />;
};

export default RentalProperties;
