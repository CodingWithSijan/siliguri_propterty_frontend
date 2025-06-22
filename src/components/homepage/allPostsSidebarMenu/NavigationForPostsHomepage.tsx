import React, { useState } from "react";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuList,
} from "../../ui/navigation-menu";
import { Switch } from "../../ui/switch";
import { Label } from "../../ui/label";
import { Slider } from "../../ui/slider";
import { Button } from "../../ui/button";

const propertyTypes = ["All", "House", "Flat", "Land", "Shop"];

const NavigationForPostsHomepage: React.FC = () => {
	const [filters, setFilters] = useState({
		buyOnly: false,
		rentOnly: false,
		priceRange: [0, 100],
		propertyType: "All",
	});

	const handleSwitch = (key: "buyOnly" | "rentOnly" | "sellOnly") => {
		setFilters((prev) => ({
			...prev,
			[key]: !prev[key],
		}));
	};

	const handlePriceChange = (val: number[]) => {
		setFilters((prev) => ({ ...prev, priceRange: val }));
	};

	const handleClear = () => {
		setFilters({
			buyOnly: false,
			rentOnly: false,
			priceRange: [0, 100],
			propertyType: "All",
		});
	};

	return (
		<section className=" flex justify-center my-4 w-[90vw] mx-auto px-4">
			<NavigationMenu className="border rounded-xl shadow-md p-6 w-full bg-white">
				<NavigationMenuList className="flex flex-wrap gap-6 justify-between items-center">
					{/* Rent Filter */}
					<NavigationMenuItem className="flex items-center gap-2">
						<Switch
							id="rent-only"
							checked={filters.rentOnly}
							onCheckedChange={() => handleSwitch("rentOnly")}
						/>
						<Label htmlFor="rent-only">Rent Only</Label>
					</NavigationMenuItem>

					{/* Buy Filter */}
					<NavigationMenuItem className="flex items-center gap-2">
						<Switch
							id="buy-only"
							checked={filters.buyOnly}
							onCheckedChange={() => handleSwitch("buyOnly")}
						/>
						<Label htmlFor="buy-only">Buy Only</Label>
					</NavigationMenuItem>

					{/* Price Range Slider */}
					<NavigationMenuItem className="flex flex-col">
						<Label htmlFor="price-range" className="mb-1">
							Price Range (in Lakhs): {filters.priceRange[0]}L -{" "}
							{filters.priceRange[1]}L
						</Label>
						<Slider
							id="price-range"
							defaultValue={filters.priceRange}
							value={filters.priceRange}
							onValueChange={handlePriceChange}
							max={200}
							min={0}
							step={5}
							className="w-52"
						/>
					</NavigationMenuItem>

					{/* Property Type Dropdown */}
					<NavigationMenuItem className="flex flex-col">
						<Label htmlFor="property-type" className="mb-1">
							Property Type
						</Label>
						<select
							id="property-type"
							value={filters.propertyType}
							onChange={(e) =>
								setFilters((prev) => ({
									...prev,
									propertyType: e.target.value,
								}))
							}
							className="border rounded px-3 py-2 w-44"
						>
							{propertyTypes.map((type) => (
								<option key={type} value={type}>
									{type}
								</option>
							))}
						</select>
					</NavigationMenuItem>

					{/* Clear Button */}
					<NavigationMenuItem>
						<Button variant="outline" onClick={handleClear}>
							Clear Filters
						</Button>
					</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu>
		</section>
	);
};

export default NavigationForPostsHomepage;
