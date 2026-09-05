import { WEST_BENGAL_BOUNDS } from "../constants/westBengalLocations";

export interface IGeoPoint {
	lat: number;
	lng: number;
}

const EARTH_RADIUS_KM = 6371;

const toRad = (deg: number): number => (deg * Math.PI) / 180;

export const getDistanceKm = (from: IGeoPoint, to: IGeoPoint): number => {
	const dLat = toRad(to.lat - from.lat);
	const dLng = toRad(to.lng - from.lng);
	const lat1 = toRad(from.lat);
	const lat2 = toRad(to.lat);

	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);

	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	return EARTH_RADIUS_KM * c;
};

export const isWithinWestBengal = (coords: IGeoPoint): boolean => {
	return (
		coords.lat >= WEST_BENGAL_BOUNDS.minLat &&
		coords.lat <= WEST_BENGAL_BOUNDS.maxLat &&
		coords.lng >= WEST_BENGAL_BOUNDS.minLng &&
		coords.lng <= WEST_BENGAL_BOUNDS.maxLng
	);
};
