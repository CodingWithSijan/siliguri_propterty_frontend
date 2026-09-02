import React, { useState, useEffect, useRef } from "react";
import { Transition } from "@headlessui/react";
import {
	Menu,
	X,
	Home,
	Building,
	Building2,
	Info,
	User,
	LogOut,
} from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
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
	const [rentDropdownOpen, setRentDropdownOpen] = useState<boolean>(false);
	const [buyDropdownOpen, setBuyDropdownOpen] = useState<boolean>(false);
	const { user } = useSelector((state: RootState) => state.auth);
	const dispatch = useDispatch<AppDispatch>();
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				mobileMenuRef.current &&
				!mobileMenuRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
				setRentDropdownOpen(false);
				setBuyDropdownOpen(false);
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

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as Node;
			const rentDropdown = document.querySelector(".rent-dropdown-container");
			const buyDropdown = document.querySelector(".buy-dropdown-container");

			if (rentDropdown && !rentDropdown.contains(target)) {
				setRentDropdownOpen(false);
			}
			if (buyDropdown && !buyDropdown.contains(target)) {
				setBuyDropdownOpen(false);
			}
		};

		if (rentDropdownOpen || buyDropdownOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		}
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [rentDropdownOpen, buyDropdownOpen]);

	const handleLogout = () => {
		dispatch(logout());
		navigate("/login");
	};

	// Close mobile menu and navigate
	const handleMobileNavClick = (path: string) => {
		setIsOpen(false);
		setRentDropdownOpen(false);
		setBuyDropdownOpen(false);
		if (location.pathname !== path) {
			navigate(path);
		}
	};

	return (
		<nav className="bg-white/95 backdrop-blur-md shadow-md sticky top-0 z-50 border-b border-gray-200">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between h-16 items-center">
					{/* Logo */}
					<NavLink to="/" className="relative h-14 w-14 sm:h-16 sm:w-16">
						<img
							src={siliguri_property_logo_noBG}
							alt="Logo"
							className="w-full h-full object-contain"
						/>
					</NavLink>

					{/* Main navigation links */}
					<div className="hidden md:flex items-center space-x-8 ml-8">
						<NavLink
							to="/properties"
							className={({ isActive }) =>
								isActive
									? "flex items-center space-x-2 text-blue-600 font-semibold border-b-2 border-blue-600 pb-1"
									: "flex items-center space-x-2 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
							}
						>
							<Building className="h-4 w-4" />
							<span>Available Property</span>
						</NavLink>

						{/* Rent Dropdown */}
						<div className="relative rent-dropdown-container">
							<div className="flex items-center gap-1">
								<NavLink
									to="/rentals"
									onClick={() => {
										setRentDropdownOpen(false);
										setBuyDropdownOpen(false);
									}}
									className={({ isActive }) =>
										isActive
											? "flex items-center space-x-2 text-blue-600 font-semibold"
											: "flex items-center space-x-2 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
									}
								>
									<Home className="h-4 w-4" />
									<span>Rent</span>
								</NavLink>
								<button
									type="button"
									onClick={() => setRentDropdownOpen(!rentDropdownOpen)}
									className="rounded p-1 text-gray-600 hover:bg-blue-50 hover:text-blue-600"
									aria-label="Open rent categories"
								>
									<svg
										className={`h-4 w-4 transition-transform ${rentDropdownOpen ? "rotate-180" : ""}`}
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M19 9l-7 7-7-7"
										/>
									</svg>
								</button>
							</div>
							{rentDropdownOpen && (
								<div className="absolute left-0 top-full mt-1 w-48 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-200">
									<NavLink
										to="/rentals"
										onClick={() => setRentDropdownOpen(false)}
										className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
									>
										All Rentals
									</NavLink>
									<NavLink
										to="/rentals/house"
										onClick={() => setRentDropdownOpen(false)}
										className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
									>
										House for Rent
									</NavLink>
									<NavLink
										to="/rentals/flat"
										onClick={() => setRentDropdownOpen(false)}
										className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
									>
										Flat for Rent
									</NavLink>
									<NavLink
										to="/rentals/shop"
										onClick={() => setRentDropdownOpen(false)}
										className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
									>
										Shop for Rent
									</NavLink>
								</div>
							)}
						</div>

						{/* Buy Dropdown */}
						<div className="relative buy-dropdown-container">
							<div className="flex items-center gap-1">
								<NavLink
									to="/buys"
									onClick={() => {
										setBuyDropdownOpen(false);
										setRentDropdownOpen(false);
									}}
									className={({ isActive }) =>
										isActive
											? "flex items-center space-x-2 text-blue-600 font-semibold"
											: "flex items-center space-x-2 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
									}
								>
									<Building2 className="h-4 w-4" />
									<span>Buy</span>
								</NavLink>
								<button
									type="button"
									onClick={() => setBuyDropdownOpen(!buyDropdownOpen)}
									className="rounded p-1 text-gray-600 hover:bg-blue-50 hover:text-blue-600"
									aria-label="Open buy categories"
								>
									<svg
										className={`h-4 w-4 transition-transform ${buyDropdownOpen ? "rotate-180" : ""}`}
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M19 9l-7 7-7-7"
										/>
									</svg>
								</button>
							</div>
							{buyDropdownOpen && (
								<div className="absolute left-0 top-full mt-1 w-48 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-200">
									<NavLink
										to="/buys"
										onClick={() => setBuyDropdownOpen(false)}
										className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
									>
										All For Sale
									</NavLink>
									<NavLink
										to="/buys/house"
										onClick={() => setBuyDropdownOpen(false)}
										className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
									>
										House for Sale
									</NavLink>
									<NavLink
										to="/buys/flat"
										onClick={() => setBuyDropdownOpen(false)}
										className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
									>
										Flat for Sale
									</NavLink>
									<NavLink
										to="/buys/land"
										onClick={() => setBuyDropdownOpen(false)}
										className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
									>
										Land for Sale
									</NavLink>
									<NavLink
										to="/buys/shop"
										onClick={() => setBuyDropdownOpen(false)}
										className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
									>
										Shop for Sale
									</NavLink>
								</div>
							)}
						</div>
						<NavLink
							to="/about"
							className={({ isActive }) =>
								isActive
									? "flex items-center space-x-2 text-blue-600 font-semibold border-b-2 border-blue-600 pb-1"
									: "flex items-center space-x-2 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
							}
						>
							<Info className="h-4 w-4" />
							<span>About Us</span>
						</NavLink>
					</div>

					<PostYourPropertyButton />

					{/* Desktop Menu */}
					<div className="hidden md:flex items-center space-x-4">
						{user ? (
							<div className="relative">
								<motion.div
									whileTap={{ scale: 0.97 }}
									className="flex items-center space-x-3 cursor-pointer bg-gray-50 px-4 py-2 rounded-lg "
									onClick={() => setDropdownOpen(!dropdownOpen)}
								>
									{user.avatar ? (
										<img
											className="w-9 h-9 rounded-full border border-gray-300"
											src={user.avatar}
											alt={user.name}
										/>
									) : (
										<div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
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
									enterFrom="opacity-0 scale-95"
									enterTo="opacity-100 scale-100"
									leave="transition ease-in duration-75"
									leaveFrom="opacity-100 scale-100"
									leaveTo="opacity-0 scale-95"
								>
									<div
										ref={desktopMenuDropdownRef}
										className="absolute right-0 mt-3 w-64 bg-white rounded-lg shadow-xl py-1 z-50 border border-gray-200"
									>
										{/* User Info Section */}
										<div className="px-4 py-3 border-b border-gray-100 bg-gray-50 rounded-t-lg">
											<p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
												Logged in as
											</p>
											<div className="flex items-center space-x-3">
												{user.avatar ? (
													<img
														className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
														src={user.avatar}
														alt={user.name}
													/>
												) : (
													<div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-bold shadow-sm">
														{getInitials(user?.name ?? "")}
													</div>
												)}
												<div className="flex-1 min-w-0">
													<p className="text-sm font-semibold text-gray-900 truncate">
														{formatFullName(user?.name)}
													</p>
													<p className="text-xs text-gray-600 truncate">
														{user.email}
													</p>
												</div>
											</div>
										</div>
										{/* Menu Items */}
										<div className="py-1">
											<NavLink
												to={
													user.role === "user"
														? "/dashboard/your-profile"
														: "/admin/home"
												}
												className="group flex items-center justify-center space-x-2 px-3 py-2.5 text-sm text-gray-700 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 rounded-lg transition-all duration-200 border border-gray-200 hover:border-blue-300 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 font-medium cursor-pointer"
											>
												<User className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
												<span>
													{user.role === "user"
														? "My Account"
														: "Admin Dashboard"}
												</span>
											</NavLink>
											<button
												onClick={handleLogout}
												className="group flex items-center justify-center space-x-2 w-full px-2 py-1 mt-2 text-red-700 hover:text-red-800 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 font-medium cursor-pointer"
											>
												<LogOut className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
												<span>Log Out</span>
											</button>
										</div>
									</div>
								</Transition>
							</div>
						) : (
							<>
								<NavLink
									to="/login"
									className="text-gray-700 hover:text-blue-600 px-4 py-2 font-medium"
								>
									Login
								</NavLink>
								<NavLink
									to="/signup"
									className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
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
							className="text-gray-600 hover:text-gray-900 focus:outline-none p-2 rounded-lg"
						>
							{isOpen ? (
								<X className="h-6 w-6" />
							) : (
								<Menu className="h-6 w-6" />
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
					className="md:hidden px-4 pt-4 pb-6 bg-white shadow-lg rounded-b-2xl border-t border-gray-200"
					ref={mobileMenuRef}
				>
					{user ? (
						<div className="space-y-4">
							<div>
								<p className="text-xs text-gray-500 font-semibold uppercase tracking-wide px-4 mb-2">
									Navigation
								</p>
								<div className="space-y-1">
									<button
										onClick={() => handleMobileNavClick("/properties")}
										className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors w-full text-left"
									>
										<Building className="h-5 w-5" />
										<span className="font-medium">Available Properties</span>
									</button>

									{/* Rent Expandable Menu */}
									<div>
										<button
											onClick={() => setRentDropdownOpen(!rentDropdownOpen)}
											className="flex items-center justify-between w-full px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
										>
											<div className="flex items-center space-x-3">
												<Home className="h-5 w-5" />
												<span className="font-medium">Rent</span>
											</div>
											<svg
												className={`w-4 h-4 transition-transform duration-200 ${
													rentDropdownOpen ? "rotate-180" : ""
												}`}
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M19 9l-7 7-7-7"
												/>
											</svg>
										</button>
										{rentDropdownOpen && (
											<div className="ml-8 mt-1 space-y-1">
												<button
													onClick={() => handleMobileNavClick("/rentals")}
													className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
												>
													All Rentals
												</button>
												<button
													onClick={() => handleMobileNavClick("/rentals/house")}
													className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
												>
													House for Rent
												</button>
												<button
													onClick={() => handleMobileNavClick("/rentals/flat")}
													className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
												>
													Flat for Rent
												</button>
												<button
													onClick={() => handleMobileNavClick("/rentals/shop")}
													className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
												>
													Shop for Rent
												</button>
											</div>
										)}
									</div>

									{/* Buy Expandable Menu */}
									<div>
										<button
											onClick={() => setBuyDropdownOpen(!buyDropdownOpen)}
											className="flex items-center justify-between w-full px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
										>
											<div className="flex items-center space-x-3">
												<Building2 className="h-5 w-5" />
												<span className="font-medium">Buy</span>
											</div>
											<svg
												className={`w-4 h-4 transition-transform duration-200 ${
													buyDropdownOpen ? "rotate-180" : ""
												}`}
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M19 9l-7 7-7-7"
												/>
											</svg>
										</button>
										{buyDropdownOpen && (
											<div className="ml-8 mt-1 space-y-1">
												<button
													onClick={() => handleMobileNavClick("/buys")}
													className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
												>
													All For Sale
												</button>
												<button
													onClick={() => handleMobileNavClick("/buys/house")}
													className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
												>
													House for Sale
												</button>
												<button
													onClick={() => handleMobileNavClick("/buys/flat")}
													className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
												>
													Flat for Sale
												</button>
												<button
													onClick={() => handleMobileNavClick("/buys/land")}
													className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
												>
													Land for Sale
												</button>
												<button
													onClick={() => handleMobileNavClick("/buys/shop")}
													className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
												>
													Shop for Sale
												</button>
											</div>
										)}
									</div>

									<button
										onClick={() => handleMobileNavClick("/about")}
										className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors w-full text-left"
									>
										<Info className="h-5 w-5" />
										<span className="font-medium">About Us</span>
									</button>
								</div>
							</div>
							<div className="pt-2 border-t border-gray-200">
								<p className="text-xs text-gray-500 font-semibold uppercase tracking-wide px-4 mb-3">
									Account
								</p>
								<div className="space-y-3">
									<div>
										<p className="text-xs text-gray-500 font-medium px-4 mb-2">
											Logged in as
										</p>
										<div className="flex items-center space-x-3 px-4 py-3 bg-gray-50 rounded-lg border border-gray-100">
											{user.avatar ? (
												<img
													className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
													src={user.avatar}
													alt={user.name}
												/>
											) : (
												<div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-bold shadow-sm">
													{getInitials(user?.name ?? "")}
												</div>
											)}
											<div className="flex-1 min-w-0">
												<span className="text-gray-800 font-medium text-sm block truncate">
													{formatFullName(user?.name)}
												</span>
												<span className="text-gray-500 text-xs block truncate">
													{user.email}
												</span>
											</div>
										</div>
									</div>
									<button
										onClick={() =>
											handleMobileNavClick(
												user.role === "user"
													? "/dashboard/your-profile"
													: "/admin/home",
											)
										}
										className="group flex items-center justify-center space-x-2 px-3 py-2.5 text-gray-700 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 rounded-lg transition-all duration-200 border border-gray-200 hover:border-blue-300 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 font-medium cursor-pointer w-full"
									>
										<User className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
										<span>
											{user.role === "user" ? "My Account" : "Admin Dashboard"}
										</span>
									</button>
									<button
										onClick={handleLogout}
										className="group flex items-center justify-center space-x-2 w-full px-2 py-1 mt-2 text-red-700 hover:text-red-800 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 font-medium cursor-pointer"
									>
										<LogOut className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
										<span>Log Out</span>
									</button>
								</div>
							</div>
						</div>
					) : (
						<div className="space-y-4">
							<div>
								<p className="text-xs text-gray-500 font-semibold uppercase tracking-wide px-4 mb-2">
									Navigation
								</p>
								<div className="space-y-1">
									<button
										onClick={() => handleMobileNavClick("/properties")}
										className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors w-full text-left"
									>
										<Building className="h-5 w-5" />
										<span className="font-medium">Available Properties</span>
									</button>

									{/* Rent Expandable Menu */}
									<div>
										<button
											onClick={() => setRentDropdownOpen(!rentDropdownOpen)}
											className="flex items-center justify-between w-full px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
										>
											<div className="flex items-center space-x-3">
												<Home className="h-5 w-5" />
												<span className="font-medium">Rent</span>
											</div>
											<svg
												className={`w-4 h-4 transition-transform duration-200 ${
													rentDropdownOpen ? "rotate-180" : ""
												}`}
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M19 9l-7 7-7-7"
												/>
											</svg>
										</button>
										{rentDropdownOpen && (
											<div className="ml-8 mt-1 space-y-1">
												<button
													onClick={() => handleMobileNavClick("/rentals")}
													className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
												>
													All Rentals
												</button>
												<button
													onClick={() => handleMobileNavClick("/rentals/house")}
													className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
												>
													House for Rent
												</button>
												<button
													onClick={() => handleMobileNavClick("/rentals/flat")}
													className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
												>
													Flat for Rent
												</button>
												<button
													onClick={() => handleMobileNavClick("/rentals/shop")}
													className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
												>
													Shop for Rent
												</button>
											</div>
										)}
									</div>

									{/* Buy Expandable Menu */}
									<div>
										<button
											onClick={() => setBuyDropdownOpen(!buyDropdownOpen)}
											className="flex items-center justify-between w-full px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
										>
											<div className="flex items-center space-x-3">
												<Building2 className="h-5 w-5" />
												<span className="font-medium">Buy</span>
											</div>
											<svg
												className={`w-4 h-4 transition-transform duration-200 ${
													buyDropdownOpen ? "rotate-180" : ""
												}`}
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M19 9l-7 7-7-7"
												/>
											</svg>
										</button>
										{buyDropdownOpen && (
											<div className="ml-8 mt-1 space-y-1">
												<button
													onClick={() => handleMobileNavClick("/buys")}
													className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
												>
													All For Sale
												</button>
												<button
													onClick={() => handleMobileNavClick("/buys/house")}
													className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
												>
													House for Sale
												</button>
												<button
													onClick={() => handleMobileNavClick("/buys/flat")}
													className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
												>
													Flat for Sale
												</button>
												<button
													onClick={() => handleMobileNavClick("/buys/land")}
													className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
												>
													Land for Sale
												</button>
												<button
													onClick={() => handleMobileNavClick("/buys/shop")}
													className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
												>
													Shop for Sale
												</button>
											</div>
										)}
									</div>

									<button
										onClick={() => handleMobileNavClick("/about")}
										className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors w-full text-left"
									>
										<Info className="h-5 w-5" />
										<span className="font-medium">About Us</span>
									</button>
								</div>
							</div>
							<div className="pt-2 border-t border-gray-200">
								<p className="text-xs text-gray-500 font-semibold uppercase tracking-wide px-4 mb-2">
									Account
								</p>
								<div className="space-y-3">
									<button
										onClick={() => handleMobileNavClick("/login")}
										className="flex items-center justify-center px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium w-full"
									>
										Login
									</button>
									<button
										onClick={() => handleMobileNavClick("/signup")}
										className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium w-full"
									>
										Sign Up
									</button>
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
