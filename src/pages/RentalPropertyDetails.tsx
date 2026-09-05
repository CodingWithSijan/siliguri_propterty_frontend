import React from "react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { IRentListingType } from "../types/listingTypes";
import BASE_URL from "../services";
import { IListingUserDetails } from "../types/listingUserDetails";
import Navbar from "../components/header_and_footer/Navbar";
import Footer from "../components/header_and_footer/Footer";
import HouseRent from "../components/property_details_page/rent/common/HouseRent";
import ShopRental from "../components/property_details_page/rent/shop/ShopRental";
import Breadcrumb from "../lib/Breadcrumb";

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
			} catch (error) {
				console.error("Failed to fetch listing", error);
			}
		};

		if (id) fetchListing();
	}, [id]);

	// Generate breadcrumb items
	const getBreadcrumbItems = () => {
		if (!listing) return [];

		const propertyTypeLabel =
			listing.propertyCategory.charAt(0).toUpperCase() +
			listing.propertyCategory.slice(1);

		return [
			{ label: "For Rent", path: "/rentals" },
			{
				label: propertyTypeLabel,
				path: `/rentals/${listing.propertyCategory}`,
			},
			{
				label: listing.title.slice(0, 25) + "...",
				path: `/rentals/${listing.propertyCategory}/${id}`,
			},
		];
	};

	if (!listing)
		return (
			<>
				<Navbar />
				<div className="bg-slate-50 min-h-screen">
					<div className="max-w-7xl mx-auto px-4 py-12">
						<div className="space-y-4 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200/50">
							<div className="h-8 bg-gray-200 rounded w-2/5 animate-pulse"></div>
							<div className="h-56 bg-gray-200 rounded animate-pulse"></div>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="space-y-3">
									<div className="h-6 bg-gray-200 rounded animate-pulse"></div>
									<div className="h-6 bg-gray-200 rounded animate-pulse w-4/5"></div>
								</div>
								<div className="space-y-3">
									<div className="h-6 bg-gray-200 rounded animate-pulse"></div>
									<div className="h-6 bg-gray-200 rounded animate-pulse w-3/4"></div>
								</div>
							</div>
						</div>
					</div>
					<Footer />
				</div>
			</>
		);
	const renderPropertyCategory = () => {
		switch (listing.propertyCategory) {
			case "house":
				return <HouseRent listing={listing} userDetails={listingUserDetails} />;
			case "flat":
				return <HouseRent listing={listing} userDetails={listingUserDetails} />;
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
			<div className="bg-slate-50 min-h-screen">
				<Breadcrumb items={getBreadcrumbItems()} />
				<div className="max-w-7xl mx-auto px-4 py-10">
					<div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200/50">
						{renderPropertyCategory()}
					</div>
				</div>
				<Footer />
			</div>
		</>
	);
};

export default RentalPropertyDetails;
