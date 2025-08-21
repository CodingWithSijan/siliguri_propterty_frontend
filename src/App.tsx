import React from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import ProtectedRoute from "./route/ProtectedRoute";
import Signup from "./pages/Signup";
import Homepage from "./pages/Homepage";
import SignupLocalComponent from "./components/signup/SignupLocalComponent";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Login";
import DashboardLayout from "./user/DashboardLayout";
import NotFound404 from "./components/homepage/NotFound404";
import VerifyEmail from "./components/homepage/VerifyEmail";
import NewPost from "./user/dashboard/NewPost";
import ViewYourListings from "./user/dashboard/ViewYourListings";
import ScrollToTopButton from "./components/common/scrollToTopButton";
import PostStepperForm from "./components/post_form/PostStepperForm";
import YourProfile from "./user/dashboard/YourProfile";
import EditPostPage from "./pages/EditPostPage";
import RentalProperties from "./pages/RentalProperties";
import SaleProperties from "./pages/SaleProperties";
import AboutUs from "./components/homepage/AboutUs";
import RentalPropertyDetails from "./pages/RentalPropertyDetails";
import SellPropertyDetails from "./pages/SellPropertyDetails";
import AllListings from "./pages/AllListings";
import ResetPassword from "./pages/ResetPassword";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import HomeTab from "./components/adminComponents/HomeTab";
import ManagePosts from "./components/adminComponents/ManagePosts";
import ManageUsers from "./components/adminComponents/ManageUsers";
import ViewUser from "./components/adminComponents/ViewUser";
import ViewPost from "./components/adminComponents/ViewPost";

const App: React.FC = () => {
	return (
		<Router>
			<ScrollToTopButton />

			<Routes>
				{/* Homepage & Info */}
				<Route path="/" element={<Homepage />} />
				<Route path="/about" element={<AboutUs />} />

				{/* Rental Property Routes */}
				<Route path="/rentals" element={<RentalProperties />} />
				<Route path="/rentals/:id" element={<RentalPropertyDetails />} />

				{/* Sale Property Routes */}
				<Route path="/buys" element={<SaleProperties />} />
				<Route path="/buys/:id" element={<SellPropertyDetails />} />

				{/* All Properties Route */}
				<Route path="/properties" element={<AllListings />} />

				{/* Auth & Account */}
				<Route path="/signup" element={<Signup />} />
				<Route
					path="/SignupLocalComponent"
					element={<SignupLocalComponent />}
				/>
				<Route path="/login" element={<Login />} />
				<Route path="/reset-password/:token" element={<ResetPassword />} />
				<Route path="/verify-email" element={<VerifyEmail />} />

				{/* User Dashboard (Protected) */}
				<Route
					path="/dashboard"
					element={
						<ProtectedRoute allowedRoles={["user"]}>
							<DashboardLayout />
						</ProtectedRoute>
					}
				>
					<Route index element={<Navigate to="your-profile" replace />} />
					<Route path="your-profile" element={<YourProfile />} />
					<Route path="new-post" element={<NewPost />} />
					<Route
						path="new-post/sell"
						element={<PostStepperForm intent="sell" />}
					/>
					<Route
						path="new-post/rent"
						element={<PostStepperForm intent="rent" />}
					/>
					<Route path="view-your-listings" element={<ViewYourListings />} />
					<Route
						path="view-your-listings/edit-post/:id"
						element={<EditPostPage />}
					/>
				</Route>

				{/* Admin Dashboard (Protected) */}
				<Route
					path="/admin/*"
					element={
						<ProtectedRoute allowedRoles={["admin"]}>
							<AdminDashboardPage />
						</ProtectedRoute>
					}
				>
					<Route index element={<Navigate to="/admin/home" replace />} />
					<Route path="home" element={<HomeTab />} />
					<Route path="posts" element={<ManagePosts />} />
					<Route path="posts/view-post/:id" element={<ViewPost />} />
					<Route path="users" element={<ManageUsers />} />
					<Route path="users/view-user/:id" element={<ViewUser />} />
				</Route>

				{/* Utility & Error Pages */}
				<Route path="/access-denied" element={<NotFound404 />} />
			</Routes>
			<ToastContainer position="top-center" autoClose={2000} newestOnTop />
		</Router>
	);
};

export default App;
