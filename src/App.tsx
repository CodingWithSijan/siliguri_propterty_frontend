import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./route/ProtectedRoute";
import Signup from "./signup/Signup";
import Homepage from "./Homepage";
import SignupLocalComponent from "./signup/SignupLocalComponent";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./login/Login";
import { UserAuthProvider } from "./contextAPI/UserAuthContext";
import DashboardLayout from "./user/DashboardLayout";
import GoogleSuccess from "./pages/GoogleSuccess";
import AdminDashboard from "./admin/AdminDashboard";
import NotFound404 from "./components/NotFound404";
import AdminProtectedRoute from "./route/AdminProtectedRoute";

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
						<Route path="/auth/google/success" element={<GoogleSuccess />} />

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
					</Routes>
					<ToastContainer />
				</Router>
			</UserAuthProvider>
		</>
	);
};

export default App;
