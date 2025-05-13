import { FormDataTypes } from "../../../../../types/postTypes";
import { Button } from "../../../../ui/button";

export default function ReviewStep({
	formData,
	onBack,
}: {
	formData: FormDataTypes;
	onBack: () => void;
}) {
	return (
		<div>
			<h2 className="text-xl font-bold mb-4">Review Your Submission</h2>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<p className="font-bold">Intent:</p>
					<p>{formData.intent}</p>
				</div>
				<div>
					<p className="font-bold">Title:</p>
					<p>{formData.title}</p>
				</div>
				<div>
					<p className="font-bold">Description:</p>
					<p>{formData.description}</p>
				</div>
				<div>
					<p className="font-bold">Location:</p>
					<p>{formData.location}</p>
				</div>
				{formData.intent === "sell" && (
					<>
						<div>
							<p className="font-bold">Price:</p>
							<p>{formData.price}</p>
						</div>
						<div>
							<p className="font-bold">Price Type:</p>
							<p>{formData.priceType}</p>
						</div>
						<div>
							<p className="font-bold">Property Category:</p>
							<p>{formData.propertyCategory}</p>
						</div>
						{formData.unit && (
							<div>
								<p className="font-bold">Unit:</p>
								<p>{formData.unit}</p>
							</div>
						)}
						<div>
							<p className="font-bold">Uploaded Images:</p>
							<div className="grid grid-cols-3 gap-4">
								{formData.pictures.map((file, index) => (
									<img
										key={index}
										src={URL.createObjectURL(file)}
										alt={`Uploaded ${index + 1}`}
										className="w-full h-32 object-cover rounded-md"
									/>
								))}
							</div>
						</div>
					</>
				)}
				{formData.intent === "buy" && (
					<div>
						<p className="font-bold">Budget:</p>
						<p>{formData.budget}</p>
					</div>
				)}
				{formData.intent === "rent" && (
					<>
						<div>
							<p className="font-bold">Rent Role:</p>
							<p>{formData.rentRole}</p>
						</div>
						<div>
							<p className="font-bold">Budget:</p>
							<p>{formData.budget}</p>
						</div>
						<div>
							<p className="font-bold">Duration:</p>
							<p>{formData.duration}</p>
						</div>
					</>
				)}
			</div>

			<div className="flex justify-between mt-4">
				<Button variant="outline" onClick={onBack}>
					Back
				</Button>
				<Button
					onClick={() => {
						console.log("Submitting post:", formData);
						alert("Post submitted successfully!");
					}}
				>
					Submit
				</Button>
			</div>
		</div>
	);
}
