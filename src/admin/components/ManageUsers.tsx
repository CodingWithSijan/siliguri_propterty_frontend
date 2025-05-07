import React from "react";
import {
	Card,
	Title,
	Table,
	TableHead,
	TableRow,
	TableHeaderCell,
	TableBody,
	TableCell,
	Badge,
	Button,
} from "@tremor/react";

const ManageUsers: React.FC = () => {
	// Dummy data for users
	const users = [
		{
			id: 1,
			name: "John Doe",
			email: "john.doe@example.com",
			role: "Admin",
			status: "Active",
		},
		{
			id: 2,
			name: "Jane Smith",
			email: "jane.smith@example.com",
			role: "User",
			status: "Inactive",
		},
		{
			id: 3,
			name: "Alice Johnson",
			email: "alice.johnson@example.com",
			role: "User",
			status: "Active",
		},
	];

	const handleEdit = (id: number) => {
		console.log(`Edit user with ID: ${id}`);
	};

	const handleDelete = (id: number) => {
		console.log(`Delete user with ID: ${id}`);
	};

	return (
		<Card>
			<Title>Manage Users</Title>
			<Table className="mt-4">
				<TableHead>
					<TableRow>
						<TableHeaderCell>ID</TableHeaderCell>
						<TableHeaderCell>Name</TableHeaderCell>
						<TableHeaderCell>Email</TableHeaderCell>
						<TableHeaderCell>Role</TableHeaderCell>
						<TableHeaderCell>Status</TableHeaderCell>
						<TableHeaderCell>Actions</TableHeaderCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{users.map((user) => (
						<TableRow key={user.id}>
							<TableCell>{user.id}</TableCell>
							<TableCell>{user.name}</TableCell>
							<TableCell>{user.email}</TableCell>
							<TableCell>{user.role}</TableCell>
							<TableCell>
								<Badge color={user.status === "Active" ? "green" : "red"}>
									{user.status}
								</Badge>
							</TableCell>
							<TableCell>
								<Button size="xs" onClick={() => handleEdit(user.id)}>
									Edit
								</Button>
								<Button
									size="xs"
									color="red"
									onClick={() => handleDelete(user.id)}
								>
									Delete
								</Button>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</Card>
	);
};

export default ManageUsers;
