export interface IWestBengalLocation {
	value: string;
	label: string;
	lat: number;
	lng: number;
	radiusKm: number;
}

export const WEST_BENGAL_BOUNDS = {
	minLat: 21.4,
	maxLat: 27.3,
	minLng: 85.8,
	maxLng: 89.95,
};

export const WEST_BENGAL_LOCATIONS: IWestBengalLocation[] = [
	{
		value: "siliguri",
		label: "Siliguri",
		lat: 26.7271,
		lng: 88.3953,
		radiusKm: 20,
	},
	{
		value: "jalpaiguri",
		label: "Jalpaiguri",
		lat: 26.5167,
		lng: 88.7333,
		radiusKm: 22,
	},
	{
		value: "darjeeling",
		label: "Darjeeling",
		lat: 27.036,
		lng: 88.2627,
		radiusKm: 18,
	},
	{
		value: "kalimpong",
		label: "Kalimpong",
		lat: 27.062,
		lng: 88.4753,
		radiusKm: 18,
	},
	{
		value: "bagdogra",
		label: "Bagdogra",
		lat: 26.6998,
		lng: 88.3197,
		radiusKm: 14,
	},
	{
		value: "kolkata",
		label: "Kolkata",
		lat: 22.5726,
		lng: 88.3639,
		radiusKm: 30,
	},
	{
		value: "howrah",
		label: "Howrah",
		lat: 22.5958,
		lng: 88.2636,
		radiusKm: 24,
	},
	{
		value: "durgapur",
		label: "Durgapur",
		lat: 23.5204,
		lng: 87.3119,
		radiusKm: 24,
	},
	{
		value: "asansol",
		label: "Asansol",
		lat: 23.6739,
		lng: 86.9524,
		radiusKm: 24,
	},
	{
		value: "kharagpur",
		label: "Kharagpur",
		lat: 22.346,
		lng: 87.2319,
		radiusKm: 24,
	},
	{ value: "malda", label: "Malda", lat: 25.0108, lng: 88.1411, radiusKm: 24 },
	{
		value: "santiniketan",
		label: "Santiniketan",
		lat: 23.6807,
		lng: 87.683,
		radiusKm: 20,
	},
];

export const WEST_BENGAL_LOCATION_MAP = WEST_BENGAL_LOCATIONS.reduce<
	Record<string, IWestBengalLocation>
>((acc, location) => {
	acc[location.value] = location;
	return acc;
}, {});
