import React from "react";
import Layout from "../components/adminComponents/Layout";
import { Outlet } from "react-router-dom";

const AdminDashboardPage: React.FC = () => {
	return (
		<Layout>
			<Outlet />
		</Layout>
	);
};

export default AdminDashboardPage;
