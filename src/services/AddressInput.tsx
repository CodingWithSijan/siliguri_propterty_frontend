import React, { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";

interface AddressInputProps {
	value: string;
	onChange: (value: string) => void;
}

const AddressInput: React.FC<AddressInputProps> = ({ value, onChange }) => {
	const inputRef = useRef<HTMLInputElement | null>(null);

	useEffect(() => {
		const loader = new Loader({
			apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY, // 🔐 replace with .env value if needed
			libraries: ["places"],
		});

		let autocomplete: google.maps.places.PlaceAutocompleteElement;
		let listener: google.maps.MapsEventListener;

		loader.load().then(() => {
			if (!window.google || !inputRef.current) return;

			autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
				types: ["geocode"],
				componentRestrictions: { country: "IN" },
			});

			listener = autocomplete.addListener("place_changed", () => {
				const place = autocomplete.getPlace();
				if (place.formatted_address) {
					onChange(place.formatted_address);
				} else if (place.name) {
					onChange(place.name);
				}
			});
		});

		return () => {
			if (listener) {
				google.maps.event.removeListener(listener);
			}
		};
	}, []);

	return (
		<input
			ref={inputRef}
			type="text"
			value={value}
			onChange={(e) => onChange(e.target.value)}
			placeholder="Enter your address"
			className="w-full px-4 py-2 mt-1 border rounded-md border-sky-500 focus:ring-sky-500 focus:border-sky-500"
		/>
	);
};

export default AddressInput;
