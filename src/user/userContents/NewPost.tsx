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
			await BASE_URL.post("/api/users/new-post", postData);
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
		<div className="max-w-2xl mx-auto mt-8 p-6 shadow-md bg-white rounded-md">
			<h2 className="text-2xl font-bold mb-4 text-center">
				New Real Estate Post
			</h2>
			<form onSubmit={handleSubmit} className="space-y-4 text-black">
				{/* Title */}
				<div>
					<label
						htmlFor="title"
						className="block text-sm font-medium text-sky-500"
					>
						Title
					</label>
					<input
						type="text"
						id="title"
						name="title"
						value={formData.title}
						onChange={handleInputChange}
						required
						className="w-full px-4 py-2 mt-1 text-sm border rounded-md border-sky-500 focus:ring-sky-500 focus:border-sky-500"
						placeholder="Enter the title"
					/>
				</div>

				{/* Description */}
				<div>
					<label
						htmlFor="description"
						className="block text-sm font-medium text-sky-500"
					>
						Description
					</label>
					<textarea
						id="description"
						name="description"
						value={formData.description}
						onChange={handleInputChange}
						required
						className="w-full px-4 py-2 mt-1 text-sm border rounded-md border-sky-500 focus:ring-sky-500 focus:border-sky-500"
						placeholder="Enter the description"
					></textarea>
				</div>

				{/* Location */}
				<div>
					<label
						htmlFor="location"
						className="block text-sm font-medium text-sky-500"
					>
						Location
					</label>
					<AddressInput
						value={formData.location}
						onChange={(location) =>
							setFormData((prev) => ({ ...prev, location }))
						}
					/>
				</div>

				{/* Price & Type */}
				<div>
					<label
						htmlFor="price"
						className="block text-sm font-medium text-sky-500"
					>
						Price
					</label>
					<div className="flex items-center space-x-4">
						<input
							type="number"
							id="price"
							name="price"
							value={formData.price}
							onChange={handleInputChange}
							required
							className="w-[40%] px-4 py-2 mt-1 text-sm border rounded-md border-sky-500 focus:ring-sky-500 focus:border-sky-500"
							placeholder="Enter the price"
						/>
						<div className="flex items-center space-x-4">
							<label className="flex items-center space-x-1">
								<input
									type="radio"
									name="priceType"
									value="negotiable"
									checked={formData.priceType === "negotiable"}
									onChange={handleInputChange}
									className=""
								/>
								<span className="text-sky-500">Negotiable</span>
							</label>
							<label className="flex items-center space-x-1">
								<input
									type="radio"
									name="priceType"
									value="fixed"
									checked={formData.priceType === "fixed"}
									onChange={handleInputChange}
									className="accent-white"
								/>
								<span className="text-sky-500">Fixed</span>
							</label>
						</div>
					</div>
				</div>

				{/* Pictures */}
				<div>
					<label
						htmlFor="pictures"
						className="block text-sm font-medium text-sky-500"
					>
						Pictures
					</label>
					<input
						type="file"
						id="picture"
						name="pictures"
						multiple
						accept="image/*"
						onChange={handlePictureChange}
						className="block w-auto text-sm text-white bg-sky-500 border p-2 rounded-md cursor-pointer focus:outline-none"
					/>
					{preview && preview.length > 0 && (
						<div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
							{preview.map((url, index) => (
								<div key={index} className="relative">
									<img
										src={url}
										alt={`Preview ${index + 1}`}
										className="w-full h-40 object-cover rounded-md"
									/>
									<button
										type="button"
										onClick={() => handlePictureDelete(index)}
										className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs rounded-md"
									>
										Delete
									</button>
								</div>
							))}
						</div>
					)}
				</div>

				{/* Type */}
				<div>
					<label className="block text-sm font-medium text-sky-500">Type</label>
					<div className="flex items-center space-x-4">
						{["rent", "sell", "buy"].map((option) => (
							<label key={option} className="flex items-center space-x-1">
								<input
									type="checkbox"
									name={option}
									checked={formData.type[option as keyof typeof formData.type]}
									onChange={handleInputChange}
									className="form-checkbox"
								/>
								<span className="text-sky-500 capitalize">{option}</span>
							</label>
						))}
					</div>
				</div>

				{/* Buttons */}
				<div className="flex justify-end space-x-4">
					<button
						type="button"
						onClick={handleReset}
						className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
					>
						Reset Post
					</button>
					<button
						type="submit"
						disabled={loading}
						className="px-4 py-2 text-sm font-medium text-white bg-sky-500 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
					>
						{loading ? "Submitting..." : "Submit Post"}
					</button>
				</div>
			</form>
		</div>
	);
};

export default NewPost;
