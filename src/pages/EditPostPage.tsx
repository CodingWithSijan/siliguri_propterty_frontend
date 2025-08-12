import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import BASE_URL from "../services";
import { IUniversalListingType } from "../types/listingTypes";
import EditPostStepperForm from "../components/post_form/EditPostStepperForm";
import { showError } from "../utils/toastUtils";

const EditPostPage = () => {
	const { id } = useParams();
	const [post, setPost] = useState<IUniversalListingType | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Fetch post details by ID
		const fetchPost = async () => {
			try {
				const res = await BASE_URL.get(`/api/user/post/get-post/${id}`);
				setPost(res.data.post);
			} catch {
				showError("Failed to fetch post details");
			} finally {
				setLoading(false);
			}
		};

		if (id) {
			fetchPost();
		}
	}, [id]);

	if (loading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
				<div className="text-center">
					<div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
					<p className="text-lg text-gray-600">Loading post details...</p>
				</div>
			</div>
		);
	}

	if (!post) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-gray-900 mb-2">
						Post not found
					</h1>
					<p className="text-gray-600">
						The post you're looking for doesn't exist or has been removed.
					</p>
				</div>
			</div>
		);
	}

	// Check if post can be edited (only pending posts)
	if (post.approvalStatus !== "pending") {
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
				<div className="text-center max-w-md mx-auto p-8">
					<h1 className="text-2xl font-bold text-gray-900 mb-4">
						Cannot Edit Post
					</h1>
					<div className="bg-white rounded-lg p-6 shadow-lg">
						<p className="text-gray-600 mb-4">
							This post has been{" "}
							<span className="font-semibold text-{post.approvalStatus === 'approved' ? 'green' : 'red'}-600">
								{post.approvalStatus.toUpperCase()}
							</span>{" "}
							and cannot be edited.
						</p>
						<p className="text-sm text-gray-500">
							{post.approvalStatus === "approved"
								? "Approved posts cannot be modified. Contact support if changes are needed."
								: "Rejected posts cannot be edited. You may create a new post instead."}
						</p>
					</div>
				</div>
			</div>
		);
	}

	// Render the correct form based on post.intent
	return (
		<EditPostStepperForm intent={post.intent} initialData={post} postId={id!} />
	);
};

export default EditPostPage;
