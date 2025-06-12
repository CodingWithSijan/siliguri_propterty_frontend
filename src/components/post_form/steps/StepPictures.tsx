// File: components/PostForm/steps/StepPictures.tsx

// Step for uploading and previewing property pictures in the post form.
// Handles file selection, preview, and validation.

import { useFormContext, useWatch } from "react-hook-form";
import { Input } from "../../ui/input";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

const StepPictures = () => {
	const { setValue, getValues, control } = useFormContext();
	const [files, setFiles] = useState<File[]>(() => {
		const existing = getValues("pictures") as FileList | undefined;
		return existing ? Array.from(existing) : [];
	});
	const watchedPictures = useWatch({ control, name: "pictures" });
	const [previews, setPreviews] = useState<string[]>([]);
	useEffect(() => {
		if (!watchedPictures || watchedPictures.length === 0) {
			setFiles([]);
			setPreviews([]);
		}
	}, [watchedPictures]);
	useEffect(() => {
		const urls = files.map((file) => URL.createObjectURL(file));
		setPreviews(urls);
		return () => urls.forEach((url) => URL.revokeObjectURL(url));
	}, [files]);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newFiles = e.target.files ? Array.from(e.target.files) : [];
		const fileMap = new Map(files.map((f) => [f.name, f]));
		newFiles.forEach((f) => fileMap.set(f.name, f));
		const combined = Array.from(fileMap.values());
		setFiles(combined);
		const dt = new DataTransfer();
		combined.forEach((file) => dt.items.add(file));
		setValue("pictures", dt.files, { shouldValidate: true });
	};

	const removeImage = (index: number) => {
		const updated = files.filter((_, idx) => idx !== index);
		setFiles(updated);
		const dt = new DataTransfer();
		updated.forEach((file) => dt.items.add(file));
		setValue("pictures", dt.files, { shouldValidate: true });
	};

	return (
		<div className="space-y-4">
			<label className="block font-medium mb-1">Pictures</label>
			<Input
				type="file"
				multiple
				accept="image/*"
				onChange={handleFileChange}
			/>
			{previews.length > 0 && (
				<div className="flex flex-wrap gap-2 mt-2">
					{previews.map((src, idx) => (
						<div key={idx} className="relative w-20 h-20">
							<img
								src={src}
								alt={`preview-${idx}`}
								className="w-20 h-20 object-cover rounded border"
							/>
							<button
								type="button"
								className="absolute top-0 right-0 bg-white bg-opacity-80 rounded-full p-1 hover:bg-red-500 hover:text-white transition"
								onClick={() => removeImage(idx)}
								tabIndex={-1}
							>
								<Trash2 size={16} className="text-red-500 hover:text-white" />
							</button>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default StepPictures;
