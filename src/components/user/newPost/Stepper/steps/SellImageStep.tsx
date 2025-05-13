import React, { useState } from "react";
import { Button } from "../../../../ui/button";

interface SellImageStepProps {
	pictures: File[];
	updatePictures: (pictures: File[]) => void;
	onNext: () => void;
	onBack: () => void;
}

const SellImageStep: React.FC<SellImageStepProps> = ({
	pictures,
	updatePictures,
	onNext,
	onBack,
}) => {
	const [previewImages, setPreviewImages] = useState<string[]>(
		pictures.map((file) => URL.createObjectURL(file))
	);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const newFiles = Array.from(e.target.files);
			updatePictures([...pictures, ...newFiles]);
			setPreviewImages([
				...previewImages,
				...newFiles.map((file) => URL.createObjectURL(file)),
			]);
		}
	};

	const handleRemoveImage = (index: number) => {
		const updatedPictures = pictures.filter((_, i) => i !== index);
		updatePictures(updatedPictures);
		setPreviewImages(previewImages.filter((_, i) => i !== index));
	};

	return (
		<div>
			<h2 className="text-xl font-bold mb-4">Upload Property Pictures</h2>
			<input
				type="file"
				accept="image/*"
				multiple
				onChange={handleFileChange}
				className="mb-4"
			/>

			<div className="grid grid-cols-3 gap-4">
				{previewImages.map((src, index) => (
					<div key={index} className="relative">
						<img
							src={src}
							alt={`Preview ${index + 1}`}
							className="w-full h-32 object-cover rounded-md"
						/>
						<button
							onClick={() => handleRemoveImage(index)}
							className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
						>
							&times;
						</button>
					</div>
				))}
			</div>

			<div className="flex justify-between mt-4">
				<Button variant="outline" onClick={onBack}>
					Back
				</Button>
				<Button onClick={onNext}>Next</Button>
			</div>
		</div>
	);
};

export default SellImageStep;
