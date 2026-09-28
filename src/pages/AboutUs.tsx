import React from "react";
import {
	FaArrowRight,
	FaHandshake,
	FaEnvelope,
	FaFacebook,
	FaInstagram,
	FaMapMarkerAlt,
	FaSearch,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import Navbar from "../components/header_and_footer/Navbar";
import Footer from "../components/header_and_footer/Footer";

const approach = [
	{
		icon: FaMapMarkerAlt,
		iconColor: "text-amber-700",
		title: "Start with the area",
		description:
			"Use locality and property type to narrow the search to places worth a closer look.",
	},
	{
		icon: FaSearch,
		iconColor: "text-emerald-700",
		title: "Compare the details",
		description:
			"See the listed price, photos, amenities, and property facts together.",
	},
	{
		icon: FaHandshake,
		iconColor: "text-rose-700",
		title: "Talk to the listing owner",
		description:
			"Send an enquiry through the platform when you want more information.",
	},
];

const searchSteps = [
	"Choose buy or rent and narrow the search by locality and property type.",
	"Review the listing details, photos, and price information.",
	"Contact the listing owner when you find a place worth exploring.",
];

const ownerSteps = [
	"Create a listing with the property information and photos.",
	"Keep track of your posts from your personal dashboard.",
	"Respond to interested people through the platform's message flow.",
];

const AboutUs: React.FC = () => {
	return (
		<div className="flex min-h-screen flex-col bg-white text-slate-900">
			<Navbar />

			<main className="w-full flex-1">
				<section className="bg-[#f1f5f1]">
					<div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:px-8">
						<div>
							<p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-800">
								A local property marketplace
							</p>
							<h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-tight text-slate-950">
								Siliguri property, made easier to navigate.
							</h1>
							<p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-700 sm:text-lg">
								Browse homes and land for sale or rent in Siliguri and nearby
								areas. Compare the details, then contact the person who listed
								the property.
							</p>
						</div>

						<nav
							aria-label="Explore Siliguri Property"
							className="border-y border-emerald-900/20"
						>
							<Link
								to="/properties"
								className="group flex items-center justify-between gap-4 border-b border-emerald-900/20 py-5 text-slate-900 transition-colors hover:text-emerald-800"
							>
								<span>
									<span className="block text-xs font-semibold uppercase tracking-wide text-emerald-800">
										For buyers and renters
									</span>
									<span className="mt-1 block text-lg font-bold">
										Explore properties
									</span>
								</span>
								<FaArrowRight
									className="shrink-0 transition-transform group-hover:translate-x-1"
									aria-hidden="true"
								/>
							</Link>
							<Link
								to="/dashboard/new-post"
								className="group flex items-center justify-between gap-4 py-5 text-slate-900 transition-colors hover:text-emerald-800"
							>
								<span>
									<span className="block text-xs font-semibold uppercase tracking-wide text-emerald-800">
										For property owners
									</span>
									<span className="mt-1 block text-lg font-bold">
										Create a listing
									</span>
								</span>
								<FaArrowRight
									className="shrink-0 transition-transform group-hover:translate-x-1"
									aria-hidden="true"
								/>
							</Link>
						</nav>
					</div>
				</section>

				<section className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16 lg:px-8">
					<div>
						<p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-700">
							What matters
						</p>
						<h2 className="mt-3 max-w-md text-3xl font-bold leading-tight text-slate-950">
							Useful details beat big promises.
						</h2>
						<p className="mt-4 max-w-md leading-relaxed text-slate-600">
							A search often starts with a budget, an area, or a type of home.
							We make those details easier to find and compare.
						</p>
					</div>
					<div className="divide-y divide-slate-200 border-y border-slate-200">
						{approach.map((item) => {
							const Icon = item.icon;
							return (
								<div key={item.title} className="flex gap-4 py-5">
									<Icon
										className={`mt-1 shrink-0 ${item.iconColor}`}
										aria-hidden="true"
									/>
									<div>
										<h3 className="font-bold text-slate-900">{item.title}</h3>
										<p className="mt-1 text-sm leading-relaxed text-slate-600">
											{item.description}
										</p>
									</div>
								</div>
							);
						})}
					</div>
				</section>

				<section className="bg-[#f4f6f3]">
					<div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
						<p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-700">
							How it works
						</p>
						<h2 className="mt-3 max-w-2xl text-3xl font-bold leading-tight text-slate-950">
							Looking for a place? Listing one?
						</h2>
						<div className="mt-8 grid gap-8 md:grid-cols-2 md:gap-12">
							<article className="border-t-2 border-emerald-700 pt-5">
								<p className="text-xs font-bold uppercase tracking-wide text-emerald-800">
									Find a property
								</p>
								<h3 className="mt-2 text-xl font-bold text-slate-950">
									For buyers and renters
								</h3>
								<ol className="mt-5 space-y-3">
									{searchSteps.map((step, index) => (
										<li
											key={step}
											className="flex gap-3 text-sm leading-relaxed text-slate-700"
										>
											<span className="font-medium text-emerald-800">
												{index + 1}.
											</span>
											<span>{step}</span>
										</li>
									))}
								</ol>
								<Link
									to="/properties"
									className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-emerald-800 hover:text-emerald-950"
								>
									Browse listings <FaArrowRight aria-hidden="true" />
								</Link>
							</article>
							<article className="border-t-2 border-amber-600 pt-5">
								<p className="text-xs font-bold uppercase tracking-wide text-amber-800">
									List a property
								</p>
								<h3 className="mt-2 text-xl font-bold text-slate-950">
									For property owners
								</h3>
								<ol className="mt-5 space-y-3">
									{ownerSteps.map((step, index) => (
										<li
											key={step}
											className="flex gap-3 text-sm leading-relaxed text-slate-700"
										>
											<span className="font-medium text-amber-800">
												{index + 1}.
											</span>
											<span>{step}</span>
										</li>
									))}
								</ol>
								<Link
									to="/dashboard/new-post"
									className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-amber-800 hover:text-amber-950"
								>
									List a property <FaArrowRight aria-hidden="true" />
								</Link>
							</article>
						</div>
					</div>
				</section>

				<section className="bg-emerald-950 text-white">
					<div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
						<div>
							<p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-300">
								Get in touch
							</p>
							<h2 className="mt-2 text-3xl font-bold">
								Need a hand? Get in touch.
							</h2>
							<a
								href="mailto:siliguriproperty@gmail.com"
								className="mt-4 inline-flex items-center gap-3 text-base text-white transition-colors hover:text-emerald-200"
							>
								<FaEnvelope aria-hidden="true" />
								siliguriproperty@gmail.com
							</a>
						</div>
						<div className="flex items-center gap-3">
							<a
								href="https://www.facebook.com/landmarkinfratechproperty/"
								aria-label="Siliguri Property on Facebook"
								target="_blank"
								rel="noreferrer"
								className="flex h-11 w-11 items-center justify-center rounded-md border border-white/25 text-lg text-white transition-colors hover:bg-white/10"
							>
								<FaFacebook aria-hidden="true" />
							</a>
							<a
								href="https://www.instagram.com/linfratech"
								aria-label="Siliguri Property on Instagram"
								target="_blank"
								rel="noreferrer"
								className="flex h-11 w-11 items-center justify-center rounded-md border border-white/25 text-lg text-white transition-colors hover:bg-white/10"
							>
								<FaInstagram aria-hidden="true" />
							</a>
						</div>
					</div>
				</section>
			</main>

			<Footer />
		</div>
	);
};

export default AboutUs;
