import React, { useState } from "react";
import { Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { NavLink, useNavigate } from "react-router-dom";
import siliguri_property_logo_noBG from "../assets/logo_siliguri_property.png";
import { useAuth } from "../contextAPI/UserAuthContext";

const Navbar: React.FC = () => {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
	const { user, logout } = useAuth();
	const navigate = useNavigate();

	const getInitials = (name: string): string => {
		return name?.[0]?.toUpperCase() || "";
	};

	/*
		TESTING 
	 */
	// useEffect(() => {
	// 	console.log(user && user.role === "user" ? "User" : "Admin");
	// }, []);
	const handleLogout = () => {
		logout();
		navigate("/login");
	};

	return (
		<nav className="bg-white shadow-md w-full z-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between h-16 items-center">
					{/* Logo */}
					<NavLink to="/" className="h-24 w-24 aspect-[16/9]">
						<img
							src={siliguri_property_logo_noBG}
							alt="Logo"
							className="w-full h-full object-contain"
						/>
					</NavLink>

					{/* Desktop Menu */}
					<div className="hidden md:flex items-center space-x-4">
						{user ? (
							<div className="relative">
								<div
									className="flex items-center space-x-2 cursor-pointer"
									onClick={() => setDropdownOpen(!dropdownOpen)}
								>
									{user.avatar ? (
										<img
											className="w-10 h-10 rounded-full border-2 border-sky-500"
											src={user.avatar}
										/>
									) : (
										<div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
											{getInitials(user?.name ?? user)}
										</div>
									)}

									{/* )} */}
								</div>
								{/* Dropdown Menu */}
								{dropdownOpen && (
									<div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2 z-50">
										{user && user.role === "user" ? (
											<NavLink
												to="/dashboard"
												className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
											>
												User Dashboard
											</NavLink>
										) : (
											<NavLink
												to="/admin"
												className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
											>
												Admin Dashboard
											</NavLink>
										)}

										<button
											onClick={handleLogout}
											className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
										>
											Logout
										</button>
									</div>
								)}
							</div>
						) : (
							<>
								<NavLink
									to="/login"
									className="text-gray-700 hover:text-blue-600 transition"
								>
									Login
								</NavLink>
								<NavLink
									to="/signup"
									className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
								>
									Signup
								</NavLink>
							</>
						)}
					</div>

					{/* Mobile Hamburger */}
					<div className="md:hidden">
						<button
							onClick={() => setIsOpen(!isOpen)}
							type="button"
							className="text-gray-700 hover:text-blue-600 focus:outline-none"
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
				enter="transition ease-out duration-200 transform"
				enterFrom="-translate-y-4 opacity-0"
				enterTo="translate-y-0 opacity-100"
				leave="transition ease-in duration-150 transform"
				leaveFrom="translate-y-0 opacity-100"
				leaveTo="-translate-y-4 opacity-0"
			>
				<div className="md:hidden px-4 pb-4 space-y-2 bg-white shadow">
					{user ? (
						<>
							{" "}
							{user && user?.role === "user" ? (
								<NavLink
									to="/dashboard"
									className="block w-full text-center text-gray-700 hover:text-blue-600"
								>
									User Dashboard
								</NavLink>
							) : (
								<NavLink
									to="/admin"
									className="block w-full text-center text-gray-700 hover:text-blue-600"
								>
									Admin Dashboard
								</NavLink>
							)}
							<button
								onClick={handleLogout}
								className="block w-full text-center bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
							>
								Logout
							</button>
						</>
					) : (
						<>
							<NavLink
								to="/login"
								className="block w-full text-center text-gray-700 hover:text-blue-600"
							>
								Login
							</NavLink>
							<NavLink
								to="/signup"
								className="block w-full text-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
							>
								Signup
							</NavLink>
						</>
					)}
				</div>
			</Transition>
		</nav>
	);
};

export default Navbar;
