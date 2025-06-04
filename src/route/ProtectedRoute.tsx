import React, { JSX } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "../app/store";

interface ProtectedRouteProps {
	children: JSX.Element;
	allowedRoles?: string[];
}
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
	children,
	allowedRoles,
}) => {
	const { isAuthenticated, user } = useSelector(
		(state: RootState) => state.auth
	);
	if (!isAuthenticated) {
		return <Navigate to="/login" replace />;
	}
	if (allowedRoles && !allowedRoles.includes(user!.role)) {
		return <Navigate to="/access-denied" replace />;
	}
	return children;
};
export default ProtectedRoute;
