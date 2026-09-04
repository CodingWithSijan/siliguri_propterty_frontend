import React from "react";
import Navbar from "../components/header_and_footer/Navbar";
import Footer from "../components/header_and_footer/Footer";
import Breadcrumb from "../lib/Breadcrumb";

const Terms: React.FC = () => {
	return (
		<>
			<Navbar />
			<Breadcrumb items={[{ label: "Terms", path: "/terms" }]} />
			<main className="mx-auto w-full max-w-4xl px-4 py-8 md:px-6">
				<section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
					<h1 className="mb-4 text-2xl font-bold text-slate-900 md:text-3xl">
						Terms and Conditions
					</h1>
					<p className="mb-4 text-slate-700">
						By using Siliguri Property, you agree to use the platform lawfully
						and provide accurate details when posting or inquiring about
						properties.
					</p>
					<p className="mb-4 text-slate-700">
						Listings are user-generated. While we work to maintain quality and
						moderation, users must independently verify property details before
						any transaction.
					</p>
					<p className="text-slate-700">
						We may update these terms as the platform evolves. Continued usage
						means acceptance of the latest terms.
					</p>
				</section>
			</main>
			<Footer />
		</>
	);
};

export default Terms;
