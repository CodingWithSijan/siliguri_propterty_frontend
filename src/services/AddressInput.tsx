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

	useEffect(() => {
		const loader = new Loader({
			apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
			libraries: ["places"],
		});

		let autocomplete: google.maps.places.Autocomplete;
		let listener: google.maps.MapsEventListener;

		loader.load().then(() => {
			if (!window.google || !inputRef.current) return;

			autocomplete = new window.google.maps.places.Autocomplete(
				inputRef.current,
				{
					types: ["geocode"],
					componentRestrictions: { country: "IN" },
				}
			);

			listener = autocomplete.addListener("place_changed", () => {
				const place = autocomplete.getPlace();
				if (!place) return;

				const formattedAddress = place.formatted_address || place.name || "";
				onChange(formattedAddress);

				if (onSelect && place.geometry?.location) {
					const lat = place.geometry.location.lat();
					const lng = place.geometry.location.lng();
					onSelect(formattedAddress, { lat, lng });
				}
			});
		});

		return () => {
			if (listener) window.google.maps.event.removeListener(listener);
		};
	}, [onChange, onSelect]);

	return (
		<input
			ref={inputRef}
			type="text"
			value={value}
			onChange={(e) => onChange(e.target.value)} // no onSelect here
			placeholder="Enter your address"
			className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-sky-500 focus:border-sky-500"
		/>
	);
};

export default AddressInput;
