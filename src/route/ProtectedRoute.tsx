import React, { JSX } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contextAPI/UserAuthContext";

interface ProtectedRouteProps {
	children: JSX.Element;
	allowedRoles?: string[];
}
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
	children,
	allowedRoles,
}) => {
	const { isAuthenticated, user } = useAuth();
	if (!isAuthenticated) {
		return <Navigate to="/login" replace />;
	}
	if (allowedRoles && !allowedRoles.includes(user!.role)) {
		return <Navigate to="/access-denied" replace />;
	}
	return children;
};
export default ProtectedRoute;
