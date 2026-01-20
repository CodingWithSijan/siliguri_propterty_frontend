import { useEffect, useState, useCallback, useMemo } from "react";
import { showError } from "../../utils/toastUtils";
import { IUniversalListingType } from "../../types/listingTypes";
import ListingsAccordingToIntentType from "../../components/viewYourListingsComponent/ListingsAccordingToIntentType";
import { useListings } from "../../hooks/useListings";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../../components/ui/select";

type ListingStatus = "all" | "active" | "pending" | "rejected";

interface TabConfig {
	value: ListingStatus;
	label: string;
	colorClass: string;
	spinnerColor: string;
}

interface FilteredListings {
	all: IUniversalListingType[];
	active: IUniversalListingType[];
	pending: IUniversalListingType[];
	rejected: IUniversalListingType[];
}

const TAB_CONFIG: TabConfig[] = [
	{
		value: "all",
		label: "All Listings",
		colorClass: "blue",
		spinnerColor: "blue-400",
	},
	{
		value: "active",
		label: "Active",
		colorClass: "green",
		spinnerColor: "green-400",
	},
	{
		value: "pending",
		label: "Pending",
		colorClass: "yellow",
		spinnerColor: "yellow-400",
	},
	{
		value: "rejected",
		label: "Rejected",
		colorClass: "red",
		spinnerColor: "red-400",
	},
];

const ViewYourListings = () => {
	const { listings, loading, error, refetch } = useListings();
	const [activeTab, setActiveTab] = useState<ListingStatus>("all");

	// Handle errors
	useEffect(() => {
		if (error) {
			showError(error);
		}
	}, [error]);

	// Memoized filtered listings for better performance
	const filteredListings = useMemo((): FilteredListings => {
		const defaultFilters: FilteredListings = {
			all: [],
			active: [],
			pending: [],
			rejected: [],
		};

		if (!listings) return defaultFilters;

		return {
			active: listings.filter((item) => item?.approvalStatus === "approved"),
			pending: listings.filter((item) => item?.approvalStatus === "pending"),
			rejected: listings.filter((item) => item?.approvalStatus === "rejected"),
			all: listings,
		};
	}, [listings]);

	const handleRefresh = useCallback(async (): Promise<void> => {
		await refetch();
	}, [refetch]);

	const getListingsForTab = useCallback(
		(tab: ListingStatus): IUniversalListingType[] => {
			return filteredListings[tab] || [];
		},
		[filteredListings]
	);

	const currentTabConfig = TAB_CONFIG.find((tab) => tab.value === activeTab);
	const currentListings = getListingsForTab(activeTab);

	return (
		<div className="max-w-7xl mx-auto px-4 py-10 rounded-xl">
			<header className="mb-8">
				<h1 className="text-3xl font-bold text-center text-gray-800 tracking-tight">
					Your Property Listings
				</h1>
				<p className="text-center text-gray-600 mt-2">
					Manage and track all your property listings
				</p>
			</header>

			{/* Filter Dropdown */}
			<div className="flex justify-center mb-8">
				<div className="w-full max-w-xs">
					<Select
						value={activeTab}
						onValueChange={(value) => setActiveTab(value as ListingStatus)}
					>
						<SelectTrigger className="w-full h-11 text-base font-semibold border-2 border-gray-300 hover:border-gray-400 transition-colors rounded-lg shadow-sm">
							<SelectValue />
						</SelectTrigger>

						<SelectContent className="w-full">
							{TAB_CONFIG.map((tab) => (
								<SelectItem
									key={tab.value}
									value={tab.value}
									className="text-base cursor-pointer"
								>
									<div className="flex items-center justify-between gap-4 w-full">
										<span className="font-medium">{tab.label}</span>
										{tab.value !== "all" && (
											<span className="text-xs font-bold bg-gray-200 text-gray-700 px-3 py-1 rounded-full whitespace-nowrap">
												{getListingsForTab(tab.value).length}
											</span>
										)}
									</div>
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>

			{/* Content Area */}
			<div className="mt-8">
				{loading ? (
					<LoadingSpinner
						color={currentTabConfig?.spinnerColor || "blue-400"}
						message="Loading your listings..."
					/>
				) : currentListings.length === 0 ? (
					<EmptyState status={activeTab} />
				) : (
					<ListingsAccordingToIntentType
						listings={currentListings}
						onRefresh={handleRefresh}
					/>
				)}
			</div>
		</div>
	);
};

// Reusable empty state component
const EmptyState = ({ status }: { status: ListingStatus }) => {
	const messages: Record<ListingStatus, string> = {
		all: "You don't have any listings yet. Start creating one!",
		active: "You don't have any active listings.",
		pending: "You don't have any pending listings.",
		rejected: "You don't have any rejected listings.",
	};

	return (
		<div className="flex flex-col items-center justify-center py-12 text-center">
			<p className="text-lg text-gray-500">{messages[status]}</p>
		</div>
	);
};

export default ViewYourListings;
