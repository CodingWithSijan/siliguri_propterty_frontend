import React, { useState } from "react";
import { showSuccess, showError } from "../../utils/toastUtils";
import AddressInput from "../../services/AddressInput";
import BASE_URL from "../../services";
import {
	FiUpload,
	FiImage,
	FiTrash2,
	FiTag,
	FiAlignLeft,
	FiMapPin,
	FiDollarSign,
	FiList,
	FiClock,
} from "react-icons/fi";

const NewPost = () => {
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		location: "",
		price: "",
		priceRange: { min: "", max: "" },
		priceType: "fixed",
		pictures: [],
		propertyCategory: "",
		intent: "",
		duration: "",
	});
	const [preview, setPreview] = useState<string[]>([]);
	const [loading, setLoading] = useState(false);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		if (name.includes("priceRange")) {
			const key = name.split(".")[1];
			setFormData((prev) => ({
				...prev,
				priceRange: { ...prev.priceRange, [key]: value },
			}));
		} else {
			setFormData((prev) => ({ ...prev, [name]: value }));
		}
	};

	const handlePictureChange = (e) => {
		if (e.target.files) {
			const filesArray = Array.from(e.target.files);
			setFormData((prev) => ({ ...prev, pictures: filesArray }));
			setPreview(filesArray.map((file) => URL.createObjectURL(file)));
		}
	};

	const handlePictureDelete = (i) => {
		const pics = formData.pictures.filter((_, index) => i !== index);
		const previews = preview.filter((_, index) => i !== index);
		setFormData((prev) => ({ ...prev, pictures: pics }));
		setPreview(previews);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		const postData = new FormData();
		Object.entries(formData).forEach(([key, value]) => {
			if (key === "pictures") {
				value.forEach((pic) => postData.append("pictures", pic));
			} else if (key === "priceRange") {
				postData.append("min", value.min);
				postData.append("max", value.max);
			} else {
				postData.append(key, value);
			}
		});

		try {
			await BASE_URL.post("/api/users/post/new-post", postData);
			showSuccess("Post submitted successfully!");
			setFormData({
				title: "",
				description: "",
				location: "",
				price: "",
				priceRange: { min: "", max: "" },
				priceType: "fixed",
				pictures: [],
				propertyCategory: "",
				intent: "",
				duration: "",
			});
			setPreview([]);
		} catch (err) {
			showError("Failed to submit post.");
		} finally {
			setLoading(false);
		}
	};

	const InputWrapper = ({ icon, children }) => (
		<label className="block">
			<div className="flex items-center gap-2 text-gray-700 font-medium mb-1">
				{icon} {children.props.placeholder || children.props.name}
			</div>
			{children}
		</label>
	);

	return (
		<form
			onSubmit={handleSubmit}
			className="max-w-3xl mx-auto p-8 bg-white rounded-2xl shadow-xl space-y-6"
		>
			<h2 className="text-3xl font-bold text-center text-blue-600">
				Post Your Property 🏡
			</h2>

			<InputWrapper icon={<FiTag />}>
				<input
					name="title"
					value={formData.title}
					onChange={handleInputChange}
					placeholder="Title"
					required
					className="w-full border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
			</InputWrapper>

			<InputWrapper icon={<FiAlignLeft />}>
				<textarea
					name="description"
					value={formData.description}
					onChange={handleInputChange}
					placeholder="Description"
					required
					className="w-full border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
			</InputWrapper>

			<InputWrapper icon={<FiMapPin />}>
				<AddressInput
					value={formData.location}
					onChange={(location) => setFormData({ ...formData, location })}
				/>
			</InputWrapper>

			<InputWrapper icon={<FiList />}>
				<select
					name="propertyCategory"
					value={formData.propertyCategory}
					onChange={handleInputChange}
					className="w-full border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
				>
					<option value="">Select Property Type</option>
					<option value="land">Land</option>
					<option value="apartment">Apartment</option>
					<option value="house">House</option>
				</select>
			</InputWrapper>

			{formData.propertyCategory && (
				<InputWrapper icon={<FiList />}>
					<select
						name="intent"
						value={formData.intent}
						onChange={handleInputChange}
						className="w-full border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						<option value="">Looking to</option>
						<option value="rent">Rent</option>
						<option value="sell">Sell</option>
						<option value="buy">Buy</option>
					</select>
				</InputWrapper>
			)}

			{formData.intent === "rent" && (
				<InputWrapper icon={<FiClock />}>
					<select
						name="duration"
						value={formData.duration}
						onChange={handleInputChange}
						className="w-full border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						<option value="">Select Rent Duration</option>
						<option value="day">Per Day</option>
						<option value="week">Per Week</option>
						<option value="month">Per Month</option>
						<option value="year">Per Year</option>
					</select>
				</InputWrapper>
			)}

			<div className="flex gap-4">
				<label className="flex items-center gap-2">
					<input
						type="radio"
						name="priceType"
						value="negotiable"
						checked={formData.priceType === "negotiable"}
						onChange={handleInputChange}
					/>{" "}
					Negotiable
				</label>
				<label className="flex items-center gap-2">
					<input
						type="radio"
						name="priceType"
						value="fixed"
						checked={formData.priceType === "fixed"}
						onChange={handleInputChange}
					/>{" "}
					Fixed
				</label>
			</div>

			{formData.priceType === "negotiable" ? (
				<div className="flex gap-4">
					<InputWrapper icon={<FiDollarSign />}>
						<input
							name="priceRange.min"
							type="number"
							placeholder="Min Price"
							value={formData.priceRange.min}
							onChange={handleInputChange}
							className="w-full border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</InputWrapper>
					<InputWrapper icon={<FiDollarSign />}>
						<input
							name="priceRange.max"
							type="number"
							placeholder="Max Price"
							value={formData.priceRange.max}
							onChange={handleInputChange}
							className="w-full border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</InputWrapper>
				</div>
			) : (
				<InputWrapper icon={<FiDollarSign />}>
					<input
						name="price"
						type="number"
						placeholder="Fixed Price"
						value={formData.price}
						onChange={handleInputChange}
						className="w-full border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</InputWrapper>
			)}

			<InputWrapper icon={<FiUpload />}>
				<input
					type="file"
					multiple
					accept="image/*"
					onChange={handlePictureChange}
					className="w-full"
				/>
			</InputWrapper>

			{preview.length > 0 && (
				<div className="grid grid-cols-2 gap-4">
					{preview.map((src, i) => (
						<div key={i} className="relative">
							<img
								src={src}
								alt="Preview"
								className="w-full h-32 object-cover rounded-md"
							/>
							<button
								type="button"
								onClick={() => handlePictureDelete(i)}
								className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full"
							>
								<FiTrash2 />
							</button>
						</div>
					))}
				</div>
			)}

			<button
				type="submit"
				disabled={loading}
				className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition"
			>
				{loading ? "Submitting..." : "Submit Post"}
			</button>
		</form>
	);
};

export default NewPost;
