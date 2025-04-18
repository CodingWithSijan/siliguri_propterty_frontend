import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./signup/Signup";
import Homepage from "./Homepage";
import Signup_email from "./signup/signup_email";
const App: React.FC = () => {
	return (
		<>
			<Router>
				<Routes>
					<Route path="/" element={<Homepage />} />
					<Route path="/signup" element={<Signup />} />
					<Route path="/signup_email" element={<Signup_email />} />
				</Routes>
			</Router>
		</>
	);
};

export default App;
