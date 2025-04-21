import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./signup/Signup";
import Homepage from "./Homepage";
import Signup_email from "./signup/Signup_email";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./login/Login";
import { AuthProvider } from "./contextAPI/AuthContext";
const App: React.FC = () => {
	return (
		<>
			<AuthProvider>
				<Router>
					<Routes>
						<Route path="/" element={<Homepage />} />
						<Route path="/signup" element={<Signup />} />
						<Route path="/signup_email" element={<Signup_email />} />
						<Route path="/login" element={<Login />} />
					</Routes>
					<ToastContainer />
				</Router>
			</AuthProvider>
		</>
	);
};

export default App;
