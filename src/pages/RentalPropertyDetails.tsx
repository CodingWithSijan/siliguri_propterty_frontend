import React from "react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { IRentListingType } from "../types/listingTypes";
import BASE_URL from "../services";
import { IListingUserDetails } from "../types/listingUserDetails";
import Navbar from "../components/header_and_footer/Navbar";
import Breadcrumb from "../lib/Breadcrumb";
import ProfessionalListingDetails from "../components/property_details_page/ProfessionalListingDetails";

const RentalPropertyDetails: React.FC = () => {
	const { id } = useParams();
	const [listing, setListing] = useState<IRentListingType | null>(null);
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

	if (loading)
		return (
			<>
				<Navbar />
				<div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
					<div className="animate-pulse rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
						<div className="mb-4 h-5 w-28 rounded-full bg-slate-200" />
						<div className="h-10 w-4/5 rounded bg-slate-200" />
						<div className="mt-3 h-5 w-3/5 rounded bg-slate-200" />
						<div className="mt-6 h-72 rounded-2xl bg-slate-200 sm:h-96" />
						<div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
							<div className="h-24 rounded-2xl bg-slate-200" />
							<div className="h-24 rounded-2xl bg-slate-200" />
						</div>
					</div>
				</div>
			</>
		);

	if (error) {
		return (
			<>
				<Navbar />
				<div className="flex min-h-[420px] items-center justify-center px-4">
					<div className="w-full max-w-md rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center shadow-sm">
						<h2 className="text-xl font-semibold text-rose-800">
							Unable to load property details
						</h2>
						<p className="mt-2 text-sm text-rose-700">{error}</p>
						<button
							onClick={() => window.location.reload()}
							className="mt-4 rounded-lg bg-rose-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-800"
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
				<div className="flex min-h-[420px] items-center justify-center px-4">
					<div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
						<h2 className="mb-2 text-2xl font-bold text-slate-900">
							Not Found
						</h2>
						<p className="text-slate-600">
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
			<Breadcrumb items={getBreadcrumbItems()} />
			<ProfessionalListingDetails
				listing={listing}
				listingUserDetails={listingUserDetails}
			/>
		</>
	);
};

export default RentalPropertyDetails;
