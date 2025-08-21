import React, { useState, useEffect, useRef } from "react";
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
import { formatFullName } from "../../utils/capitalizeName";

const Navbar: React.FC = () => {
	const mobileMenuRef = useRef<HTMLDivElement>(null);
	const desktopMenuDropdownRef = useRef<HTMLDivElement>(null);

	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
	const { user } = useSelector((state: RootState) => state.auth);
	const dispatch = useDispatch<AppDispatch>();
	const navigate = useNavigate();
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				mobileMenuRef.current &&
				!mobileMenuRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
				setDropdownOpen(false);
			}
		};

		if (isOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isOpen]);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				desktopMenuDropdownRef.current &&
				!desktopMenuDropdownRef.current.contains(event.target as Node)
			) {
				setDropdownOpen(false);
			}
		};

		if (dropdownOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [dropdownOpen]);
	const handleLogout = () => {
		dispatch(logout());
		navigate("/login");
	};

	return (
		<nav className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-200">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between h-16 items-center">
					{/* Logo */}
					<NavLink
						to="/"
						className="relative h-14 w-14 sm:h-16 sm:w-16 transition-all duration-300 hover:scale-110 hover:rotate-3"
					>
						<img
							src={siliguri_property_logo_noBG}
							alt="Logo"
							className="w-full h-full object-contain drop-shadow-sm"
						/>
					</NavLink>

					{/* Main navigation links */}
					<div className="hidden md:flex items-center space-x-8 ml-8">
						<NavLink
							to="/properties"
							className={({ isActive }) =>
								isActive
									? "text-blue-600 font-semibold bg-blue-50 px-3 py-2 rounded-lg"
									: "text-gray-700 hover:text-blue-600 hover:bg-gray-50 px-3 py-2 rounded-lg font-medium transition-all duration-200"
							}
						>
							All Properties
						</NavLink>
						<NavLink
							to="/rentals"
							className={({ isActive }) =>
								isActive
									? "text-blue-600 font-semibold bg-blue-50 px-3 py-2 rounded-lg"
									: "text-gray-700 hover:text-blue-600 hover:bg-gray-50 px-3 py-2 rounded-lg font-medium transition-all duration-200"
							}
						>
							Property for rent
						</NavLink>
						<NavLink
							to="/buys"
							className={({ isActive }) =>
								isActive
									? "text-blue-600 font-semibold bg-blue-50 px-3 py-2 rounded-lg"
									: "text-gray-700 hover:text-blue-600 hover:bg-gray-50 px-3 py-2 rounded-lg font-medium transition-all duration-200"
							}
						>
							Property for sale
						</NavLink>
						<NavLink
							to="/about"
							className={({ isActive }) =>
								isActive
									? "text-blue-600 font-semibold bg-blue-50 px-3 py-2 rounded-lg"
									: "text-gray-700 hover:text-blue-600 hover:bg-gray-50 px-3 py-2 rounded-lg font-medium transition-all duration-200"
							}
						>
							About Us
						</NavLink>
					</div>

					<PostYourPropertyButton />
					{/* Desktop Menu */}
					<div className="hidden md:flex items-center space-x-4">
						{user ? (
							<div className="relative">
								<motion.div
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									className="flex items-center space-x-3 cursor-pointer bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-2 rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-200"
									onClick={() => setDropdownOpen(!dropdownOpen)}
								>
									{user.avatar ? (
										<img
											className="w-10 h-10 rounded-full border-2 border-blue-500 p-0.5 shadow-md"
											src={user.avatar}
											alt={user.name}
										/>
									) : (
										<div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center font-bold ring-2 ring-blue-400 ring-offset-2 ring-offset-white shadow-md">
											{getInitials(user?.name ?? "")}
										</div>
									)}
									<span className="text-gray-800 font-medium">
										{formatFullName(user?.name)}
									</span>
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
									<div
										ref={desktopMenuDropdownRef}
										className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl py-2 z-50 ring-1 ring-gray-200 border border-gray-200"
									>
										<NavLink
											to={user.role === "user" ? "/dashboard" : "/admin"}
											className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg mx-2 transition-colors"
										>
											{user.role === "user"
												? "User Dashboard"
												: "Admin Dashboard"}
										</NavLink>
										<button
											onClick={handleLogout}
											className="block w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-lg mx-2 transition-colors"
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
									className="text-gray-700 hover:text-blue-600 hover:bg-gray-100 px-4 py-2 rounded-lg font-medium transition-all duration-200"
								>
									Login
								</NavLink>
								<NavLink
									to="/signup"
									className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
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
							className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none p-2 rounded-lg transition-all duration-200"
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
				<div
					className="md:hidden px-4 pt-4 pb-6 bg-white shadow-xl rounded-b-2xl border-t border-gray-200"
					ref={mobileMenuRef}
				>
					{user ? (
						<div className="space-y-4">
							<div className="flex items-center space-x-3 px-4 py-2 border-b border-gray-200 mb-2">
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
								<span className="text-gray-800 font-medium text-base">
									{formatFullName(user?.name)}
								</span>
							</div>
							<div className="mb-2">
								<p className="text-xs text-gray-500 font-semibold uppercase tracking-wider px-4 mb-1 mt-2">
									Navigation
								</p>
								<div className="space-y-1 divide-y divide-gray-200">
									<NavLink
										to="/properties"
										className={({ isActive }) =>
											(isActive
												? "block w-full text-blue-600 font-semibold px-4 py-2 bg-blue-50 rounded-lg"
												: "block w-full text-gray-700 hover:bg-gray-100 rounded-lg px-4 py-2 transition-colors") +
											" flex items-center gap-2"
										}
									>
										<span role="img" aria-label="all properties">
											🏘️
										</span>{" "}
										All Properties
									</NavLink>
									<NavLink
										to="/rentals"
										className={({ isActive }) =>
											(isActive
												? "block w-full text-blue-600 font-semibold px-4 py-2 bg-blue-50 rounded-lg"
												: "block w-full text-gray-700 hover:bg-gray-100 rounded-lg px-4 py-2 transition-colors") +
											" flex items-center gap-2"
										}
									>
										<span role="img" aria-label="rent">
											🏠
										</span>{" "}
										Property for rent
									</NavLink>
									<NavLink
										to="/buys"
										className={({ isActive }) =>
											(isActive
												? "block w-full text-blue-600 font-semibold px-4 py-2 bg-blue-50 rounded-lg"
												: "block w-full text-gray-700 hover:bg-gray-100 rounded-lg px-4 py-2 transition-colors") +
											" flex items-center gap-2"
										}
									>
										<span role="img" aria-label="sale">
											💼
										</span>{" "}
										Property for sale
									</NavLink>
									<NavLink
										to="/about"
										className={({ isActive }) =>
											(isActive
												? "block w-full text-blue-600 font-semibold px-4 py-2 bg-blue-50 rounded-lg"
												: "block w-full text-gray-700 hover:bg-gray-100 rounded-lg px-4 py-2 transition-colors") +
											" flex items-center gap-2"
										}
									>
										<span role="img" aria-label="about">
											ℹ️
										</span>{" "}
										About Us
									</NavLink>
								</div>
							</div>
							<div className="mt-4">
								<p className="text-xs text-gray-400 font-semibold uppercase tracking-wider px-4 mb-1">
									Account
								</p>
								<div className="space-y-2">
									<NavLink
										to={user.role === "user" ? "/dashboard" : "/admin"}
										className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg"
									>
										{user.role === "user"
											? "User Dashboard"
											: "Admin Dashboard"}
									</NavLink>
									<button
										onClick={handleLogout}
										className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
									>
										Logout
									</button>
								</div>
							</div>
						</div>
					) : (
						<div className="space-y-4">
							<div className="mb-2">
								<p className="text-xs text-gray-400 font-semibold uppercase tracking-wider px-4 mb-1 mt-2">
									Navigation
								</p>
								<div className="space-y-1 divide-y divide-gray-100">
									<NavLink
										to="/properties"
										className={({ isActive }) =>
											(isActive
												? "block w-full text-blue-600 font-semibold px-4 py-2 bg-blue-50 rounded-lg"
												: "block w-full text-gray-700 hover:bg-blue-50 rounded-lg px-4 py-2 transition-colors") +
											" flex items-center gap-2"
										}
									>
										<span role="img" aria-label="all properties">
											🏘️
										</span>{" "}
										All Properties
									</NavLink>
									<NavLink
										to="/rentals"
										className={({ isActive }) =>
											(isActive
												? "block w-full text-blue-600 font-semibold px-4 py-2 bg-blue-50 rounded-lg"
												: "block w-full text-gray-700 hover:bg-blue-50 rounded-lg px-4 py-2 transition-colors") +
											" flex items-center gap-2"
										}
									>
										<span role="img" aria-label="rent">
											🏠
										</span>{" "}
										Property for rent
									</NavLink>
									<NavLink
										to="/buys"
										className={({ isActive }) =>
											(isActive
												? "block w-full text-blue-600 font-semibold px-4 py-2 bg-blue-50 rounded-lg"
												: "block w-full text-gray-700 hover:bg-blue-50 rounded-lg px-4 py-2 transition-colors") +
											" flex items-center gap-2"
										}
									>
										<span role="img" aria-label="sale">
											💼
										</span>{" "}
										Property for sale
									</NavLink>
									<NavLink
										to="/about"
										className={({ isActive }) =>
											(isActive
												? "block w-full text-blue-600 font-semibold px-4 py-2 bg-blue-50 rounded-lg"
												: "block w-full text-gray-700 hover:bg-blue-50 rounded-lg px-4 py-2 transition-colors") +
											" flex items-center gap-2"
										}
									>
										<span role="img" aria-label="about">
											ℹ️
										</span>{" "}
										About Us
									</NavLink>
								</div>
							</div>
							<div className="mt-4">
								<p className="text-xs text-gray-400 font-semibold uppercase tracking-wider px-4 mb-1">
									Account
								</p>
								<div className="space-y-2">
									<NavLink
										to="/login"
										className="block w-full text-center px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg"
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
							</div>
						</div>
					)}
				</div>
			</Transition>
		</nav>
	);
};

export default Navbar;
