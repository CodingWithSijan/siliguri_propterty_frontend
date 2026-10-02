import fs from "node:fs/promises";
import path from "node:path";

const distDir = path.join(process.cwd(), "dist");

const read = async (file) => fs.readFile(path.join(distDir, file), "utf8");

const assert = (condition, message) => {
	if (!condition) {
		throw new Error(message);
	}
};

const includes = (value, needle) =>
	String(value).toLowerCase().includes(String(needle).toLowerCase());

const main = async () => {
	const home = await read("index.html");
	const buysLand = await read(path.join("buys", "land", "index.html"));
	const locality = await read(path.join("locality", "matigara", "index.html"));
	const properties = await read(path.join("properties", "index.html"));
	const sitemap = await read("sitemap.xml");

	assert(
		includes(home, "Properties in Siliguri | Buy, Rent & Sell"),
		"Homepage title metadata missing",
	);
	assert(
		includes(buysLand, "Land for Sale in Siliguri"),
		"Category page title metadata missing",
	);
	assert(
		includes(locality, "Property in Matigara"),
		"Locality page title metadata missing",
	);
	assert(
		includes(properties, "All Property Listings in Siliguri"),
		"Properties page title metadata missing",
	);

	assert(
		includes(home, "<h1") && includes(home, "Properties in Siliguri"),
		"Homepage initial HTML content missing",
	);
	assert(
		includes(buysLand, "<h1") &&
			includes(buysLand, "Land for Sale in Siliguri"),
		"Category initial HTML content missing",
	);

	assert(includes(sitemap, "<urlset"), "Sitemap XML not generated");
	assert(
		includes(sitemap, "https://siliguriproperty.in/"),
		"Sitemap homepage URL missing",
	);
	assert(
		!includes(sitemap, "?intent=sell&category") || includes(sitemap, "&amp;"),
		"Sitemap escaping check failed",
	);

	console.log("SEO artifact checks passed.");
};

main().catch((error) => {
	console.error("SEO artifact checks failed.", error);
	process.exitCode = 1;
});
