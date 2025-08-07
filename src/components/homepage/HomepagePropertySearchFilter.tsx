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

const priceRanges = [
	{ value: "", label: "Any Price" },
	{ value: "0-5000", label: "₹0 - ₹5,000" },
	{ value: "5000-10000", label: "₹5,000 - ₹10,000" },
	{ value: "10000-20000", label: "₹10,000 - ₹20,000" },
	{ value: "20000-50000", label: "₹20,000 - ₹50,000" },
	{ value: "50000+", label: "₹50,000+" },
];

const locations = [
	{ value: "", label: "Any Location" },
	{ value: "siliguri", label: "Siliguri" },
	{ value: "sevoke", label: "Sevoke" },
	{ value: "matigara", label: "Matigara" },
	{ value: "pradhan_nagar", label: "Pradhan Nagar" },
	{ value: "salugara", label: "Salugara" },
	{ value: "dagapur", label: "Dagapur" },
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

	const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const { name, value } = e.target;
		setFilters((prev) => ({
			...prev,
			[name]: value,
		}));
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
			className="w-full max-w-5xl mx-auto bg-white/90 rounded-xl shadow-lg px-6 py-8 flex flex-wrap gap-6 justify-between items-end border border-blue-100 mt-8"
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
					<FaMoneyBillWave className="text-green-500" /> Price Range
				</label>
				<select
					name="priceRange"
					id="priceRange"
					value={filters.priceRange}
					onChange={handleChange}
					className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
				>
					{priceRanges.map((range) => (
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
					className="w-full md:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow transition-all duration-200"
				>
					<FaSearch className="text-lg" />
					<span>Search</span>
				</button>
			</div>
		</form>
	);
};

export default HomepagePropertySearchFilter;
