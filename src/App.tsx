import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./route/ProtectedRoute";
import Signup from "./pages/Signup";
import Homepage from "./pages/Homepage";
import SignupLocalComponent from "./components/signup/SignupLocalComponent";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Login";
import { UserAuthProvider } from "./contextAPI/UserAuthContext";
import DashboardLayout from "./user/DashboardLayout";
import AdminDashboard from "./admin/AdminDashboard";
import NotFound404 from "./components/homepage/NotFound404";
import VerifyEmail from "./components/homepage/VerifyEmail";

const App: React.FC = () => {
	return (
		<>
			<UserAuthProvider>
				<Router>
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
						/>
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
			</UserAuthProvider>
		</>
	);
};

export default App;
