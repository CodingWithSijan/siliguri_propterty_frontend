import React from "react";
import { motion } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";
import WhyImage from "../../assets/image.png";
import { useNavigate } from "react-router-dom";
import { useSiteStats } from "../../hooks/use-SiteStats";
import { WEST_BENGAL_LOCATIONS } from "../../constants/westBengalLocations";

const PropertyStatsSection: React.FC = () => {
	const navigate = useNavigate();
	const { stats } = useSiteStats();
	const highlights = [
		{
			title: "Verified listings only",
			description:
				"Every property is reviewed by our local team before it goes live.",
		},
		{
			title: "Deep local knowledge",
			description:
				"Siliguri-first data and locality coverage that reflects real buyer demand.",
		},
		{
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
				<section className="grid items-center gap-8 py-12 lg:grid-cols-2">
					<div className="overflow-hidden rounded-3xl">
						<img
							src={WhyImage}
							alt="Local property experts"
							className="h-[360px] w-full object-cover"
						/>
					</div>
					<div>
						<p className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-700">
							Why SiliguriProperty
						</p>
						<h3 className="mt-3 text-5xl font-bold leading-tight text-slate-900">
							Local expertise, verified listings, zero brokerage confusion.
						</h3>
						<div className="mt-6 space-y-4">
							{highlights.map((item) => (
								<div
									key={item.title}
									className="flex gap-3 rounded-xl bg-emerald-50 p-3"
								>
									<FaCheckCircle className="mt-1 text-emerald-600" />
									<div>
										<p className="font-semibold text-slate-900">{item.title}</p>
										<p className="text-sm text-slate-600">{item.description}</p>
									</div>
								</div>
							))}
						</div>
					</div>
				</section>

				<section className="rounded-sm bg-emerald-950 px-6 py-12 text-white sm:px-8">
					<p className="text-center text-xs font-semibold uppercase tracking-[0.12em] text-emerald-300">
						Platform facts
					</p>
					<h3 className="mt-2 text-center text-4xl font-bold">
						Live marketplace snapshot
					</h3>
					<div className="mt-8 grid gap-4 lg:grid-cols-3">
						{platformFacts.map((card) => (
							<motion.div
								key={card.label}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.4 }}
								className="rounded-2xl border border-emerald-800 bg-emerald-900/40 p-5"
							>
								<p className="text-xs uppercase tracking-[0.12em] text-emerald-200">
									{card.label}
								</p>
								<p className="mt-2 text-4xl font-bold text-white">
									{card.value}
								</p>
								<p className="mt-3 text-sm leading-relaxed text-emerald-100">
									{card.description}
								</p>
							</motion.div>
						))}
					</div>
				</section>

				<section className="mt-10 overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900 px-6 py-10 sm:px-10">
					<div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
						<div>
							<h4 className="text-4xl font-bold text-white">
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
