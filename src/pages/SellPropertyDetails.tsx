import React from "react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ISellListingType } from "../types/listingTypes";
import BASE_URL from "../services";
import { ClipLoader } from "react-spinners";
import { IListingUserDetails } from "../types/listingUserDetails";
import Navbar from "../components/header_and_footer/Navbar";
import SellHouse from "../components/property_details_page/sell/common/House";

const loaderStyle: React.CSSProperties = {
	display: "block",
	margin: "40px auto",
	borderColor: "#2563eb",
};

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
				console.log("listing:", res.data.listingDetails);
				console.log("user:", res.data.listingUser);
			} catch (error) {
				console.error("Failed to fetch listing:", error);
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
				<div className="flex justify-center items-center min-h-[400px]">
					<ClipLoader
						cssOverride={loaderStyle}
						size={80}
						color={"#2563eb"}
						aria-label="Loading Spinner"
						data-testid="loader"
					/>
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
						<h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
						<p className="text-gray-600 mb-4">{error}</p>
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

	return (
		<>
			<Navbar />
			<div className="min-h-screen bg-gray-50 py-8">
				<div className="container mx-auto px-4">
					<SellHouse listing={listing} userDetails={listingUserDetails} />
				</div>
			</div>
		</>
	);
};

export default SellPropertyDetails;
