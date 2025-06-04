import React, { useState } from "react";
import { Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { NavLink, useNavigate } from "react-router-dom";
import siliguri_property_logo_noBG from "../../assets/logo_siliguri_property.png";
import { getInitials } from "../../utils/getInitial";
import { motion } from "framer-motion";
import { PostYourPropertyButton } from "../common/PostYourPropertyButton";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import { logout } from "../../app/slices/authSlice";

const Navbar: React.FC = () => {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
	const { user } = useSelector((state: RootState) => state.auth);
	const dispatch = useDispatch<AppDispatch>();
	const navigate = useNavigate();

	const handleLogout = () => {
		dispatch(logout());
		navigate("/login");
	};

	return (
		<nav className="bg-white shadow-sm sticky top-0 z-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between h-16 items-center">
					{/* Logo */}
					<NavLink
						to="/"
						className="relative h-14 w-14 sm:h-16 sm:w-16 transition-transform hover:scale-105"
					>
						<img
							src={siliguri_property_logo_noBG}
							alt="Logo"
							className="w-full h-full object-contain"
						/>
					</NavLink>
					<PostYourPropertyButton />
					{/* Desktop Menu */}
					<div className="hidden md:flex items-center space-x-4">
						{user ? (
							<div className="relative">
								<motion.div
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									className="flex items-center space-x-3 cursor-pointer"
									onClick={() => setDropdownOpen(!dropdownOpen)}
								>
									{user.avatar ? (
										<img
											className="w-10 h-10 rounded-full border-2 border-blue-500 p-0.5"
											src={user.avatar}
											alt={user.name}
										/>
									) : (
										<div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold ring-2 ring-blue-500 ring-offset-2">
											{getInitials(user?.name ?? "")}
										</div>
									)}
									<span className="text-gray-700 font-medium">{user.name}</span>
								</motion.div>

								{/* Dropdown Menu */}
								<Transition
									show={dropdownOpen}
									enter="transition ease-out duration-100"
									enterFrom="transform opacity-0 scale-95"
									enterTo="transform opacity-100 scale-100"
									leave="transition ease-in duration-75"
									leaveFrom="transform opacity-100 scale-100"
									leaveTo="transform opacity-0 scale-95"
								>
									<div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-lg py-2 z-50 ring-1 ring-black ring-opacity-5">
										<NavLink
											to={user.role === "user" ? "/dashboard" : "/admin"}
											className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
										>
											{user.role === "user"
												? "User Dashboard"
												: "Admin Dashboard"}
										</NavLink>
										<button
											onClick={handleLogout}
											className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
										>
											Logout
										</button>
									</div>
								</Transition>
							</div>
						) : (
							<>
								<NavLink
									to="/login"
									className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
								>
									Login
								</NavLink>
								<NavLink
									to="/signup"
									className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
								>
									Sign Up
								</NavLink>
							</>
						)}
					</div>

					{/* Mobile Menu Button */}
					<div className="md:hidden">
						<button
							onClick={() => setIsOpen(!isOpen)}
							type="button"
							className="text-gray-700 hover:text-blue-600 focus:outline-none p-2"
						>
							{isOpen ? (
								<XMarkIcon className="h-6 w-6" />
							) : (
								<Bars3Icon className="h-6 w-6" />
							)}
						</button>
					</div>
				</div>
			</div>

			{/* Mobile Dropdown */}
			<Transition
				show={isOpen}
				enter="transition ease-out duration-200"
				enterFrom="opacity-0 -translate-y-1"
				enterTo="opacity-100 translate-y-0"
				leave="transition ease-in duration-150"
				leaveFrom="opacity-100 translate-y-0"
				leaveTo="opacity-0 -translate-y-1"
			>
				<div className="md:hidden px-4 pt-2 pb-4 bg-white shadow-lg">
					{user ? (
						<div className="space-y-3">
							<div className="flex items-center space-x-3 px-4 py-2">
								{user.avatar ? (
									<img
										className="w-10 h-10 rounded-full border-2 border-blue-500"
										src={user.avatar}
										alt={user.name}
									/>
								) : (
									<div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
										{getInitials(user?.name ?? "")}
									</div>
								)}
								<span className="text-gray-700 font-medium">{user.name}</span>
							</div>
							<NavLink
								to={user.role === "user" ? "/dashboard" : "/admin"}
								className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
							>
								{user.role === "user" ? "User Dashboard" : "Admin Dashboard"}
							</NavLink>
							<button
								onClick={handleLogout}
								className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
							>
								Logout
							</button>
						</div>
					) : (
						<div className="space-y-3">
							<NavLink
								to="/login"
								className="block w-full text-center px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
							>
								Login
							</NavLink>
							<NavLink
								to="/signup"
								className="block w-full text-center px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg"
							>
								Sign Up
							</NavLink>
						</div>
					)}
				</div>
			</Transition>
		</nav>
	);
};

export default Navbar;
