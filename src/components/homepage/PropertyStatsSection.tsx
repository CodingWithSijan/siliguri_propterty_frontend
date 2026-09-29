import React from "react";
import { motion } from "framer-motion";
import { FaHandshake, FaMapMarkerAlt, FaShieldAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSiteStats } from "../../hooks/use-SiteStats";
import { WEST_BENGAL_LOCATIONS } from "../../constants/westBengalLocations";

const PropertyStatsSection: React.FC = () => {
	const navigate = useNavigate();
	const { stats } = useSiteStats();
	const highlights = [
		{
			icon: FaShieldAlt,
			iconColor: "bg-emerald-100 text-emerald-700",
			title: "Verified listings only",
			description:
				"Every property is reviewed by our local team before it goes live.",
		},
		{
			icon: FaMapMarkerAlt,
			iconColor: "bg-amber-100 text-amber-700",
			title: "Deep local knowledge",
			description:
				"Siliguri-first data and locality coverage that reflects real buyer demand.",
		},
		{
			icon: FaHandshake,
			iconColor: "bg-rose-100 text-rose-700",
			title: "Transparent pricing",
			description:
				"No hidden brokerage commitments from platform-side listing visibility.",
		},
	];

	const platformFacts = [
		{
			label: "Active listings",
			value: `${stats.propertiesListed}+`,
			description: "Approved listings visible across the platform.",
		},
		{
			label: "Users",
			value: `${stats.totalUsers}+`,
			description: "All registered users on the platform.",
		},
		{
			label: "Localities covered",
			value: `${WEST_BENGAL_LOCATIONS.length}+`,
			description: "Siliguri areas mapped in search filters.",
		},
	];

	const popularLocalityLinks = [
		{ label: "Siliguri", to: "/locality/siliguri" },
		{ label: "Matigara", to: "/locality/matigara" },
		{ label: "Bagdogra", to: "/locality/bagdogra" },
		{ label: "Pradhan Nagar", to: "/locality/pradhan-nagar" },
		{ label: "Sevoke Road", to: "/locality/sevoke-road" },
	];

	return (
		<section className="bg-slate-50 pb-10 sm:pb-12 lg:pb-16">
			<div className="mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8">
				<section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 lg:p-10">
					<div className="grid gap-7 lg:grid-cols-[0.88fr_1.12fr] lg:gap-10">
						<div className="flex flex-col justify-center">
							<p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
								Why SiliguriProperty
							</p>
							<h2 className="mt-3 max-w-xl text-2xl font-bold leading-tight text-slate-900 sm:mt-4 sm:text-4xl lg:text-5xl">
								Property search, with a local point of view.
							</h2>
							<p className="mt-3 max-w-lg text-sm leading-relaxed text-slate-600 sm:mt-5 sm:text-base">
								Find a place in Siliguri with clearer listing details, local
								context, and a direct line to the people behind each property.
							</p>
						</div>

						<div className="mt-1 grid gap-3 sm:grid-cols-2 lg:mt-0 lg:grid-cols-1">
							{highlights.map((item, index) => {
								const Icon = item.icon;
								return (
									<motion.div
										key={item.title}
										initial={{ opacity: 0, y: 12 }}
										whileInView={{ opacity: 1, y: 0 }}
										viewport={{ once: true, amount: 0.3 }}
										transition={{ duration: 0.35, delay: index * 0.07 }}
										className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5"
									>
										<div className="flex gap-3 sm:gap-4">
											<span
												className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg sm:h-11 sm:w-11 ${item.iconColor}`}
											>
												<Icon aria-hidden="true" />
											</span>
											<div>
												<p className="font-semibold text-slate-900">
													{item.title}
												</p>
												<p className="mt-1 text-sm leading-relaxed text-slate-600">
													{item.description}
												</p>
											</div>
										</div>
									</motion.div>
								);
							})}
						</div>
					</div>
				</section>

				<section className="mt-6 rounded-2xl border border-slate-200 bg-white px-4 py-6 sm:mt-8 sm:px-8 sm:py-8">
					<div className="flex flex-col gap-2 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
						<div>
							<p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
								Platform facts
							</p>
							<h3 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
								A live marketplace snapshot
							</h3>
						</div>
					</div>
					<div className="mt-6 grid gap-3 sm:grid-cols-3 sm:gap-4">
						{platformFacts.map((card) => (
							<motion.div
								key={card.label}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true, amount: 0.4 }}
								transition={{ duration: 0.4 }}
								className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5"
							>
								<p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
									{card.label}
								</p>
								<p className="mt-2 text-3xl font-bold tabular-nums text-slate-900 sm:text-4xl">
									{card.value}
								</p>
								<p className="mt-3 text-sm leading-relaxed text-slate-600">
									{card.description}
								</p>
							</motion.div>
						))}
					</div>
				</section>

				<section className="mt-6 rounded-2xl border border-slate-200 bg-white px-4 py-6 sm:mt-8 sm:px-8 sm:py-8">
					<div className="flex flex-col gap-2 border-b border-slate-200 pb-5">
						<p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
							Popular localities
						</p>
						<h3 className="text-2xl font-bold text-slate-900 sm:text-3xl">
							Explore property by locality in Siliguri
						</h3>
					</div>
					<div className="mt-5 flex flex-wrap gap-2.5">
						{popularLocalityLinks.map((item) => (
							<Link
								key={item.to}
								to={item.to}
								className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800"
							>
								{item.label}
							</Link>
						))}
					</div>
				</section>

				<section className="mt-6 overflow-hidden rounded-2xl border border-gray-100 bg-gray-100 px-4 py-6 sm:mt-8 sm:px-10 sm:py-8">
					<div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
						<div>
							<h4 className="text-xl font-bold text-emerald-900 sm:text-3xl">
								Have a property to sell or rent?
							</h4>
							<p className="mt-1 text-sm text-emerald-800">
								List it free and reach buyers in Siliguri today.
							</p>
						</div>
						<button
							type="button"
							onClick={() => navigate("/dashboard/new-post")}
							className="rounded-xl border border-emerald-100 bg-white px-5 py-3 text-sm font-bold text-emerald-800 shadow-sm transition hover:bg-emerald-100"
						>
							Post Property It's Free
						</button>
					</div>
				</section>
			</div>
		</section>
	);
};

export default PropertyStatsSection;
