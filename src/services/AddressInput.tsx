import React, { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";

interface AddressInputProps {
	value: string;
	onChange: (value: string) => void;
	onSelect?: (value: string) => void;
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

			autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
				types: ["geocode"],
				componentRestrictions: { country: "IN" },
			});

			listener = autocomplete.addListener("place_changed", () => {
				const place = autocomplete.getPlace();
				if (typeof onChange === "function") {
					if (place.formatted_address) {
						onChange(place.formatted_address);
					} else if (place.name) {
						onChange(place.name);
					}
					if (typeof onSelect === "function") {
						if (place.formatted_address) {
							onSelect(place.formatted_address);
						} else if (place.name) {
							onSelect(place.name);
						}
					}
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
			onChange={(e) => {
				if (typeof onChange === "function") {
					onChange(e.target.value);
				}

				if (typeof onSelect === "function") {
					onSelect(e.target.value);
				}
			}}
			placeholder="Enter your address"
			className="w-full px-4 py-2 mt-1 border rounded-md  focus:ring-sky-500 focus:border-sky-500"
		/>
	);
};

export default AddressInput;
