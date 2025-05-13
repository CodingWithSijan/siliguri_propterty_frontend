import { FormDataTypes } from "../../../../../types/postTypes";
import { Button } from "../../../../ui/button";

export default function ReviewStep({
	formData,
	onBack,
}: {
	formData: FormDataTypes;
	onBack: () => void;
}) {
	const handleSubmit = () => {
		console.log("Submitting post:", formData);
		alert("Post submitted successfully!");
	};

	return (
		<div>
			<h2 className="text-xl font-bold mb-4">Review Your Submission</h2>
			<pre className="bg-gray-100 rounded p-4">
				{JSON.stringify(formData, null, 2)}
			</pre>

			<div className="flex justify-between mt-4">
				<Button variant="outline" onClick={onBack}>
					Back
				</Button>
				<Button onClick={handleSubmit}>Submit</Button>
			</div>
		</div>
	);
}
