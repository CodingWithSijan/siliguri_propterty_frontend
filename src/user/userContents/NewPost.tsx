import { useState } from "react";
import { showSuccess, showError } from "../../utils/toastUtils";
import AddressInput from "../../services/AddressInput";
import BASE_URL from "../../services";

interface FormDataTypes {
	title: string;
	description: string;
	location: string;
	price: string;
	priceRange: { min: string; max: string };
	priceType: "negotiable" | "fixed";
	pictures: File[];
	propertyCategory: "land" | "apartment" | "house" | "";
	intent: "rent" | "sell" | "buy" | "";
	duration: "day" | "week" | "month" | "year" | "";
}

const initialFormData: FormDataTypes = {
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
};

const NewPost = () => {
	const [formData, setFormData] = useState(initialFormData);
	const [preview, setPreview] = useState<string[]>([]);
	const [loading, setLoading] = useState(false);

	const handleInputChange = (e: React.ChangeEvent<any>) => {
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

	const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const filesArray = Array.from(e.target.files);
			setFormData((prev) => ({ ...prev, pictures: filesArray }));
			const previewUrls = filesArray.map((file) => URL.createObjectURL(file));
			setPreview(previewUrls);
		}
	};

	const handlePictureDelete = (index: number) => {
		const newPics = formData.pictures.filter((_, i) => i !== index);
		const newPreview = preview.filter((_, i) => i !== index);
		setFormData((prev) => ({ ...prev, pictures: newPics }));
		setPreview(newPreview);
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);

		const postData = new FormData();
		Object.entries(formData).forEach(([key, value]) => {
			if (key === "pictures") {
				value.forEach((pic: File) => postData.append("pictures", pic));
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
			setFormData(initialFormData);
			setPreview([]);
		} catch (error) {
			showError("Failed to submit post.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="max-w-3xl mx-auto p-8 bg-white shadow-xl border border-gray-200 rounded-2xl space-y-6 text-black"
		>
			<h2 className="text-3xl font-bold text-center mb-6">
				Post Your Property 🏡
			</h2>

			<div>
				<label className="block mb-1 font-medium">Property Title</label>
				<input
					name="title"
					value={formData.title}
					onChange={handleInputChange}
					placeholder="Title"
					required
					className="w-full border p-3 rounded-md text-black"
				/>
			</div>

			<div>
				<label className="block mb-1 font-medium">Description</label>
				<textarea
					name="description"
					value={formData.description}
					onChange={handleInputChange}
					placeholder="Description"
					required
					className="w-full border p-3 rounded-md text-black"
				/>
			</div>

			<div>
				<label className="block mb-1 font-medium">Location</label>
				<AddressInput
					value={formData.location}
					onChange={(location) =>
						setFormData((prev) => ({ ...prev, location }))
					}
				/>
			</div>

			<div>
				<label className="block mb-1 font-medium">Property Type</label>
				<select
					name="propertyCategory"
					value={formData.propertyCategory}
					onChange={handleInputChange}
					className="w-full border p-3 rounded-md text-black"
				>
					<option value="">Select Property Type</option>
					<option value="land">Land</option>
					<option value="apartment">Apartment</option>
					<option value="house">House</option>
				</select>
			</div>

			{formData.propertyCategory && (
				<div>
					<label className="block mb-1 font-medium">Looking to:</label>
					<select
						name="intent"
						value={formData.intent}
						onChange={handleInputChange}
						className="w-full border p-3 rounded-md text-black"
					>
						<option value="">Choose an option</option>
						<option value="rent">Rent</option>
						<option value="sell">Sell</option>
						<option value="buy">Buy</option>
					</select>
				</div>
			)}

			{formData.intent === "rent" && (
				<div>
					<label className="block mb-1 font-medium">Rent Duration</label>
					<select
						name="duration"
						value={formData.duration}
						onChange={handleInputChange}
						className="w-full border p-3 rounded-md text-black"
					>
						<option value="">Select Duration</option>
						<option value="day">Per Day</option>
						<option value="week">Per Week</option>
						<option value="month">Per Month</option>
						<option value="year">Per Year</option>
					</select>
				</div>
			)}

			<div>
				<label className="block mb-1 font-medium">Price Type</label>
				<div className="flex gap-6">
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
			</div>

			{formData.priceType === "negotiable" ? (
				<div className="flex gap-4">
					<input
						type="number"
						name="priceRange.min"
						placeholder="Min Price"
						value={formData.priceRange.min}
						onChange={handleInputChange}
						className="w-1/2 border p-3 rounded-md text-black"
					/>
					<input
						type="number"
						name="priceRange.max"
						placeholder="Max Price"
						value={formData.priceRange.max}
						onChange={handleInputChange}
						className="w-1/2 border p-3 rounded-md text-black"
					/>
				</div>
			) : (
				<div className="flex items-center gap-2">
					<span className="text-xl font-semibold">₨</span>
					<input
						type="number"
						name="price"
						value={formData.price}
						onChange={handleInputChange}
						className="w-full border p-3 rounded-md text-black"
					/>
				</div>
			)}

			<div>
				<label className="block mb-1 font-medium">Upload Images</label>
				<input
					type="file"
					multiple
					accept="image/*"
					onChange={handlePictureChange}
					className="w-full text-black"
				/>
			</div>

			{preview.length > 0 && (
				<div className="grid grid-cols-2 gap-4">
					{preview.map((src, i) => (
						<div key={i} className="relative">
							<img src={src} className="w-full h-32 object-cover rounded-md" />
							<button
								type="button"
								onClick={() => handlePictureDelete(i)}
								className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded"
							>
								Delete
							</button>
						</div>
					))}
				</div>
			)}

			<button
				type="submit"
				disabled={loading}
				className="w-full bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700 transition duration-300"
			>
				{loading ? "Submitting..." : "Submit Post"}
			</button>
		</form>
	);
};
export default NewPost;
