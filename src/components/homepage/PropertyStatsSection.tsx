import React from "react";
import { motion } from "framer-motion";
import { FaHandshake, FaMapMarkerAlt, FaShieldAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
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
			label: "Verified users",
			value: `${stats.happyCustomers}+`,
			description: "Users with verified identity and active presence.",
		},
		{
			label: "Localities covered",
			value: `${WEST_BENGAL_LOCATIONS.length}+`,
			description: "Siliguri areas mapped in search filters.",
		},
	];

	return (
		<section className="bg-white pb-16">
			<div className="mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8">
				<section className="grid gap-8 py-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
					<div className="flex flex-col justify-center">
						<p className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-700">
							Why SiliguriProperty
						</p>
						<h2 className="mt-4 max-w-xl text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">
							Property search, with a local point of view.
						</h2>
						<p className="mt-5 max-w-lg text-base leading-relaxed text-slate-600">
							Find a place in Siliguri with clearer listing details, local
							context, and a direct line to the people behind each property.
						</p>
					</div>

					<div className="divide-y divide-slate-200 border-y border-slate-200">
						{highlights.map((item, index) => {
							const Icon = item.icon;
							return (
								<motion.div
									key={item.title}
									initial={{ opacity: 0, y: 12 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true, amount: 0.4 }}
									transition={{ duration: 0.35, delay: index * 0.07 }}
									className="flex gap-4 py-5"
								>
									<span
										className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-md ${item.iconColor}`}
									>
										<Icon aria-hidden="true" />
									</span>
									<div>
										<p className="font-semibold text-slate-900">{item.title}</p>
										<p className="mt-1 text-sm leading-relaxed text-slate-600">
											{item.description}
										</p>
									</div>
								</motion.div>
							);
						})}
					</div>
				</section>

				<section className="bg-emerald-950 px-6 py-9 text-white sm:px-8 sm:py-10">
					<div className="flex flex-col gap-2 border-b border-white/15 pb-6 sm:flex-row sm:items-end sm:justify-between">
						<div>
							<p className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-300">
								Platform facts
							</p>
							<h3 className="mt-2 text-2xl font-bold sm:text-3xl">
								A live marketplace snapshot
							</h3>
						</div>
						<p className="text-sm text-emerald-100">
							Numbers update with the Siliguri property platform.
						</p>
					</div>
					<div className="grid divide-y divide-white/15 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
						{platformFacts.map((card) => (
							<motion.div
								key={card.label}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true, amount: 0.4 }}
								transition={{ duration: 0.4 }}
								className="py-5 sm:px-5 sm:first:pl-0 sm:last:pr-0"
							>
								<p className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-200">
									{card.label}
								</p>
								<p className="mt-2 text-4xl font-bold tabular-nums text-white">
									{card.value}
								</p>
								<p className="mt-3 text-sm leading-relaxed text-emerald-100">
									{card.description}
								</p>
							</motion.div>
						))}
					</div>
				</section>

				<section className="mt-8 overflow-hidden bg-emerald-900 px-6 py-8 sm:px-10 sm:py-9">
					<div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
						<div>
							<h4 className="text-2xl font-bold text-white sm:text-3xl">
								Have a property to sell or rent?
							</h4>
							<p className="mt-1 text-sm text-emerald-100">
								List it free and reach thousands of verified buyers in Siliguri
								today.
							</p>
						</div>
						<button
							type="button"
							onClick={() => navigate("/dashboard/new-post")}
							className="rounded-xl bg-white px-6 py-3 text-sm font-bold text-emerald-800 hover:bg-emerald-50"
						>
							Post Property - It's Free
						</button>
					</div>
				</section>
			</div>
		</section>
	);
};

export default PropertyStatsSection;
