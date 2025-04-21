import React, { useState } from "react";
import { Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { NavLink } from "react-router-dom";
import siliguri_property_logo_noBG from "../assets/siliguri_property_logo_noBG.png";

const Navbar: React.FC = () => {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	return (
		<nav className=" bg-white shadow-md w-full z-100">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between h-16 items-center">
					{/* Logo */}
					<img
						src={siliguri_property_logo_noBG}
						className="h-[100%] w-[90px] cursor-pointer"
					></img>

					{/* Desktop Menu */}
					<div className="hidden md:flex items-center space-x-4">
						<button className="text-gray-700 hover:text-blue-600 transition">
							Login
						</button>
						<NavLink
							className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
							to="/signup"
						>
							Signup
						</NavLink>
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
					<button
						onClick={() => setIsOpen(false)}
						className="block w-full text-center text-gray-700 hover:text-blue-600"
					>
						<NavLink to="/login">Login</NavLink>
					</button>
					<button
						onClick={() => setIsOpen(false)}
						className="block w-full text-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
					>
						<NavLink to="/signup">Signup</NavLink>
					</button>
				</div>
			</Transition>
		</nav>
	);
};

export default Navbar;
