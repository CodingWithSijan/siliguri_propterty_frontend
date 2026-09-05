import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	FaSearch,
	FaMapMarkerAlt,
	FaHome,
	FaMoneyBillWave,
	FaHandshake,
	FaLocationArrow,
} from "react-icons/fa";
import { WEST_BENGAL_LOCATIONS } from "../../constants/westBengalLocations";
import { isWithinWestBengal } from "../../utils/geo";
import { showError, showInfo } from "../../utils/toastUtils";

const propertyTypes = [
	{ value: "", label: "Any Type" },
	{ value: "house", label: "House" },
	{ value: "flat", label: "Flat/Apartment" },
	{ value: "shop", label: "Shop" },
	{ value: "land", label: "Land" },
];

const rentPriceRanges = [
	{ value: "", label: "Any Price" },
	// Daily rates
	{ value: "0-500", label: "₹0 - ₹500 /day" },
	{ value: "500-1000", label: "₹500 - ₹1,000 /day" },
	{ value: "1000-2000", label: "₹1,000 - ₹2,000 /day" },
	{ value: "2000-5000", label: "₹2,000 - ₹5,000 /day" },
	// Weekly rates
	{ value: "3000-7000", label: "₹3,000 - ₹7,000 /week" },
	{ value: "7000-15000", label: "₹7,000 - ₹15,000 /week" },
	{ value: "15000-30000", label: "₹15,000 - ₹30,000 /week" },
	// Monthly rates
	{ value: "5000-10000", label: "₹5,000 - ₹10,000 /month" },
	{ value: "10000-20000", label: "₹10,000 - ₹20,000 /month" },
	{ value: "20000-35000", label: "₹20,000 - ₹35,000 /month" },
	{ value: "35000-50000", label: "₹35,000 - ₹50,000 /month" },
	{ value: "50000-75000", label: "₹50,000 - ₹75,000 /month" },
	// Yearly rates
	{ value: "60000-120000", label: "₹60,000 - ₹1.2 Lakh /year" },
	{ value: "120000-240000", label: "₹1.2 Lakh - ₹2.4 Lakh /year" },
	{ value: "240000-480000", label: "₹2.4 Lakh - ₹4.8 Lakh /year" },
	{ value: "480000-720000", label: "₹4.8 Lakh - ₹7.2 Lakh /year" },
	{ value: "720000+", label: "₹7.2 Lakh+ /year" },
];

const buyPriceRanges = [
	{ value: "", label: "Any Price" },
	{ value: "0-1000000", label: "₹0 - ₹10 Lakh" },
	{ value: "1000000-2500000", label: "₹10 Lakh - ₹25 Lakh" },
	{ value: "2500000-5000000", label: "₹25 Lakh - ₹50 Lakh" },
	{ value: "5000000-7500000", label: "₹50 Lakh - ₹75 Lakh" },
	{ value: "7500000-10000000", label: "₹75 Lakh - ₹1 Crore" },
	{ value: "10000000-15000000", label: "₹1 Crore - ₹1.5 Crore" },
	{ value: "15000000+", label: "₹1.5 Crore+" },
];

const purposeOptions = [
	{ value: "", label: "Any" },
	{ value: "rent", label: "Rent" },
	{ value: "sell", label: "Buy" },
];

