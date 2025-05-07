// import React from "react";
// import {
// 	Card,
// 	Title,
// 	Table,
// 	TableHead,
// 	TableRow,
// 	TableHeaderCell,
// 	TableBody,
// 	TableCell,
// 	Button,
// } from "@tremor/react";

// const ManagePosts: React.FC = () => {
// 	// Dummy data for posts
// 	const posts = [
// 		{
// 			id: 1,
// 			title: "Beautiful Apartment",
// 			author: "John Doe",
// 			status: "Published",
// 		},
// 		{ id: 2, title: "Cozy House", author: "Jane Smith", status: "Draft" },
// 		{
// 			id: 3,
// 			title: "Spacious Land",
// 			author: "Alice Johnson",
// 			status: "Published",
// 		},
// 	];

// 	const handleEdit = (id: number) => {
// 		console.log(`Edit post with ID: ${id}`);
// 	};

// 	const handleDelete = (id: number) => {
// 		console.log(`Delete post with ID: ${id}`);
// 	};

// 	return (
// 		<Card>
// 			<Title>Manage Posts</Title>
// 			<Table className="mt-4">
// 				<TableHead>
// 					<TableRow>
// 						<TableHeaderCell>ID</TableHeaderCell>
// 						<TableHeaderCell>Title</TableHeaderCell>
// 						<TableHeaderCell>Author</TableHeaderCell>
// 						<TableHeaderCell>Status</TableHeaderCell>
// 						<TableHeaderCell>Actions</TableHeaderCell>
// 					</TableRow>
// 				</TableHead>
// 				<TableBody>
// 					{posts.map((post) => (
// 						<TableRow key={post.id}>
// 							<TableCell>{post.id}</TableCell>
// 							<TableCell>{post.title}</TableCell>
// 							<TableCell>{post.author}</TableCell>
// 							<TableCell>{post.status}</TableCell>
// 							<TableCell>
// 								<Button size="xs" onClick={() => handleEdit(post.id)}>
// 									Edit
// 								</Button>
// 								<Button
// 									size="xs"
// 									color="red"
// 									onClick={() => handleDelete(post.id)}
// 								>
// 									Delete
// 								</Button>
// 							</TableCell>
// 						</TableRow>
// 					))}
// 				</TableBody>
// 			</Table>
// 		</Card>
// 	);
// };

// export default ManagePosts;
