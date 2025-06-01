import { useEffect, useState } from "react";
import BASE_URL from "../../services";
import { showError } from "../../utils/toastUtils";

import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "../../components/ui/tabs";
import {
	// IBuyListingType,
	// IRentListingType,
	// ISellListingType,
	IUniversalListingType,
} from "../../types/listingTypes";
import ListingsAccordingToIntentType from "../../components/viewYourListingsComponent/ListingsAccordingToIntentType";

const ViewYourListings = () => {
	const [listings, setListings] = useState<
		Partial<IUniversalListingType>[] | null
	>([]);

	const [activeListings, setActiveListings] = useState<
		IUniversalListingType[] | null
	>([]);
	const [pendingListings, setPendingListings] = useState<
		IUniversalListingType[] | null
	>([]);
	const [rejectedListings, setRejectedListings] = useState<
		IUniversalListingType[] | null
	>([]);

	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		const fetchListings = async () => {
			try {
				setLoading(true);
				const response = await BASE_URL.get(
					"/api/user/post/view-your-listings"
				);
				const allPostsOrListings = response.data.postArray;
				setListings(allPostsOrListings);
				console.log(allPostsOrListings);
				setActiveListings(
					allPostsOrListings.filter(
						(item: IUniversalListingType | null) =>
							item?.approvalStatus === "approved"
					)
				);

				console.log(activeListings);
				setPendingListings(
					allPostsOrListings.filter(
						(item: IUniversalListingType | null) =>
							item?.approvalStatus === "pending"
					)
				);
				setRejectedListings(
					allPostsOrListings.filter(
						(item: IUniversalListingType | null) =>
							item?.approvalStatus === "rejected"
					)
				);
			} catch {
				showError("Failed to fetch listings");
			} finally {
				setLoading(false);
			}
		};
		fetchListings();
	}, []);

	return (
		<div className="max-w-7xl mx-auto px-4 py-10 rounded-xl">
			<h2 className="text-3xl font-bold text-center mb-8 text-gray-800 tracking-tight">
				Your Property Listings
			</h2>
			<Tabs defaultValue="allListings" className="mx-auto w-full">
				<div className="flex justify-center w-full">
					<TabsList className="flex flex-wrap justify-center gap-2 sm:gap-4 bg-gray-100 rounded-lg p-2 mb-6 w-auto">
						<TabsTrigger
							value="allListings"
							className="px-4 sm:px-6 py-2 font-semibold text-gray-700 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg transition-colors text-center"
						>
							All Listings
						</TabsTrigger>
						<TabsTrigger
							value="active"
							className="px-4 sm:px-6 py-2 font-semibold text-green-700 data-[state=active]:bg-green-600 data-[state=active]:text-white rounded-lg transition-colors text-center"
						>
							Active
						</TabsTrigger>
						<TabsTrigger
							value="pending"
							className="px-4 sm:px-6 py-2 font-semibold text-yellow-700 data-[state=active]:bg-yellow-500 data-[state=active]:text-white rounded-lg transition-colors text-center"
						>
							Pending
						</TabsTrigger>
						<TabsTrigger
							value="rejected"
							className="px-4 sm:px-6 py-2 font-semibold text-red-700 data-[state=active]:bg-red-600 data-[state=active]:text-white rounded-lg transition-colors text-center"
						>
							Rejected
						</TabsTrigger>
					</TabsList>
				</div>
				<TabsContent value="allListings">
					{loading ? (
						<div className="flex flex-col items-center justify-center py-12">
							<div className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-4"></div>
							<p className="text-lg text-gray-500">Loading your listings...</p>
						</div>
					) : (
						<ListingsAccordingToIntentType listings={listings} />
					)}
				</TabsContent>
				<TabsContent value="active">
					{loading ? (
						<div className="flex flex-col items-center justify-center py-12">
							<div className="w-10 h-10 border-4 border-green-400 border-t-transparent rounded-full animate-spin mb-4"></div>
							<p className="text-lg text-gray-500">Loading your listings...</p>
						</div>
					) : (
						<ListingsAccordingToIntentType listings={activeListings} />
					)}
				</TabsContent>
				<TabsContent value="pending">
					{loading ? (
						<div className="flex flex-col items-center justify-center py-12">
							<div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mb-4"></div>
							<p className="text-lg text-gray-500">Loading your listings...</p>
						</div>
					) : (
						<ListingsAccordingToIntentType listings={pendingListings} />
					)}
				</TabsContent>
				<TabsContent value="rejected">
					{loading ? (
						<div className="flex flex-col items-center justify-center py-12">
							<div className="w-10 h-10 border-4 border-red-400 border-t-transparent rounded-full animate-spin mb-4"></div>
							<p className="text-lg text-gray-500">Loading your listings...</p>
						</div>
					) : (
						<ListingsAccordingToIntentType listings={rejectedListings} />
					)}
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default ViewYourListings;