const HomepagePropertySearchFilter: React.FC = () => {
	const navigate = useNavigate();
	const [geoLoading, setGeoLoading] = useState(false);
	const [filters, setFilters] = useState({
		propertyType: "",
		priceRange: "",
		location: "",
		purpose: "",
		lat: "",
		lng: "",
		radiusKm: "12",
	});

	// Function to get appropriate price ranges based on purpose
	const getPriceRanges = () => {
		if (filters.purpose === "rent") {
			return rentPriceRanges;
		} else if (filters.purpose === "buy") {
			return buyPriceRanges;
		} else {
			// Default to buy prices when no purpose is selected
			return buyPriceRanges;
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const { name, value } = e.target;
		setFilters((prev) => {
			const newFilters = {
				...prev,
				[name]: value,
			};

			// Reset price range when purpose changes
			if (name === "purpose") {
				newFilters.priceRange = "";
			}

			return newFilters;
		});
	};

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		const params = new URLSearchParams();

		if (filters.propertyType) params.set("category", filters.propertyType);
		if (filters.purpose) params.set("intent", filters.purpose);
		if (filters.location) params.set("location", filters.location);
		if (filters.lat && filters.lng) {
			params.set("lat", filters.lat);
			params.set("lng", filters.lng);
			params.set("radiusKm", filters.radiusKm || "12");
			params.set("sort", "nearest");
		}

		if (filters.priceRange) {
			if (filters.priceRange.includes("+")) {
				const min = filters.priceRange.replace("+", "");
				params.set("minPrice", min);
			} else {
				const [min, max] = filters.priceRange.split("-");
				if (min) params.set("minPrice", min);
				if (max) params.set("maxPrice", max);
			}
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

	return (
		<form
			onSubmit={handleSearch}
			className="w-full rounded-xl border border-white/20 bg-white/40 px-4 py-5 shadow-lg backdrop-blur-md sm:px-6 sm:py-6"
		>
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-12 xl:items-end">
				{/* Purpose */}
				<div className="flex flex-col xl:col-span-2">
					<label
						htmlFor="purpose"
						className="mb-1 font-semibold text-gray-700 flex items-center gap-1"
					>
						<FaHandshake className="text-purple-500" /> Rent or Buy
					</label>
					<select
						name="purpose"
						id="purpose"
						value={filters.purpose}
						onChange={handleChange}
						className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
					>
						{purposeOptions.map((option) => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</select>
				</div>

				{/* Property Type */}
				<div className="flex flex-col xl:col-span-2">
					<label
						htmlFor="propertyType"
						className="mb-1 font-semibold text-gray-700 flex items-center gap-1"
					>
						<FaHome className="text-blue-500" /> Property Type
					</label>
					<select
						name="propertyType"
						id="propertyType"
						value={filters.propertyType}
						onChange={handleChange}
						className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
					>
						{propertyTypes.map((type) => (
							<option key={type.value} value={type.value}>
								{type.label}
							</option>
						))}
					</select>
				</div>

				{/* Price Range */}
				<div className="flex flex-col xl:col-span-2">
					<label
						htmlFor="priceRange"
						className="mb-1 font-semibold text-gray-700 flex items-center gap-1"
					>
						<FaMoneyBillWave className="text-green-500" />
						{filters.purpose === "rent" ? "Monthly Rent" : "Price Range"}
					</label>
					<select
						name="priceRange"
						id="priceRange"
						value={filters.priceRange}
						onChange={handleChange}
						className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
					>
						{getPriceRanges().map((range) => (
							<option key={range.value} value={range.value}>
								{range.label}
							</option>
						))}
					</select>
				</div>

				{/* Location */}
				<div className="flex flex-col xl:col-span-2">
					<label
						htmlFor="location"
						className="mb-1 font-semibold text-gray-700 flex items-center gap-1"
					>
						<FaMapMarkerAlt className="text-red-500" /> Location
					</label>
					<select
						name="location"
						id="location"
						value={filters.location}
						onChange={handleChange}
						className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
					>
						<option value="">Any Location</option>
						{WEST_BENGAL_LOCATIONS.map((loc) => (
							<option key={loc.value} value={loc.value}>
								{loc.label}
							</option>
						))}
					</select>
				</div>

				<div className="flex flex-col xl:col-span-2">
					<label
						htmlFor="radius"
						className="mb-1 font-semibold text-gray-700 flex items-center gap-1"
					>
						<FaLocationArrow className="text-sky-600" /> Geo Radius (km)
					</label>
					<input
						id="radius"
						type="range"
						min={1}
						max={60}
						value={filters.radiusKm}
						onChange={(event) =>
							setFilters((prev) => ({ ...prev, radiusKm: event.target.value }))
						}
						className="accent-sky-600"
					/>
					<span className="text-xs text-slate-600">{filters.radiusKm} km</span>
				</div>

				<div className="mt-2 flex flex-col gap-2 md:col-span-2 lg:col-span-3 xl:col-span-12 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-3 xl:items-end xl:justify-center">
					<button
						type="button"
						onClick={handleUseCurrentLocation}
						disabled={geoLoading}
						className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-800 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:bg-slate-900 xl:w-auto"
					>
						<FaLocationArrow className="text-lg" />
						<span>{geoLoading ? "Detecting..." : "Use Current Location"}</span>
					</button>

					<button
						type="submit"
						className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl xl:w-auto"
					>
						<FaSearch className="text-lg" />
						<span>Search Properties</span>
					</button>

					{filters.lat && filters.lng && (
						<button
							type="button"
							onClick={clearGeoSelection}
							className="inline-flex w-full items-center justify-center rounded-lg border border-slate-400 bg-white px-6 py-2.5 font-medium text-slate-700 xl:w-auto"
						>
							Clear Geo
						</button>
					)}
				</div>
			</div>
		</form>
	);
};

export default HomepagePropertySearchFilter;
