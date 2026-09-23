import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaLocationArrow, FaFilter } from "react-icons/fa";
import { WEST_BENGAL_LOCATIONS } from "../../constants/westBengalLocations";
import { isWithinWestBengal } from "../../utils/geo";
import { showError, showInfo } from "../../utils/toastUtils";
import { Slider } from "../ui/slider";
import { formatIndianCurrency } from "../../utils/priceFormatHelper";

type ListingIntent = "sell" | "rent" | "";

interface IHomepageSearchFilters {
	propertyType: string;
	location: string;
	customLocation: string;
	intent: ListingIntent;
	lat: string;
	lng: string;
	radiusKm: string;
	minPrice: number;
	maxPrice: number;
}

const allPropertyTypes = [
	{ value: "", label: "Any Type" },
	{ value: "house", label: "House" },
	{ value: "flat", label: "Flat/Apartment" },
	{ value: "shop", label: "Shop" },
	{ value: "land", label: "Land" },
];

const PRICE_LIMITS = {
	sell: { min: 0, max: 20000000, step: 100000 },
	rent: { min: 0, max: 100000, step: 1000 },
} as const;

const getPriceLimits = (intent: ListingIntent) =>
	intent === "rent" ? PRICE_LIMITS.rent : PRICE_LIMITS.sell;

const formatReadablePrice = (value: number): string => {
	const safeValue = Math.max(0, Number.isFinite(value) ? value : 0);
	return `₹${safeValue.toLocaleString("en-IN")} (${formatIndianCurrency(safeValue)})`;
};

