import { useState } from "react";
import { showSuccess, showError } from "../../utils/toastUtils";
import AddressInput from "../../services/AddressInput";
import BASE_URL from "../../services";

interface FormDataTypes {
	title: string;
	description: string;
	location: string;
	price: string;
	priceType: string;
	negotiable: boolean;
	fixed: boolean;
	type: { rent: boolean; sell: boolean; buy: boolean };
}

const initialFormData: FormDataTypes = {
	title: "",
	description: "",
	location: "",
	price: "",
	priceType: "",
	negotiable: false,
	fixed: false,
	type: { rent: false, sell: false, buy: false },
};

const NewPost = () => {
	const [formData, setFormData] = useState<FormDataTypes>(initialFormData);
	const [preview, setPreview] = useState<string[] | null>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [pictures, setPictures] = useState<File[]>([]);

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value, type, checked } = e.target as HTMLInputElement;
		if (type === "checkbox") {
			if (name === "negotiable" || name === "fixed") {
				setFormData((prev) => ({ ...prev, [name]: checked }));
			} else {
				setFormData((prev) => ({
					...prev,
					type: { ...prev.type, [name]: checked },
				}));
			}
		} else {
			setFormData((prev) => ({ ...prev, [name]: value }));
		}
	};

	const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const filesArray = Array.from(e.target.files);
			setPictures(filesArray);
			const previewUrls = filesArray.map((file) => URL.createObjectURL(file));
			setPreview(previewUrls);
		}
	};

	const handlePictureDelete = (index: number) => {
		const updatedPreviews = preview?.filter((_, i) => i !== index) || [];
		const updatedPictures = pictures.filter((_, i) => i !== index);
		setPreview(updatedPreviews);
		setPictures(updatedPictures);
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);

		const postData = new FormData();

		Object.entries(formData).forEach(([key, value]) => {
			if (key === "type") {
				Object.entries(value).forEach(([typeKey, isSelected]) => {
					if (isSelected) {
						postData.append("type", typeKey);
					}
				});
			} else {
				postData.append(key, value as string);
			}
		});

		pictures.forEach((pic) => {
			postData.append("pictures", pic);
		});

		try {
			await BASE_URL.post("/api/users/post/new-post", postData);
			showSuccess("Post submitted successfully!");
			setFormData(initialFormData);
			setPreview(null);
			setPictures([]);
		} catch (error) {
			showError("Failed to submit post.");
		} finally {
			setLoading(false);
		}
	};

	const handleReset = () => {
		setFormData(initialFormData);
		setPreview(null);
		setPictures([]);
	};

	return (
		<div className="max-w-3xl mx-auto mt-12 px-8 py-10 bg-white/90 backdrop-blur-md shadow-2xl border border-sky-200 rounded-3xl transition-all duration-500">
			<h2 className="text-4xl font-bold text-center text-sky-700 mb-10 tracking-wide">
				Post Your Property 🏡
			</h2>

			<form onSubmit={handleSubmit} className="space-y-8 text-black">
				{/* Title */}
				<div>
					<label
						htmlFor="title"
						className="block mb-1 text-sm font-semibold text-black"
					>
						Property Title
					</label>
					<input
						type="text"
						id="title"
						name="title"
						value={formData.title}
						onChange={handleInputChange}
						required
						className="w-full px-4 py-3 text-sm text-black border  rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
						placeholder="e.g., 3 BHK Flat in New Baneshwor"
					/>
				</div>

				{/* Description */}
				<div>
					<label
						htmlFor="description"
						className="block mb-1 text-sm font-semibold text-black"
					>
						Description
					</label>
					<textarea
						id="description"
						name="description"
						value={formData.description}
						onChange={handleInputChange}
						required
						className="w-full px-4 py-3 text-sm text-black border  rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none h-28"
						placeholder="Write something about the property..."
					/>
				</div>

				{/* Location */}
				<div>
					<label className="block mb-1 text-sm font-semibold ">Location</label>
					<AddressInput
						value={formData.location}
						onChange={(location) =>
							setFormData((prev) => ({ ...prev, location }))
						}
					/>
				</div>

				{/* Price */}
				<div>
					<label className="block mb-1 text-sm font-semibold ">Price</label>
					<div className="flex items-center gap-4">
						<input
							type="number"
							name="price"
							value={formData.price}
							onChange={handleInputChange}
							required
							className="w-1/2 px-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
							placeholder="e.g. 3500000"
						/>
						<div className="flex items-center gap-3">
							<label className="flex items-center gap-1 text-sm">
								<input
									type="radio"
									name="priceType"
									value="negotiable"
									checked={formData.priceType === "negotiable"}
									onChange={handleInputChange}
									className="accent-sky-500"
								/>
								Negotiable
							</label>
							<label className="flex items-center gap-1  text-sm">
								<input
									type="radio"
									name="priceType"
									value="fixed"
									checked={formData.priceType === "fixed"}
									onChange={handleInputChange}
									className="accent-sky-500"
								/>
								Fixed
							</label>
						</div>
					</div>
				</div>

				{/* Type */}
				<div>
					<label className="block mb-1 text-sm font-semibold ">
						Listing Type
					</label>
					<div className="flex gap-4">
						{["rent", "sell", "buy"].map((option) => (
							<label key={option} className="flex items-center gap-2  text-sm">
								<input
									type="checkbox"
									name={option}
									checked={formData.type[option as keyof typeof formData.type]}
									onChange={handleInputChange}
									className="form-checkbox "
								/>
								{option.charAt(0).toUpperCase() + option.slice(1)}
							</label>
						))}
					</div>
				</div>

				{/* Image Upload */}
				<div>
					<label
						htmlFor="pictures"
						className="px-5 py-2 text-sm font-semibold text-white bg-sky-500 hover:bg-sky-600 rounded-md cursor-pointer transition"
					>
						Upload Property Pictures
					</label>
					<input
						type="file"
						id="pictures"
						name="pictures"
						multiple
						accept="image/*"
						onChange={handlePictureChange}
						className="w-full h-full opacity-0 cursor-pointer"
					/>
					{preview && preview.length > 0 && (
						<div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
							{preview.map((url, index) => (
								<div
									key={index}
									className="relative group rounded-lg overflow-hidden shadow-md border border-gray-200"
								>
									<img
										src={url}
										alt={`Preview ${index + 1}`}
										className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
									/>
									<button
										type="button"
										onClick={() => handlePictureDelete(index)}
										className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs rounded-md shadow-md hover:bg-red-600"
									>
										Delete
									</button>
								</div>
							))}
						</div>
					)}
				</div>

				{/* Buttons */}
				<div className="flex justify-end gap-4 pt-4">
					<button
						type="button"
						onClick={handleReset}
						className="px-5 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition"
					>
						Reset
					</button>
					<button
						type="submit"
						disabled={loading}
						className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-sky-500 to-blue-600 rounded-md shadow-md hover:from-sky-600 hover:to-blue-700 transition"
					>
						{loading ? "Submitting..." : "Submit Post"}
					</button>
				</div>
			</form>
		</div>
	);
};

export default NewPost;
