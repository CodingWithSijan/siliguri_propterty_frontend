import React from "react";
import { FiTrash2 } from "react-icons/fi";
import { FormDataTypes } from "../../../types/PostForm.types";

interface Props {
	preview: string[];
	setPreview: React.Dispatch<React.SetStateAction<string[]>>;
	updateField: <K extends keyof FormDataTypes>(
		key: K,
		value: FormDataTypes[K]
	) => void;
}

const ImagePreviewGrid: React.FC<Props> = ({
	preview,
	setPreview,
	updateField,
}) => {
	const handleDelete = (index: number) => {
		setPreview((prev) => prev.filter((_, i) => i !== index));

		updateField("pictures", (prevPics) =>
			(prevPics as File[]).filter((_, i) => i !== index)
		);
	};

	return (
		<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
			{preview.map((img, i) => (
				<div key={i} className="relative">
					<img
						src={img}
						alt={`Preview ${i}`}
						className="w-full h-28 object-cover rounded-md"
					/>
					<button
						type="button"
						onClick={() => handleDelete(i)}
						className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1"
					>
						<FiTrash2 size={16} />
					</button>
				</div>
			))}
		</div>
	);
};

export default ImagePreviewGrid;
