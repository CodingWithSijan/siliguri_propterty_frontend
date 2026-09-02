import React, { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";

interface AddressInputProps {
	value: string;
	onChange: (value: string) => void;
	onSelect?: (value: string, coords?: { lat: number; lng: number }) => void;
}

const AddressInput: React.FC<AddressInputProps> = ({
	value,
	onChange,
	onSelect,
}) => {
	const inputRef = useRef<HTMLInputElement | null>(null);
	const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

	useEffect(() => {
		let placeChangedListener: google.maps.MapsEventListener | null = null;

		const loader = new Loader({
			apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
			libraries: ["places"],
		});

		loader.load().then(() => {
			if (!window.google || !inputRef.current) return;

			const westBengalBounds = {
				north: 27.3,
				south: 21.4,
				east: 89.95,
				west: 85.8,
			};

			autocompleteRef.current = new window.google.maps.places.Autocomplete(
				inputRef.current,
				{
					types: ["geocode"],
					componentRestrictions: { country: "IN" },
					bounds: westBengalBounds,
					strictBounds: false,
				},
			);

			placeChangedListener = autocompleteRef.current.addListener(
				"place_changed",
				() => {
					const place = autocompleteRef.current?.getPlace();
					if (!place) return;

					const formattedAddress = place.formatted_address || place.name || "";
					onChange(formattedAddress);

					if (onSelect && place.geometry?.location) {
						const lat = place.geometry.location.lat();
						const lng = place.geometry.location.lng();
						onSelect(formattedAddress, { lat, lng });
					}
				},
			);
		});

		return () => {
			if (placeChangedListener) {
				window.google.maps.event.removeListener(placeChangedListener);
			}
		};
	}, [onChange, onSelect]);

	return (
		<input
			ref={inputRef}
			type="text"
			value={value}
			onChange={(e) => onChange(e.target.value)}
			placeholder="Enter your address"
			className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-sky-500 focus:border-sky-500"
		/>
	);
};

export default AddressInput;
