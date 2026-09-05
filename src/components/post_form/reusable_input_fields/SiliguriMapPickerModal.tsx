import React, { useEffect, useRef, useState } from "react";
import { useCallback } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { MapPin } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "../../ui/dialog";
import { Button } from "../../ui/button";

interface ICoords {
	lat: number;
	lng: number;
}

interface SiliguriMapPickerModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	initialCoords?: ICoords | null;
	onConfirm: (payload: { coords: ICoords; address: string }) => void;
}

const SILIGURI_CENTER: ICoords = {
	lat: 26.7271,
	lng: 88.3953,
};

const SILIGURI_BOUNDS = {
	north: 26.83,
	south: 26.62,
	east: 88.5,
	west: 88.28,
};

const SiliguriMapPickerModal: React.FC<SiliguriMapPickerModalProps> = ({
	open,
	onOpenChange,
	initialCoords,
	onConfirm,
}) => {
	const mapContainerRef = useRef<HTMLDivElement | null>(null);
	const mapRef = useRef<google.maps.Map | null>(null);
	const markerRef = useRef<google.maps.Marker | null>(null);
	const geocoderRef = useRef<google.maps.Geocoder | null>(null);
	const [selectedCoords, setSelectedCoords] = useState<ICoords | null>(
		initialCoords ?? null,
	);
	const [selectedAddress, setSelectedAddress] = useState<string>("");
	const [loadingAddress, setLoadingAddress] = useState(false);

	const reverseGeocode = useCallback((coords: ICoords) => {
		if (!geocoderRef.current) {
			setSelectedAddress("");
			return;
		}

		setLoadingAddress(true);
		geocoderRef.current.geocode({ location: coords }, (results, status) => {
			if (status === "OK" && results && results.length > 0) {
				setSelectedAddress(results[0].formatted_address);
			} else {
				setSelectedAddress("");
			}
			setLoadingAddress(false);
		});
	}, []);

	const placeMarker = useCallback(
		(coords: ICoords) => {
		if (!mapRef.current) {
			return;
		}

		if (!markerRef.current) {
			markerRef.current = new window.google.maps.Marker({
				position: coords,
				map: mapRef.current,
				draggable: true,
				title: "Selected location",
			});

			markerRef.current.addListener("dragend", (event: google.maps.MapMouseEvent) => {
				if (!event.latLng) {
					return;
				}
				const next = { lat: event.latLng.lat(), lng: event.latLng.lng() };
				setSelectedCoords(next);
				reverseGeocode(next);
			});
		} else {
			markerRef.current.setPosition(coords);
		}

		setSelectedCoords(coords);
		reverseGeocode(coords);
		},
		[reverseGeocode],
	);

	useEffect(() => {
		if (!open) {
			return;
		}

		const loader = new Loader({
			apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
			libraries: ["places"],
		});

		loader.load().then(() => {
			if (!mapContainerRef.current || !window.google) {
				return;
			}

			const center = initialCoords ?? SILIGURI_CENTER;
			const bounds = new window.google.maps.LatLngBounds(
				{ lat: SILIGURI_BOUNDS.south, lng: SILIGURI_BOUNDS.west },
				{ lat: SILIGURI_BOUNDS.north, lng: SILIGURI_BOUNDS.east },
			);

			if (!mapRef.current) {
				mapRef.current = new window.google.maps.Map(mapContainerRef.current, {
					center,
					zoom: 13,
					mapTypeControl: false,
					streetViewControl: false,
					fullscreenControl: false,
					restriction: {
						latLngBounds: bounds,
						strictBounds: false,
					},
				});

				mapRef.current.addListener("click", (event: google.maps.MapMouseEvent) => {
					if (!event.latLng) {
						return;
					}
					placeMarker({ lat: event.latLng.lat(), lng: event.latLng.lng() });
				});
			}

			geocoderRef.current = new window.google.maps.Geocoder();
			mapRef.current.setCenter(center);

			if (initialCoords) {
				placeMarker(initialCoords);
			}
		});
	}, [initialCoords, open]);

	const handleConfirm = () => {
		if (!selectedCoords) {
			return;
		}

		onConfirm({
			coords: selectedCoords,
			address: selectedAddress,
		});
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="w-[96vw] max-w-3xl p-0 overflow-hidden">
				<DialogTitle className="px-4 pt-4 text-base font-semibold text-slate-900">
					Pick Exact Location on Map
				</DialogTitle>
				<div className="px-4 pb-4">
					<p className="mb-3 text-sm text-slate-600">
						Click anywhere in Siliguri to drop a pin. You can drag the pin for better accuracy.
					</p>
					<div ref={mapContainerRef} className="h-[360px] w-full rounded-lg border" />
					<div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm">
						<div className="mb-1 flex items-center gap-1 font-medium text-slate-800">
							<MapPin className="h-4 w-4" />
							Selected Coordinates
						</div>
						{selectedCoords ? (
							<p className="text-slate-700">
								Lat: {selectedCoords.lat.toFixed(6)}, Lng: {selectedCoords.lng.toFixed(6)}
							</p>
						) : (
							<p className="text-slate-500">No location selected yet.</p>
						)}
						<p className="mt-1 text-slate-600">
							{loadingAddress
								? "Resolving address..."
								: selectedAddress || "Address will appear after pin selection."}
						</p>
					</div>
					<div className="mt-4 flex justify-end gap-2">
						<Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
							Cancel
						</Button>
						<Button type="button" onClick={handleConfirm} disabled={!selectedCoords}>
							Use This Location
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default SiliguriMapPickerModal;
