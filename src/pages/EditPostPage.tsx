import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import BASE_URL from "../services";

const EditPostPage = () => {
	const { id } = useParams();
	const [post, setPost] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Fetch post details by ID
		const fetchPost = async () => {
			const res = await BASE_URL.get(`/api/user/post/get-post/${id}`);
			setPost(res.data.post);
			setLoading(false);
		};
		fetchPost();
	}, [id]);

	if (loading) return <div>Loading...</div>;
	if (!post) return <div>Post not found</div>;

	// Render the correct form based on post.intent
	return <div>Edit Post Here</div>;
};

export default EditPostPage;
