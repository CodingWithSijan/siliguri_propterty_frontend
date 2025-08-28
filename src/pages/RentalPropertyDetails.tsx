import React from "react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { IRentListingType } from "../types/listingTypes";
import BASE_URL from "../services";
import { ClipLoader } from "react-spinners";
import { IListingUserDetails } from "../types/listingUserDetails";
import Navbar from "../components/header_and_footer/Navbar";
import House from "../components/property_details_page/rent/common/House";
import ShopRental from "../components/property_details_page/rent/shop/ShopRental";

const loaderStyle: React.CSSProperties = {
	display: "block",
	margin: "40px auto",
	borderColor: "#2563eb",
};

const RentalPropertyDetails: React.FC = () => {
	const { id } = useParams();
	const [listing, setListing] = useState<IRentListingType | null>(null);
	const [listingUserDetails, setListingUserDetails] =
		useState<IListingUserDetails | null>(null);

	useEffect(() => {
		const fetchListing = async () => {
			try {
				const res = await BASE_URL.get(`/api/user/post/listingDetails/${id}`);
				setListing(res.data.listingDetails);
				setListingUserDetails(res.data.listingUser);
				console.log("listing:", res.data.listingDetails);
				console.log("user:", res.data.listingUser);
			} catch (error) {
				console.error("Failed to fetch listing", error);
			}
		};

		if (id) fetchListing();
	}, [id]);

	if (!listing)
		return (
			<div className="flex justify-center items-center min-h-[200px]">
				<ClipLoader
					cssOverride={loaderStyle}
					size={80}
					color={"#2563eb"}
					aria-label="Loading Spinner"
					data-testid="loader"
				/>
			</div>
		);
	const renderPropertyCategory = () => {
		switch (listing.propertyCategory) {
			case "house":
				return <House listing={listing} userDetails={listingUserDetails} />;
			case "flat":
				return <House listing={listing} userDetails={listingUserDetails} />;
			case "shop":
				return (
					<ShopRental listing={listing} userDetails={listingUserDetails} />
				);
			default:
				return <div>Unknown property type</div>;
		}
	};
	return (
		<>
			<Navbar />
			<div className="flex justify-center items-center my-10">
				{renderPropertyCategory()}
			</div>
		</>
	);
};

export default RentalPropertyDetails;
