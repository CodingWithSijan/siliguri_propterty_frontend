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
								<ProtectedRoute>
									<DashboardLayout />
								</ProtectedRoute>
							}
						/>
					</Routes>
					<ToastContainer />
				</Router>
			</UserAuthProvider>
		</>
	);
};

export default App;