const HomepagePropertySearchFilter: React.FC = () => {
	const navigate = useNavigate();
	const [geoLoading, setGeoLoading] = useState(false);
	const OTHER_LOCATION_VALUE = "other";
	const defaultLimits = getPriceLimits("sell");
	const [filters, setFilters] = useState<IHomepageSearchFilters>({
		propertyType: "",
		location: "",
		customLocation: "",
		intent: "sell" as ListingIntent,
		lat: "",
		lng: "",
		radiusKm: "12",
		minPrice: defaultLimits.min,
		maxPrice: defaultLimits.max,
	});

	const activePriceLimits = getPriceLimits(filters.intent);
	const sliderMax = Math.max(
		activePriceLimits.max,
		filters.maxPrice,
		filters.minPrice,
	);
	const hasActiveFilters =
		Boolean(filters.propertyType) ||
		Boolean(filters.location) ||
		Boolean(filters.customLocation.trim()) ||
		Boolean(filters.lat && filters.lng) ||
		filters.intent !== "sell" ||
		filters.minPrice !== activePriceLimits.min ||
		filters.maxPrice !== activePriceLimits.max;

	const getPropertyTypes = () => {
		if (filters.intent === "rent") {
			return allPropertyTypes.filter((type) => type.value !== "land");
		}
		return allPropertyTypes;
	};

	const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const { name, value } = e.target;
		setFilters((prev) => ({
			...prev,
			[name]: value,
			...(name === "location" && value !== OTHER_LOCATION_VALUE
				? { customLocation: "" }
				: {}),
		}));
	};

	const handleCustomLocationChange = (
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
		setFilters((prev) => ({
			...prev,
			customLocation: e.target.value,
		}));
	};

	const setIntent = (intent: ListingIntent) => {
		const limits = getPriceLimits(intent);
		setFilters((prev) => {
			const nextType =
				intent === "rent" && prev.propertyType === "land"
					? ""
					: prev.propertyType;
			return {
				...prev,
				intent,
				propertyType: nextType,
				minPrice: limits.min,
				maxPrice: limits.max,
			};
		});
	};

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		const params = new URLSearchParams();

		if (filters.propertyType) params.set("category", filters.propertyType);
		if (filters.intent) params.set("intent", filters.intent);
		if (filters.location && filters.location !== OTHER_LOCATION_VALUE) {
			params.set("location", filters.location);
		}

		if (filters.location === OTHER_LOCATION_VALUE && filters.customLocation) {
			params.set("q", filters.customLocation.trim());
		}
		if (filters.lat && filters.lng) {
			params.set("lat", filters.lat);
			params.set("lng", filters.lng);
			params.set("radiusKm", filters.radiusKm || "12");
			params.set("sort", "nearest");
		}

		if (filters.minPrice !== activePriceLimits.min) {
			params.set("minPrice", String(filters.minPrice));
		}

		if (filters.maxPrice !== activePriceLimits.max) {
			params.set("maxPrice", String(filters.maxPrice));
		}

		navigate(`/properties?${params.toString()}`);
	};

	const handleUseCurrentLocation = () => {
		if (!navigator.geolocation) {
			showError("Geolocation is not available in this browser.");
			return;
		}

		setGeoLoading(true);
		navigator.geolocation.getCurrentPosition(
			(position) => {
				const lat = position.coords.latitude;
				const lng = position.coords.longitude;

				if (!isWithinWestBengal({ lat, lng })) {
					showError("Geo search is currently available inside Siliguri only.");
					setGeoLoading(false);
					return;
				}

				showInfo("Current location captured for nearby property search.");
				setFilters((prev) => ({
					...prev,
					lat: String(lat),
					lng: String(lng),
				}));
				setGeoLoading(false);
			},
			() => {
				showError("Unable to access your location. Please allow permission.");
				setGeoLoading(false);
			},
			{ enableHighAccuracy: true, timeout: 10000 },
		);
	};

	const clearGeoSelection = () => {
		setFilters((prev) => ({ ...prev, lat: "", lng: "" }));
	};

	const handlePriceRangeChange = (values: number[]) => {
		if (values.length !== 2) {
			return;
		}

		setFilters((prev) => ({
			...prev,
			minPrice: Math.max(activePriceLimits.min, values[0]),
			maxPrice: Math.max(values[1], values[0]),
		}));
	};

	const handleMinPriceInput = (event: React.ChangeEvent<HTMLInputElement>) => {
		const nextRaw = event.target.value;
		const nextMin = nextRaw === "" ? activePriceLimits.min : Number(nextRaw);
		if (!Number.isFinite(nextMin)) {
			return;
		}

		setFilters((prev) => {
			const safeMin = Math.max(0, Math.floor(nextMin));
			const safeMax = Math.max(prev.maxPrice, safeMin);
			return {
				...prev,
				minPrice: safeMin,
				maxPrice: safeMax,
			};
		});
	};

	const handleMaxPriceInput = (event: React.ChangeEvent<HTMLInputElement>) => {
		const nextRaw = event.target.value;
		const nextMax = nextRaw === "" ? activePriceLimits.max : Number(nextRaw);
		if (!Number.isFinite(nextMax)) {
			return;
		}

		setFilters((prev) => {
			const safeMax = Math.max(0, Math.floor(nextMax));
			const safeMin = Math.min(prev.minPrice, safeMax);
			return {
				...prev,
				minPrice: safeMin,
				maxPrice: safeMax,
			};
		});
	};

	const resetFilters = () => {
		const limits = getPriceLimits("sell");
		setFilters({
			propertyType: "",
			location: "",
			customLocation: "",
			intent: "sell",
			lat: "",
			lng: "",
			radiusKm: "12",
			minPrice: limits.min,
			maxPrice: limits.max,
		});
	};

	return (
		<form
			onSubmit={handleSearch}
			className="w-full rounded-2xl border border-slate-200 bg-white/95 px-4 py-4 shadow-[0_20px_55px_-35px_rgba(15,23,42,0.9)] backdrop-blur md:px-6 md:py-5"
		>
			<div className="mb-4 flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 pb-3">
				<div>
					<p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-700">
						Smart Property Search
					</p>
					<h3 className="mt-1 text-base font-semibold text-slate-900">
						Find the right property faster
					</h3>
					<p className="mt-1 text-xs text-slate-600">
						Set location, type and budget to narrow listings instantly.
					</p>
				</div>
				<span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
					<FaFilter className="text-[10px]" /> Refine search
				</span>
			</div>

			<div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 p-1">
				<p className="mb-1 px-2 pt-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
					Looking to
				</p>
				<div className="grid grid-cols-3 gap-2">
					<button
						type="button"
						onClick={() => setIntent("sell")}
						className={`rounded-md px-2 py-2 text-xs font-semibold transition ${
							filters.intent === "sell"
								? "bg-emerald-600 text-white shadow-sm"
								: "text-slate-700 hover:bg-slate-200"
						}`}
					>
						Buy
					</button>
					<button
						type="button"
						onClick={() => setIntent("rent")}
						className={`rounded-md px-2 py-2 text-xs font-semibold transition ${
							filters.intent === "rent"
								? "bg-emerald-600 text-white shadow-sm"
								: "text-slate-700 hover:bg-slate-200"
						}`}
					>
						Rent
					</button>
					<button
						type="button"
						onClick={() => setIntent("")}
						className={`rounded-md px-2 py-2 text-xs font-semibold transition ${
							filters.intent === ""
								? "bg-emerald-700 text-white shadow-sm"
								: "text-slate-700 hover:bg-slate-200"
						}`}
					>
						All
					</button>
				</div>
			</div>

			<div className="grid grid-cols-1 gap-3 md:grid-cols-12 md:gap-4">
				<div className="md:col-span-4">
					<label
						htmlFor="propertyType"
						className="mb-1 block text-xs font-medium text-slate-600"
					>
						Property Type
					</label>
					<select
						name="propertyType"
						id="propertyType"
						value={filters.propertyType}
						onChange={handleChange}
						className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
					>
						{getPropertyTypes().map((type) => (
							<option key={type.value} value={type.value}>
								{type.label}
							</option>
						))}
					</select>
				</div>

				<div className="md:col-span-4">
					<label
						htmlFor="location"
						className="mb-1 block text-xs font-medium text-slate-600"
					>
						Locality
					</label>
					<select
						name="location"
						id="location"
						value={filters.location}
						onChange={handleChange}
						className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
					>
						<option value="">Any Location</option>
						{WEST_BENGAL_LOCATIONS.map((loc) => (
							<option key={loc.value} value={loc.value}>
								{loc.label}
							</option>
						))}
						<option value={OTHER_LOCATION_VALUE}>Other</option>
					</select>
					{filters.location === OTHER_LOCATION_VALUE && (
						<input
							type="text"
							value={filters.customLocation}
							onChange={handleCustomLocationChange}
							placeholder="Type locality not listed"
							className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
						/>
					)}
				</div>

				<div className="md:col-span-4">
					<label className="mb-1 block text-xs font-medium text-slate-600">
						Nearby Search
					</label>
					<div className="flex gap-2">
						<button
							type="button"
							onClick={handleUseCurrentLocation}
							disabled={geoLoading}
							className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
						>
							<FaLocationArrow className="text-sm" />
							<span>
								{geoLoading
									? "Detecting..."
									: filters.lat && filters.lng
										? "Nearby enabled"
										: "Use Current Location"}
							</span>
						</button>
						{filters.lat && filters.lng && (
							<button
								type="button"
								onClick={clearGeoSelection}
								className="inline-flex h-11 items-center justify-center rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700"
							>
								Clear
							</button>
						)}
					</div>
				</div>

				<div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 md:col-span-8">
					<label className="mb-1 block text-xs font-medium text-slate-600">
						Budget Range
					</label>
					<div className="mb-2 flex items-center justify-between text-xs font-medium text-slate-700">
						<span>Min: ₹{formatIndianCurrency(filters.minPrice)}</span>
						<span>Max: ₹{formatIndianCurrency(filters.maxPrice)}</span>
					</div>
					<Slider
						min={activePriceLimits.min}
						max={sliderMax}
						step={activePriceLimits.step}
						value={[filters.minPrice, filters.maxPrice]}
						onValueChange={handlePriceRangeChange}
						className="py-1"
					/>
					<div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
						<label className="block">
							<span className="mb-1 block text-[11px] font-medium text-slate-600">
								Min price
							</span>
							<input
								type="number"
								inputMode="numeric"
								min={0}
								value={filters.minPrice}
								onChange={handleMinPriceInput}
								className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-emerald-500"
							/>
							<p className="mt-1 text-[11px] font-medium text-slate-600">
								{formatReadablePrice(filters.minPrice)}
							</p>
						</label>
						<label className="block">
							<span className="mb-1 block text-[11px] font-medium text-slate-600">
								Max price
							</span>
							<input
								type="number"
								inputMode="numeric"
								min={0}
								value={filters.maxPrice}
								onChange={handleMaxPriceInput}
								className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-emerald-500"
							/>
							<p className="mt-1 text-[11px] font-medium text-slate-600">
								{formatReadablePrice(filters.maxPrice)}
							</p>
						</label>
					</div>
					<div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
						<span>Any</span>
						<span>Upper: ₹{formatIndianCurrency(sliderMax)}</span>
					</div>
				</div>

				<div className="md:col-span-4 flex gap-2 md:items-end">
					<div className="flex w-full gap-2">
						{hasActiveFilters && (
							<button
								type="button"
								onClick={resetFilters}
								className="inline-flex h-11 items-center justify-center rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700"
							>
								Reset
							</button>
						)}

						<button
							type="submit"
							className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
						>
							<FaSearch className="text-sm" />
							<span>Search</span>
						</button>
					</div>
				</div>
			</div>
		</form>
	);
};

export default HomepagePropertySearchFilter;
