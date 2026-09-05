import React from "react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ISellListingType } from "../types/listingTypes";
import BASE_URL from "../services";
import { IListingUserDetails } from "../types/listingUserDetails";
import Navbar from "../components/header_and_footer/Navbar";
import Footer from "../components/header_and_footer/Footer";
import HouseSell from "../components/property_details_page/sell/common/HouseSell";
import ShopSell from "../components/property_details_page/sell/shop/ShopSell";
import LandSell from "../components/property_details_page/sell/land/LandSell";
import Breadcrumb from "../lib/Breadcrumb";

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
				setError("Failed to fetch listing details. Please try again.");
			} finally {
				setLoading(false);
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
			{ label: "For Sale", path: "/buys" },
			{
				label: propertyTypeLabel,
				path: `/buys/${listing.propertyCategory}`,
			},
			{
				label: listing.title.slice(0, 25) + "...",
				path: `/buys/${listing.propertyCategory}/${id}`,
			},
		];
	};

	if (loading) {
		return (
			<>
				<Navbar />
				<div className="bg-slate-50 min-h-screen">
					<div className="max-w-7xl mx-auto px-4 py-12">
						<div className="space-y-4 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200/50">
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
					<Footer />
				</div>
			</>
		);
	}

	if (error) {
		return (
			<>
				<Navbar />
				<div className="bg-slate-50 min-h-screen">
					<div className="max-w-7xl mx-auto px-4 py-12">
						<div className="flex justify-center items-center rounded-[2rem] border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200/50 min-h-[360px]">
							<div className="text-center">
								<p className="mb-4 text-lg text-slate-700">
									Failed to load listing details.
								</p>
								<button
									onClick={() => window.location.reload()}
									className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
								>
									Try Again
								</button>
							</div>
						</div>
					</div>
					<Footer />
				</div>
			</>
		);
	}

	if (!listing) {
		return (
			<>
				<Navbar />
				<div className="bg-slate-50 min-h-screen">
					<div className="max-w-7xl mx-auto px-4 py-12">
						<div className="flex justify-center items-center rounded-[2rem] border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200/50 min-h-[360px]">
							<div className="text-center">
								<h2 className="text-2xl font-bold text-slate-900 mb-4">
									Not Found
								</h2>
								<p className="text-slate-600">
									This property listing was not found.
								</p>
							</div>
						</div>
					</div>
					<Footer />
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

export default SellPropertyDetails;
