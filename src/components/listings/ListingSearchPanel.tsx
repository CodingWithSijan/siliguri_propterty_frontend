import React from "react";
import { LocateFixed, Search, SlidersHorizontal } from "lucide-react";
import { WEST_BENGAL_LOCATIONS } from "../../constants/westBengalLocations";
import type { IListingSearchState } from "../../types/searchTypes";

interface ListingSearchPanelProps {
	state: IListingSearchState;
	onChange: (patch: Partial<IListingSearchState>) => void;
	onUseCurrentLocation: () => void;
	onClearGeoFilter: () => void;
	onReset: () => void;
	geoLoading: boolean;
	lockIntent?: "rent" | "sell";
	lockCategory?: "house" | "flat" | "shop" | "land";
	layout?: "full" | "sidebar";
}

const ListingSearchPanel: React.FC<ListingSearchPanelProps> = ({
	state,
	onChange,
	onUseCurrentLocation,
	onClearGeoFilter,
	onReset,
	geoLoading,
	lockIntent,
	lockCategory,
	layout = "full",
}) => {
	const hasGeoFilter = state.lat !== null && state.lng !== null;
	const gridClassName =
		layout === "sidebar"
			? "grid grid-cols-1 gap-4 sm:grid-cols-2"
			: "grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4";

	return (
		<section className="mb-8 rounded-2xl border border-slate-200/80 bg-white/95 p-4 md:p-6 shadow-sm">
			<div className="mb-4 flex flex-wrap items-center justify-between gap-3">
				<div className="flex items-center gap-2">
					<SlidersHorizontal className="h-5 w-5 text-slate-700" />
					<h2 className="text-lg font-semibold text-slate-900">
						Search and Filter
					</h2>
				</div>
				<button
					type="button"
					onClick={onReset}
					className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
				>
					Reset All
				</button>
			</div>

			<div className={gridClassName}>
				<label className="block">
					<span className="mb-1 block text-sm font-medium text-slate-700">
						Keyword
					</span>
					<div className="relative">
						<Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
						<input
							type="text"
							value={state.query}
							onChange={(event) =>
								onChange({ query: event.target.value, page: 1 })
							}
							placeholder="Location, title, landmark"
							className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-900 outline-none ring-0 transition focus:border-sky-500"
						/>
					</div>
				</label>

				<label className="block">
					<span className="mb-1 block text-sm font-medium text-slate-700">
						Intent
					</span>
					<select
						disabled={Boolean(lockIntent)}
						value={lockIntent ?? state.intent}
						onChange={(event) =>
							onChange({
								intent: event.target.value as IListingSearchState["intent"],
								page: 1,
							})
						}
						className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-sky-500 disabled:bg-slate-100"
					>
						<option value="all">All</option>
						<option value="rent">Rent</option>
						<option value="sell">Buy</option>
					</select>
				</label>

				<label className="block">
					<span className="mb-1 block text-sm font-medium text-slate-700">
						Property Type
					</span>
					<select
						disabled={Boolean(lockCategory)}
						value={lockCategory ?? state.category}
						onChange={(event) =>
							onChange({
								category: event.target.value as IListingSearchState["category"],
								page: 1,
							})
						}
						className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-sky-500 disabled:bg-slate-100"
					>
						<option value="all">All Types</option>
						<option value="house">House</option>
						<option value="flat">Flat</option>
						<option value="shop">Shop</option>
						<option value="land">Land</option>
					</select>
				</label>

				<label className="block">
					<span className="mb-1 block text-sm font-medium text-slate-700">
						West Bengal Area
					</span>
					<select
						value={state.locationKey}
						onChange={(event) =>
							onChange({ locationKey: event.target.value, page: 1 })
						}
						className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-sky-500"
					>
						<option value="">Any Area</option>
						{WEST_BENGAL_LOCATIONS.map((location) => (
							<option key={location.value} value={location.value}>
								{location.label}
							</option>
						))}
					</select>
				</label>

				<label className="block">
					<span className="mb-1 block text-sm font-medium text-slate-700">
						Min Price (INR)
					</span>
					<input
						type="number"
						min={0}
						value={state.minPrice ?? ""}
						onChange={(event) =>
							onChange({
								minPrice: event.target.value
									? Number(event.target.value)
									: null,
								page: 1,
							})
						}
						placeholder="e.g. 10000"
						className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-sky-500"
					/>
				</label>

				<label className="block">
					<span className="mb-1 block text-sm font-medium text-slate-700">
						Max Price (INR)
					</span>
					<input
						type="number"
						min={0}
						value={state.maxPrice ?? ""}
						onChange={(event) =>
							onChange({
								maxPrice: event.target.value
									? Number(event.target.value)
									: null,
								page: 1,
							})
						}
						placeholder="e.g. 5000000"
						className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-sky-500"
					/>
				</label>

				<label className="block">
					<span className="mb-1 block text-sm font-medium text-slate-700">
						Sort By
					</span>
					<select
						value={state.sortBy}
						onChange={(event) =>
							onChange({
								sortBy: event.target.value as IListingSearchState["sortBy"],
							})
						}
						className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-sky-500"
					>
						<option value="newest">Newest First</option>
						<option value="priceLow">Price: Low to High</option>
						<option value="priceHigh">Price: High to Low</option>
						<option value="nearest">Nearest First</option>
					</select>
				</label>

				<div>
					<span className="mb-1 block text-sm font-medium text-slate-700">
						Geo Filter Radius (km)
					</span>
					<input
						type="range"
						min={1}
						max={60}
						value={state.radiusKm}
						onChange={(event) =>
							onChange({ radiusKm: Number(event.target.value), page: 1 })
						}
						className="mt-2 w-full accent-sky-600"
					/>
					<div className="mt-1 text-sm text-slate-600">{state.radiusKm} km</div>
				</div>
			</div>

			<div className="mt-5 flex flex-wrap items-center gap-3">
				<button
					type="button"
					onClick={onUseCurrentLocation}
					disabled={geoLoading}
					className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-500"
				>
					<LocateFixed className="h-4 w-4" />
					{geoLoading ? "Detecting..." : "Use My Current Location"}
				</button>

				{hasGeoFilter && (
					<button
						type="button"
						onClick={onClearGeoFilter}
						className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
					>
						Clear Geo Filter
					</button>
				)}

				{hasGeoFilter && (
					<p className="text-sm text-slate-600">
						Showing properties near your current location inside West Bengal.
					</p>
				)}
			</div>
		</section>
	);
};

export default ListingSearchPanel;
