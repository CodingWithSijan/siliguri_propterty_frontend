// app/new-post/page.tsx or src/pages/NewPost.tsx (depends on Next.js structure)

import StepperForm from "../../components/user/newPost/Stepper/StepperForm";

export default function NewPost() {
	return (
		<main className="p-6 max-w-4xl mx-auto">
			<h1 className="text-2xl font-bold mb-6">Create a New Post</h1>
			<StepperForm />
		</main>
	);
}
