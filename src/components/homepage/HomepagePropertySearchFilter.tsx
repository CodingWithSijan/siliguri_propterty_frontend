import React, { useState } from "react";
import {
	FaSearch,
	FaMapMarkerAlt,
	FaHome,
	FaMoneyBillWave,
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

const HomepagePropertySearchFilter: React.FC = () => {
	const [filters, setFilters] = useState({
		propertyType: "",
		priceRange: "",
		location: "",
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
		// Implement your search logic here
		alert(
			`Searching for:\nProperty Type: ${
				filters.propertyType || "Any"
			}\nPrice Range: ${filters.priceRange || "Any"}\nLocation: ${
				filters.location || "Any"
			}`
		);
	};

	return (
		<form
			onSubmit={handleSearch}
			className="w-full max-w-4xl mx-auto bg-white/90 rounded-xl shadow-lg px-6 py-8 flex flex-col md:flex-row items-center gap-6 md:gap-4 mt-8 border border-blue-100"
		>
			{/* Property Type */}
			<div className="flex flex-col items-start flex-1 min-w-[180px]">
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
			<div className="flex flex-col items-start flex-1 min-w-[180px]">
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
			<div className="flex flex-col items-start flex-1 min-w-[180px]">
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
			<div className="flex items-end h-full pt-5 md:pt-0">
				<button
					type="submit"
					className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow transition-all duration-200"
				>
					<FaSearch className="text-lg" />
					<span>Search</span>
				</button>
			</div>
		</form>
	);
};

export default HomepagePropertySearchFilter;
