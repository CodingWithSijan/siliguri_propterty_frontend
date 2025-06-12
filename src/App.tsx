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
import AdminDashboard from "./admin/AdminDashboard";
import NotFound404 from "./components/homepage/NotFound404";
import VerifyEmail from "./components/homepage/VerifyEmail";
import NewPost from "./user/dashboard/NewPost";
import ViewYourListings from "./user/dashboard/ViewYourListings";
import ScrollToTopButton from "./components/common/scrollToTopButton";
import PostStepperForm from "./components/post_form/PostStepperForm";
import YourProfile from "./user/dashboard/YourProfile";

const App: React.FC = () => {
	return (
		<Router>
			<ScrollToTopButton />

			<Routes>
				<Route path="/" element={<Homepage />} />
				<Route path="/signup" element={<Signup />} />
				<Route
					path="/SignupLocalComponent"
					element={<SignupLocalComponent />}
				/>
				<Route path="/login" element={<Login />} />

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
				</Route>

				<Route
					path="/admin"
					element={
						<ProtectedRoute allowedRoles={["admin"]}>
							<AdminDashboard />
						</ProtectedRoute>
					}
				/>

				<Route path="/access-denied" element={<NotFound404 />} />
				<Route path="/verify-email" element={<VerifyEmail />} />
			</Routes>

			<ToastContainer />
		</Router>
	);
};

export default App;
