import React from "react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ISellListingType } from "../types/listingTypes";
import BASE_URL from "../services";
import { IListingUserDetails } from "../types/listingUserDetails";
import Navbar from "../components/header_and_footer/Navbar";
import HouseSell from "../components/property_details_page/sell/common/HouseSell";
import ShopSell from "../components/property_details_page/sell/shop/ShopSell";
import LandSell from "../components/property_details_page/sell/land/LandSell";

const SellPropertyDetails: React.FC = () => {
	const { id } = useParams();
	const [listing, setListing] = useState<ISellListingType | null>(null);
	const [listingUserDetails, setListingUserDetails] =
		useState<IListingUserDetails | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchListing = async () => {
			try {
				setLoading(true);
				setError(null);
				const res = await BASE_URL.get(`/api/user/post/listingDetails/${id}`);
				setListing(res.data.listingDetails);
				setListingUserDetails(res.data.listingUser);
			} catch {
				console.error("Failed to fetch listing");
				setError("Failed to fetch listing details. Please try again.");
			} finally {
				setLoading(false);
			}
		};

		if (id) fetchListing();
	}, [id]);

	if (loading) {
		return (
			<>
				<Navbar />
				<div className="container mx-auto px-4 py-12">
					<div className="space-y-4">
						<div className="h-8 bg-gray-200 rounded w-3/5 animate-pulse"></div>
						<div className="h-64 bg-gray-200 rounded animate-pulse"></div>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-3">
								<div className="h-6 bg-gray-200 rounded animate-pulse"></div>
								<div className="h-6 bg-gray-200 rounded animate-pulse w-4/5"></div>
								<div className="h-6 bg-gray-200 rounded animate-pulse w-2/5"></div>
							</div>
							<div className="space-y-3">
								<div className="h-6 bg-gray-200 rounded animate-pulse"></div>
								<div className="h-6 bg-gray-200 rounded animate-pulse w-3/4"></div>
								<div className="h-6 bg-gray-200 rounded animate-pulse w-1/2"></div>
							</div>
						</div>
					</div>
				</div>
			</>
		);
	}

	if (error) {
		return (
			<>
				<Navbar />
				<div className="flex justify-center items-center min-h-[400px]">
					<div className="text-center">
						<button
							onClick={() => window.location.reload()}
							className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
						>
							Try Again
						</button>
					</div>
				</div>
			</>
		);
	}

	if (!listing) {
		return (
			<>
				<Navbar />
				<div className="flex justify-center items-center min-h-[400px]">
					<div className="text-center">
						<h2 className="text-2xl font-bold text-gray-900 mb-4">Not Found</h2>
						<p className="text-gray-600">
							This property listing was not found.
						</p>
					</div>
				</div>
			</>
		);
	}
	const renderPropertyCategory = () => {
		switch (listing.propertyCategory) {
			case "house":
				return <HouseSell listing={listing} userDetails={listingUserDetails} />;
			case "flat":
				return <HouseSell listing={listing} userDetails={listingUserDetails} />;
			case "land":
				return <LandSell listing={listing} userDetails={listingUserDetails} />;
			case "shop":
				return <ShopSell listing={listing} userDetails={listingUserDetails} />;
			default:
				return <div>Unknown property type</div>;
		}
	};
	return (
		<>
			<Navbar />

			<div className="flex justify-center items-center">
				{renderPropertyCategory()}
			</div>
		</>
	);
};

export default SellPropertyDetails;
