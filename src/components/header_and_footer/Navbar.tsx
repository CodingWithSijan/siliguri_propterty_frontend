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
					<div className="hidden md:flex items-center space-x-6 ml-8">
						<NavLink
							to="/properties"
							className={({ isActive }) =>
								isActive
									? "text-blue-600 font-semibold border-b-2 border-blue-600 pb-1"
									: "text-gray-700 hover:text-blue-600 font-medium transition-colors"
							}
						>
							All Properties
						</NavLink>
						<NavLink
							to="/rentals"
							className={({ isActive }) =>
								isActive
									? "text-blue-600 font-semibold border-b-2 border-blue-600 pb-1"
									: "text-gray-700 hover:text-blue-600 font-medium transition-colors"
							}
						>
							Property for rent
						</NavLink>
						<NavLink
							to="/buys"
							className={({ isActive }) =>
								isActive
									? "text-blue-600 font-semibold border-b-2 border-blue-600 pb-1"
									: "text-gray-700 hover:text-blue-600 font-medium transition-colors"
							}
						>
							Property for sale
						</NavLink>
						<NavLink
							to="/about"
							className={({ isActive }) =>
								isActive
									? "text-blue-600 font-semibold border-b-2 border-blue-600 pb-1"
									: "text-gray-700 hover:text-blue-600 font-medium transition-colors"
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
									whileTap={{ scale: 0.97 }}
									className="flex items-center space-x-3 cursor-pointer bg-gray-50 px-4 py-2 rounded-lg border border-gray-200"
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
										className="absolute right-0 mt-3 w-56 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200"
									>
										<NavLink
											to={user.role === "user" ? "/dashboard" : "/admin"}
											className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
										>
											{user.role === "user"
												? "User Dashboard"
												: "Admin Dashboard"}
										</NavLink>
										<button
											onClick={handleLogout}
											className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
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
					className="md:hidden px-4 pt-4 pb-6 bg-white shadow-lg rounded-b-2xl border-t border-gray-200"
					ref={mobileMenuRef}
				>
					{user ? (
						<div className="space-y-4">
							<div className="flex items-center space-x-3 px-4 py-2 border-b border-gray-200 mb-2">
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
								<span className="text-gray-800 font-medium text-base">
									{formatFullName(user?.name)}
								</span>
							</div>
							<div>
								<p className="text-xs text-gray-500 font-semibold uppercase tracking-wide px-4 mb-2">
									Navigation
								</p>
								<div className="space-y-1">
									<NavLink
										to="/properties"
										className="block w-full text-gray-700 hover:text-blue-600 px-4 py-2 rounded-md"
									>
										🏘️ All Properties
									</NavLink>
									<NavLink
										to="/rentals"
										className="block w-full text-gray-700 hover:text-blue-600 px-4 py-2 rounded-md"
									>
										🏠 Property for rent
									</NavLink>
									<NavLink
										to="/buys"
										className="block w-full text-gray-700 hover:text-blue-600 px-4 py-2 rounded-md"
									>
										💼 Property for sale
									</NavLink>
									<NavLink
										to="/about"
										className="block w-full text-gray-700 hover:text-blue-600 px-4 py-2 rounded-md"
									>
										ℹ️ About Us
									</NavLink>
								</div>
							</div>
							<div className="pt-2 border-t border-gray-200">
								<p className="text-xs text-gray-500 font-semibold uppercase tracking-wide px-4 mb-2">
									Account
								</p>
								<div className="space-y-2">
									<NavLink
										to={user.role === "user" ? "/dashboard" : "/admin"}
										className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
									>
										{user.role === "user"
											? "User Dashboard"
											: "Admin Dashboard"}
									</NavLink>
									<button
										onClick={handleLogout}
										className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-md"
									>
										Logout
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
									<NavLink
										to="/properties"
										className="block w-full text-gray-700 hover:text-blue-600 px-4 py-2 rounded-md"
									>
										🏘️ All Properties
									</NavLink>
									<NavLink
										to="/rentals"
										className="block w-full text-gray-700 hover:text-blue-600 px-4 py-2 rounded-md"
									>
										🏠 Property for rent
									</NavLink>
									<NavLink
										to="/buys"
										className="block w-full text-gray-700 hover:text-blue-600 px-4 py-2 rounded-md"
									>
										💼 Property for sale
									</NavLink>
									<NavLink
										to="/about"
										className="block w-full text-gray-700 hover:text-blue-600 px-4 py-2 rounded-md"
									>
										ℹ️ About Us
									</NavLink>
								</div>
							</div>
							<div className="pt-2 border-t border-gray-200">
								<p className="text-xs text-gray-500 font-semibold uppercase tracking-wide px-4 mb-2">
									Account
								</p>
								<div className="space-y-2">
									<NavLink
										to="/login"
										className="block w-full text-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
									>
										Login
									</NavLink>
									<NavLink
										to="/signup"
										className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
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
