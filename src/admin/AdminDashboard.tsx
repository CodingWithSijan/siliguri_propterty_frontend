import React, { useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { FaUsers, FaClipboardList } from "react-icons/fa";
import BASE_URL from "../services";
import { showError } from "../utils/toastUtils";
import Navbar from "../header_and_footer/Navbar";

const AdminDashboard: React.FC = () => {
	const [userCount, setUserCount] = useState<number>(0);
	const [postCount, setPostCount] = useState<number>(0);
	const [users, setUsers] = useState<any[]>([]);
	const [posts, setPosts] = useState<any[]>([]);
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		const fetchStats = async () => {
			try {
				setLoading(true);
				const userResponse = await BASE_URL.get("/api/admin/users");
				const postResponse = await BASE_URL.get("/api/admin/posts");
				setUserCount(userResponse.data.count);
				setPostCount(postResponse.data.count);
				setUsers(userResponse.data.users);
				setPosts(postResponse.data.posts);
			} catch (error) {
				showError("Failed to fetch data.");
			} finally {
				setLoading(false);
			}
		};
		fetchStats();
	}, []);

	const handleDeleteUser = async (userId: string) => {
		try {
			await BASE_URL.delete(`/api/admin/users/${userId}`);
			setUsers((prev) => prev.filter((user) => user.id !== userId));
		} catch (error) {
			showError("Failed to delete user.");
		}
	};

	const handleDeletePost = async (postId: string) => {
		try {
			await BASE_URL.delete(`/api/admin/posts/${postId}`);
			setPosts((prev) => prev.filter((post) => post.id !== postId));
		} catch (error) {
			showError("Failed to delete post.");
		}
	};

	return (
		<div className="p-6 bg-gray-50 min-h-screen text-black">
			<Navbar />
			<h1 className="text-3xl font-bold text-center mb-6">Admin Dashboard</h1>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
				<div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4">
					<FaUsers className="text-blue-600 text-4xl" />
					<div>
						<h2 className="text-xl font-semibold">Total Users</h2>
						<p className="text-2xl font-bold">{userCount}</p>
					</div>
				</div>
				<div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4">
					<FaClipboardList className="text-green-600 text-4xl" />
					<div>
						<h2 className="text-xl font-semibold">Total Posts</h2>
						<p className="text-2xl font-bold">{postCount}</p>
					</div>
				</div>
			</div>

			<Tabs selectedTabClassName="!bg-sky-600 !text-white !rounded-t-md">
				<TabList className="flex space-x-4 border-b border-gray-300 mb-4">
					<Tab className="px-6 py-2 cursor-pointer bg-white border rounded-t-md text-black shadow hover:bg-sky-100">
						All Users
					</Tab>
					<Tab className="px-6 py-2 cursor-pointer bg-white border rounded-t-md text-black shadow hover:bg-sky-100">
						All Posts
					</Tab>
				</TabList>

				<TabPanel>
					<h2 className="text-2xl font-bold mb-4">Manage Users</h2>
					{loading ? (
						<p>Loading users...</p>
					) : (
						<table className="w-full bg-white rounded-lg shadow-md text-sm text-gray-800">
							<thead>
								<tr className="bg-sky-100 text-sky-800">
									<th className="p-4 text-left font-semibold">Name</th>
									<th className="p-4 text-left font-semibold">Email</th>
									<th className="p-4 text-left font-semibold">Actions</th>
								</tr>
							</thead>
							<tbody>
								{users.map((user) => (
									<tr key={user.id} className="border-b hover:bg-gray-50">
										<td className="p-4">{user.name}</td>
										<td className="p-4">{user.email}</td>
										<td className="p-4">
											<button
												onClick={() => handleDeleteUser(user.id)}
												className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
											>
												Delete
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					)}
				</TabPanel>

				<TabPanel>
					<h2 className="text-2xl font-bold mb-4">Manage Posts</h2>
					{loading ? (
						<p>Loading posts...</p>
					) : (
						<table className="w-full bg-white rounded-lg shadow-md text-sm text-gray-800">
							<thead>
								<tr className="bg-sky-100 text-sky-800">
									<th className="p-4 text-left font-semibold">Title</th>
									<th className="p-4 text-left font-semibold">Location</th>
									<th className="p-4 text-left font-semibold">Actions</th>
								</tr>
							</thead>
							<tbody>
								{posts.map((post) => (
									<tr key={post.id} className="border-b hover:bg-gray-50">
										<td className="p-4">{post.title}</td>
										<td className="p-4">{post.location}</td>
										<td className="p-4">
											<button
												onClick={() => handleDeletePost(post.id)}
												className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
											>
												Delete
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					)}
				</TabPanel>
			</Tabs>
		</div>
	);
};

export default AdminDashboard;
