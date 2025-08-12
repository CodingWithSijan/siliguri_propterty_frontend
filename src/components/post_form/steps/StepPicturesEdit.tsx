// File: components/PostForm/steps/StepPicturesEdit.tsx

// Enhanced step for uploading and previewing property pictures in the edit form.
// Handles existing images, new file uploads, and image management.

import { useFormContext, useWatch } from "react-hook-form";
import { Input } from "../../ui/input";
import { Trash2, Plus, ImageIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface StepPicturesEditProps {
	existingPictures?: string[];
}

const StepPicturesEdit: React.FC<StepPicturesEditProps> = ({
	existingPictures = [],
}) => {
	const { setValue, getValues, control } = useFormContext();

	// State for existing images that should be kept
	const [keptExistingImages, setKeptExistingImages] =
		useState<string[]>(existingPictures);

	// State for new files
	const [newFiles, setNewFiles] = useState<File[]>(() => {
		const existing = getValues("pictures") as FileList | undefined;
		return existing ? Array.from(existing) : [];
	});

	const watchedPictures = useWatch({ control, name: "pictures" });
	const [newPreviews, setNewPreviews] = useState<string[]>([]);

	// Update form with kept existing images
	useEffect(() => {
		setValue("existingPictures", keptExistingImages, { shouldValidate: true });
	}, [keptExistingImages, setValue]);

	useEffect(() => {
		if (!watchedPictures || watchedPictures.length === 0) {
			setNewFiles([]);
			setNewPreviews([]);
		}
	}, [watchedPictures]);

	useEffect(() => {
		const urls = newFiles.map((file) => URL.createObjectURL(file));
		setNewPreviews(urls);
		return () => urls.forEach((url) => URL.revokeObjectURL(url));
	}, [newFiles]);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
		const fileMap = new Map(newFiles.map((f) => [f.name, f]));
		selectedFiles.forEach((f) => fileMap.set(f.name, f));
		const combined = Array.from(fileMap.values());
		setNewFiles(combined);

		const dt = new DataTransfer();
		combined.forEach((file) => dt.items.add(file));
		setValue("pictures", dt.files, { shouldValidate: true });
	};

	const removeExistingImage = (index: number) => {
		const updated = keptExistingImages.filter((_, idx) => idx !== index);
		setKeptExistingImages(updated);
	};

	const removeNewImage = (index: number) => {
		const updated = newFiles.filter((_, idx) => idx !== index);
		setNewFiles(updated);
		const dt = new DataTransfer();
		updated.forEach((file) => dt.items.add(file));
		setValue("pictures", dt.files, { shouldValidate: true });
	};

	const totalImages = keptExistingImages.length + newFiles.length;

	return (
		<div className="space-y-6">
			<div>
				<label className="block text-lg font-semibold mb-3 text-gray-900">
					Property Pictures
				</label>
				<p className="text-sm text-gray-600 mb-4">
					Manage your existing images and add new ones. You can upload up to 10
					images total.
				</p>
			</div>

			{/* Existing Images Section */}
			{keptExistingImages.length > 0 && (
				<div className="space-y-3">
					<h3 className="text-md font-medium text-gray-700 flex items-center gap-2">
						<ImageIcon size={18} />
						Current Images ({keptExistingImages.length})
					</h3>
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
						{keptExistingImages.map((imageUrl, idx) => (
							<div key={`existing-${idx}`} className="relative group">
								<div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-100">
									<img
										src={imageUrl}
										alt={`Existing image ${idx + 1}`}
										className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
										onError={(e) => {
											const target = e.target as HTMLImageElement;
											target.src =
												"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIxIDlWN0MxOSA1IDE3IDUgMTUgNUg5QzcgNSA1IDUgMyA3VjlNMjEgOVYxN0MxOSAxOSAxNyAxOSAxNSAxOUg5QzcgMTkgNSAxOSAzIDE3VjlNMjEgOUgzTTkgMTNMMTIgMTZMMTkgOSIgc3Ryb2tlPSIjOTk5IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4=";
										}}
									/>
								</div>
								<button
									type="button"
									className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg transition-colors group-hover:scale-110"
									onClick={() => removeExistingImage(idx)}
									title="Remove image"
								>
									<Trash2 size={14} />
								</button>
							</div>
						))}
					</div>
				</div>
			)}

			{/* New Images Section */}
			{newFiles.length > 0 && (
				<div className="space-y-3">
					<h3 className="text-md font-medium text-gray-700 flex items-center gap-2">
						<Plus size={18} />
						New Images ({newFiles.length})
					</h3>
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
						{newPreviews.map((src, idx) => (
							<div key={`new-${idx}`} className="relative group">
								<div className="aspect-square rounded-lg overflow-hidden border-2 border-blue-200 bg-blue-50">
									<img
										src={src}
										alt={`New image ${idx + 1}`}
										className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
									/>
								</div>
								<button
									type="button"
									className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg transition-colors group-hover:scale-110"
									onClick={() => removeNewImage(idx)}
									title="Remove image"
								>
									<Trash2 size={14} />
								</button>
								<div className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded">
									NEW
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Add Images Section */}
			<div className="space-y-3">
				<h3 className="text-md font-medium text-gray-700">
					Add More Images {totalImages > 0 && `(${totalImages}/10)`}
				</h3>

				<div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-400 transition-colors">
					<div className="text-center">
						<Plus className="mx-auto h-12 w-12 text-gray-400 mb-3" />
						<div className="mb-4">
							<label htmlFor="picture-upload" className="cursor-pointer">
								<span className="text-sm font-medium text-blue-600 hover:text-blue-500">
									Click to upload images
								</span>
								<span className="text-sm text-gray-500"> or drag and drop</span>
							</label>
						</div>
						<p className="text-xs text-gray-500">
							PNG, JPG, GIF up to 10MB each
						</p>
					</div>

					<Input
						id="picture-upload"
						type="file"
						multiple
						accept="image/*"
						onChange={handleFileChange}
						className="hidden"
						disabled={totalImages >= 10}
					/>
				</div>

				{totalImages >= 10 && (
					<div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
						<p className="text-sm text-amber-800">
							Maximum of 10 images allowed. Remove some images to add new ones.
						</p>
					</div>
				)}
			</div>

			{/* Image Count Summary */}
			{totalImages > 0 && (
				<div className="bg-gray-50 rounded-lg p-4">
					<div className="flex items-center justify-between">
						<span className="text-sm font-medium text-gray-700">
							Total Images: {totalImages}
						</span>
						<div className="flex gap-4 text-xs text-gray-500">
							{keptExistingImages.length > 0 && (
								<span>Current: {keptExistingImages.length}</span>
							)}
							{newFiles.length > 0 && <span>New: {newFiles.length}</span>}
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default StepPicturesEdit;
