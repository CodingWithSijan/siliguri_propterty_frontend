import React from "react";

const PrivacyPolicy: React.FC = () => {
	return (
		<div className="min-h-screen bg-gray-50 py-12">
			<div className="max-w-5xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-lg border border-gray-200">
				<header className="mb-8">
					<h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
						Privacy Policy
					</h1>
					<p className="mt-2 text-sm text-gray-600">
						Last updated: August 28, 2025
					</p>
				</header>

				<article className="prose prose-neutral max-w-none">
					<p>
						Welcome to Siliguri Property. This Privacy Policy explains how we
						collect, use, disclose, and safeguard your information when you
						visit our website and use our services.
					</p>

					<h2>Information We Collect</h2>
					<p>
						We collect information to provide and improve our services. Types of
						data we collect include:
					</p>
					<ul>
						<li>
							<strong>Personal Information:</strong> name, email address, phone
							number, profile picture, and other contact details you provide
							when creating an account or posting a listing.
						</li>
						<li>
							<strong>Listing Data:</strong> property title, description,
							address, coordinates, price, photos, and other data you include
							when posting or editing a listing.
						</li>
						<li>
							<strong>Usage Data:</strong> information about how you access and
							interact with the site, including IP address, browser type, pages
							visited, and timestamps.
						</li>
						<li>
							<strong>Cookies and Similar Technologies:</strong> we use cookies
							and local storage to improve your experience, remember
							preferences, and analyze usage.
						</li>
					</ul>

					<h2>How We Use Your Information</h2>
					<ul>
						<li>
							To provide, maintain, and improve our services and features.
						</li>
						<li>
							To process and display your property listings and related content.
						</li>
						<li>
							To communicate with you about your account, listings, and support
							requests.
						</li>
						<li>
							To detect and prevent fraud, abuse, and other illegal activities.
						</li>
					</ul>

					<h2>Geolocation and Coordinates</h2>
					<p>
						When you provide a property location we may convert the address into
						geographic coordinates (latitude and longitude) using a third-party
						geocoding service. If you choose to use client-side geocoding, note
						that API keys for third-party services may be exposed; we recommend
						server-side geocoding whenever possible.
					</p>

					<h2>Sharing Your Information</h2>
					<p>
						We do not sell your personal information. We may share information
						with:
					</p>
					<ul>
						<li>
							Service providers who help us operate and secure the site
							(hosting, analytics, email delivery).
						</li>
						<li>
							Law enforcement or regulators where required by law or to protect
							our rights.
						</li>
					</ul>

					<h2>Data Retention</h2>
					<p>
						We retain your information for as long as necessary to provide our
						services, comply with legal obligations, resolve disputes, and
						enforce our agreements.
					</p>

					<h2>Your Rights</h2>
					<p>
						Depending on your jurisdiction, you may have the right to access,
						correct, delete, or restrict processing of your personal data. To
						exercise these rights, contact us using the details below.
					</p>

					<h2>Security</h2>
					<p>
						We use reasonable administrative, technical, and physical safeguards
						to protect personal information. However, no method of transmission
						over the internet is completely secure.
					</p>

					<h2>Children's Privacy</h2>
					<p>
						Our services are not intended for children under 13. We do not
						knowingly collect personal information from children under 13. If
						you believe we have collected such information, contact us and we
						will take steps to remove it.
					</p>

					<h2>Changes to This Policy</h2>
					<p>
						We may update this Privacy Policy from time to time. We will post
						the updated policy on this page with a revised effective date.
					</p>

					<h2>Contact Us</h2>
					<p>
						If you have questions or requests about this policy, contact us at:
					</p>
					<p>
						<strong>Email:</strong> siliguriproperty@gmail.com
					</p>
				</article>
			</div>
		</div>
	);
};

export default PrivacyPolicy;
