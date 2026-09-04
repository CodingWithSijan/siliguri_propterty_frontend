import React, { Suspense, lazy } from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
	useParams,
} from "react-router-dom";
import ProtectedRoute from "./route/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ScrollToTopButton from "./components/common/scrollToTopButton";
import PhoneNumberCompletionModal from "./components/common/PhoneNumberCompletionModal";

const Signup = lazy(() => import("./pages/Signup"));
const Homepage = lazy(() => import("./pages/Homepage"));
const Login = lazy(() => import("./pages/Login"));
const SocialAuthCallback = lazy(() => import("./pages/SocialAuthCallback"));
const DashboardLayout = lazy(() => import("./user/DashboardLayout"));
const NotFound404 = lazy(() => import("./components/homepage/NotFound404"));
const VerifyEmail = lazy(() => import("./components/homepage/VerifyEmail"));
const NewPost = lazy(() => import("./user/dashboard/NewPost"));
const ViewYourListings = lazy(
	() => import("./user/dashboard/ViewYourListings"),
);
const SavedPosts = lazy(() => import("./user/dashboard/SavedPosts"));
const PostStepperForm = lazy(
	() => import("./components/post_form/PostStepperForm"),
);
const YourProfile = lazy(() => import("./user/dashboard/YourProfile"));
const EditPostPage = lazy(() => import("./pages/EditPostPage"));
const RentalProperties = lazy(() => import("./pages/RentalProperties"));
const SaleProperties = lazy(() => import("./pages/SaleProperties"));
const RentalPropertyByCategory = lazy(
	() => import("./pages/RentalPropertyByCategory"),
);
const SellPropertyByCategory = lazy(
	() => import("./pages/SellPropertyByCategory"),
);
const RentalPropertyDetails = lazy(
	() => import("./pages/RentalPropertyDetails"),
);
const SellPropertyDetails = lazy(() => import("./pages/SellPropertyDetails"));
const AllListings = lazy(() => import("./pages/AllListings"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const AdminDashboardPage = lazy(() => import("./pages/AdminDashboardPage"));
const HomeTab = lazy(() => import("./components/adminComponents/HomeTab"));
const ManagePosts = lazy(
	() => import("./components/adminComponents/ManagePosts"),
);
const ManageUsers = lazy(
	() => import("./components/adminComponents/ManageUsers"),
);
const SuperAdminPanel = lazy(
	() => import("./components/adminComponents/SuperAdminPanel"),
);
const ViewUser = lazy(() => import("./components/adminComponents/ViewUser"));
const ViewPost = lazy(() => import("./components/adminComponents/ViewPost"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const Terms = lazy(() => import("./pages/Terms"));
const MessagesPage = lazy(() => import("./pages/MessagesPage"));
const NotificationsPage = lazy(() => import("./pages/NotificationsPage"));

const LegacySellRedirect: React.FC = () => {
	const { category, id } = useParams();
	if (!category || !id) {
		return <Navigate to="/properties" replace />;
	}
	return <Navigate to={`/buys/${category}/${id}`} replace />;
};

const App: React.FC = () => {
	return (
		<Router>
			<ScrollToTopButton />
			<ToastContainer
				position="top-center"
				autoClose={2000}
				newestOnTop
				pauseOnHover
				theme="light"
			/>
			<PhoneNumberCompletionModal />

			<Suspense
				fallback={
					<div className="flex min-h-[40vh] items-center justify-center text-slate-600">
						Loading page...
					</div>
				}
			>
				<Routes>
					{/* ============================================
				    PUBLIC ROUTES
				    ============================================ */}

					{/* Homepage & Info */}
					<Route path="/" element={<Homepage />} />
					<Route path="/about" element={<AboutUs />} />
					<Route path="/privacy" element={<PrivacyPolicy />} />
					<Route path="/terms" element={<Terms />} />

					{/* Rental Property Routes */}
					<Route path="/rentals" element={<RentalProperties />} />
					<Route
						path="/rentals/:category"
						element={<RentalPropertyByCategory />}
					/>
					<Route
						path="/rentals/:category/:id"
						element={<RentalPropertyDetails />}
					/>

					{/* Sale Property Routes */}
					<Route path="/buys" element={<SaleProperties />} />
					<Route path="/buys/:category" element={<SellPropertyByCategory />} />
					<Route path="/buys/:category/:id" element={<SellPropertyDetails />} />
					<Route path="/sell/:category/:id" element={<LegacySellRedirect />} />
					<Route path="/buy/:category/:id" element={<LegacySellRedirect />} />

					{/* All Properties Route */}
					<Route path="/properties" element={<AllListings />} />

					{/* ============================================
				    AUTHENTICATION ROUTES
				    ============================================ */}

					{/* Auth & Account */}
					<Route path="/signup" element={<Signup />} />
					<Route path="/login" element={<Login />} />
					<Route
						path="/auth/social-callback"
						element={<SocialAuthCallback />}
					/>
					<Route path="/reset-password/:token" element={<ResetPassword />} />
					<Route path="/verify-email" element={<VerifyEmail />} />

					{/* ============================================
				    USER DASHBOARD (Protected)
				    ============================================ */}
					<Route
						path="/dashboard"
						element={
							<ProtectedRoute allowedRoles={["user"]}>
								<DashboardLayout />
							</ProtectedRoute>
						}
					>
						<Route index element={<YourProfile />} />
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
						<Route path="saved-posts" element={<SavedPosts />} />
						<Route path="messages" element={<MessagesPage />} />
						<Route path="notifications" element={<NotificationsPage />} />
						<Route path="*" element={<Navigate to="your-profile" replace />} />
					</Route>

					{/* ============================================
				    ADMIN DASHBOARD (Protected)
				    ============================================ */}
					<Route
						path="/admin"
						element={
							<ProtectedRoute allowedRoles={["admin", "superadmin"]}>
								<AdminDashboardPage />
							</ProtectedRoute>
						}
					>
						<Route index element={<HomeTab />} />
						<Route path="home" element={<HomeTab />} />
						<Route path="posts" element={<ManagePosts />} />
						<Route path="posts/view-post/:id" element={<ViewPost />} />
						<Route path="users" element={<ManageUsers />} />
						<Route path="super-admin" element={<SuperAdminPanel />} />
						<Route path="users/view-user/:id" element={<ViewUser />} />
						<Route path="messages" element={<MessagesPage />} />
						<Route path="notifications" element={<NotificationsPage />} />
						<Route path="*" element={<Navigate to="home" replace />} />
					</Route>

					{/* ============================================
				    ERROR & UTILITY ROUTES
				    ============================================ */}
					<Route path="/access-denied" element={<NotFound404 />} />

					{/* Catch-all 404 - Must be last */}
					<Route path="*" element={<NotFound404 />} />
				</Routes>
			</Suspense>
		</Router>
	);
};

export default App;
