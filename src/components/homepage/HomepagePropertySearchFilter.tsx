import React, { useState } from "react";
import {
	FaSearch,
	FaMapMarkerAlt,
	FaHome,
	FaMoneyBillWave,
	FaHandshake,
} from "react-icons/fa";

const propertyTypes = [
	{ value: "", label: "Any Type" },
	{ value: "house", label: "House" },
	{ value: "flat", label: "Flat/Apartment" },
	{ value: "shop", label: "Shop" },
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

const locations = [
	{ value: "", label: "Any Location" },
	{ value: "siliguri_city", label: "Siliguri City Center" },
	{ value: "sevoke", label: "Sevoke Road" },
	{ value: "matigara", label: "Matigara" },
	{ value: "pradhan_nagar", label: "Pradhan Nagar" },
	{ value: "salugara", label: "Salugara" },
	{ value: "dagapur", label: "Dagapur" },
	{ value: "bidhan_nagar", label: "Bidhan Nagar" },
	{ value: "shiv_mandir", label: "Shiv Mandir Area" },
	{ value: "jalpaiguri_road", label: "Jalpaiguri Road" },
	{ value: "hakimpara", label: "Hakimpara" },
	{ value: "ashighar", label: "Ashighar" },
	{ value: "khalpara", label: "Khalpara" },
	{ value: "darjeeling_more", label: "Darjeeling More" },
	{ value: "court_more", label: "Court More" },
	{ value: "mallaguri", label: "Mallaguri" },
	{ value: "champasari", label: "Champasari" },
	{ value: "uttorayon", label: "Uttorayon" },
	{ value: "college_para", label: "College Para" },
	{ value: "bagdogra", label: "Bagdogra" },
	{ value: "other", label: "Other" },
];

const purposeOptions = [
	{ value: "", label: "Any" },
	{ value: "rent", label: "Rent" },
	{ value: "buy", label: "Buy" },
];

const HomepagePropertySearchFilter: React.FC = () => {
	const [filters, setFilters] = useState({
		propertyType: "",
		priceRange: "",
		location: "",
		purpose: "",
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
		alert(
			`Searching for:
Property Type: ${filters.propertyType || "Any"}
Price Range: ${filters.priceRange || "Any"}
Location: ${filters.location || "Any"}
Purpose: ${filters.purpose || "Any"}`
		);
	};

	return (
		<form
			onSubmit={handleSearch}
			className=" w-full bg-white/40 backdrop-blur-md rounded-xl px-6 py-6 flex flex-wrap gap-4 justify-between items-end shadow-lg border border-white/20"
		>
			{/* Purpose */}
			<div className="flex flex-col flex-1 min-w-[180px]">
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
			<div className="flex flex-col flex-1 min-w-[180px]">
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
			<div className="flex flex-col flex-1 min-w-[180px]">
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
			<div className="flex flex-col flex-1 min-w-[180px]">
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
					{locations.map((loc) => (
						<option key={loc.value} value={loc.value}>
							{loc.label}
						</option>
					))}
				</select>
			</div>

			{/* Search Button */}
			<div className="flex flex-col min-w-[180px] w-full md:w-auto">
				<button
					type="submit"
					className="w-full md:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
				>
					<FaSearch className="text-lg" />
					<span>Search Properties</span>
				</button>
			</div>
		</form>
	);
};

export default HomepagePropertySearchFilter;
