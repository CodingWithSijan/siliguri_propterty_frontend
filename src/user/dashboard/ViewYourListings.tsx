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

type ListingStatus = "all" | "active" | "pending" | "rejected" | "sold";

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
	sold: IUniversalListingType[];
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
	{
		value: "sold",
		label: "Sold",
		colorClass: "slate",
		spinnerColor: "slate-400",
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
			sold: [],
		};

		if (!listings) return defaultFilters;

		return {
			active: listings.filter(
				(item) =>
					item?.approvalStatus === "approved" && item?.listingStatus !== "sold",
			),
			pending: listings.filter((item) => item?.approvalStatus === "pending"),
			rejected: listings.filter((item) => item?.approvalStatus === "rejected"),
			sold: listings.filter((item) => item?.listingStatus === "sold"),
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
		[filteredListings],
	);

	const currentTabConfig = TAB_CONFIG.find((tab) => tab.value === activeTab);
	const currentListings = getListingsForTab(activeTab);
	const summaryCards = [
		{
			label: "Total",
			value: filteredListings.all.length,
			accent: "text-sky-800",
			card: "border-sky-200 bg-sky-50/70",
		},
		{
			label: "Active",
			value: filteredListings.active.length,
			accent: "text-emerald-700",
			card: "border-emerald-200 bg-emerald-50/70",
		},
		{
			label: "Pending",
			value: filteredListings.pending.length,
			accent: "text-amber-700",
			card: "border-amber-200 bg-amber-50/70",
		},
		{
			label: "Rejected",
			value: filteredListings.rejected.length,
			accent: "text-rose-700",
			card: "border-rose-200 bg-rose-50/70",
		},
		{
			label: "Sold",
			value: filteredListings.sold.length,
			accent: "text-slate-700",
			card: "border-slate-200 bg-slate-50",
		},
	];

	return (
		<div className="mx-auto max-w-7xl rounded-2xl border border-emerald-100 bg-gradient-to-br from-white via-emerald-50/40 to-sky-50/40 px-4 py-8">
			<header className="mb-8 text-center">
				<h1 className="mb-2 text-4xl font-bold tracking-tight text-slate-900">
					Your Property Listings
				</h1>
				<p className="text-slate-600">
					Manage and track all your property listings
				</p>
			</header>

			<div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
				{summaryCards.map((card) => (
					<div
						key={card.label}
						className={`rounded-xl border px-3 py-3 text-center shadow-sm ${card.card}`}
					>
						<p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
							{card.label}
						</p>
						<p className={`mt-1 text-2xl font-bold ${card.accent}`}>
							{card.value}
						</p>
					</div>
				))}
			</div>

			{/* Filter Dropdown */}
			<div className="mb-8 flex justify-center">
				<div className="w-full max-w-md">
					<Select
						value={activeTab}
						onValueChange={(value) => setActiveTab(value as ListingStatus)}
					>
						<SelectTrigger className="h-12 w-full rounded-xl border-2 border-emerald-200 bg-white text-base font-semibold shadow-sm transition-all hover:border-emerald-400">
							<SelectValue />
						</SelectTrigger>

						<SelectContent className="w-full border-emerald-100 bg-white">
							{TAB_CONFIG.map((tab) => (
								<SelectItem
									key={tab.value}
									value={tab.value}
									className="cursor-pointer text-base hover:bg-emerald-50"
								>
									<div className="flex items-center justify-between gap-4 w-full">
										<span className="font-medium text-slate-800">
											{tab.label}
										</span>
										{tab.value !== "all" && (
											<span className="whitespace-nowrap rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
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
				) : error ? (
					<div className="mx-auto max-w-xl rounded-xl border border-red-200 bg-red-50 p-5 text-center">
						<p className="text-sm font-medium text-red-700">
							Unable to load your listings right now.
						</p>
						<p className="mt-1 text-xs text-red-600">{error}</p>
						<button
							type="button"
							onClick={handleRefresh}
							className="mt-3 rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
						>
							Retry
						</button>
					</div>
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
		sold: "You don't have any sold listings yet.",
	};

	return (
		<div className="flex flex-col items-center justify-center py-16 text-center bg-card rounded-xl border border-border shadow-sm mx-4">
			<p className="text-lg text-muted-foreground">{messages[status]}</p>
		</div>
	);
};

export default ViewYourListings;
