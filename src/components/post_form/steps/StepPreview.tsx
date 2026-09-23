// File: components/PostForm/steps/StepPreview.tsx
import { useFormContext } from "react-hook-form";
import { useEffect, useState } from "react";
import {
	CheckCircle,
	XCircle,
	MinusCircle,
	ArrowLeft,
	FileText,
	Home,
	Images,
	MapPin,
	Settings2,
} from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "../../ui/button";
import { sanitizeHTML } from "../../../utils/descriptionUtils";

interface StepPreviewProps {
	onEditStep?: (stepIndex: number) => void;
}

interface PreviewFormData {
	propertyCategory?: "house" | "flat" | "land" | "shop" | string;
	title?: string;
	description?: string;
	location?: string;
	alternateLocation?: string;
	wbLocalityLabel?: string;
	bedrooms?: string | number;
	bathrooms?: string | number;
	builtUpArea?: string | number;
	furnishing?: string;
	attachedBathroom?: boolean;
	parking?: boolean;
	availableFrom?: string;
	availableLandSpace?: string | number;
	availableLandSpaceUnit?: string;
	unit?: string;
	pricePerUnit?: string | number;
	totalPrice?: string | number;
	shopArea?: string | number;
	hasShutter?: boolean;
	price?: string | number;
	pricePerFrequency?: string | number;
	frequency?: string;
	availableForDuration?: string | number;
	availableForDurationUnit?: string;
	duration?: string;
	pictures?: File[];
	videos?: File[];
	[key: string]: unknown;
}

const StepPreview = ({ onEditStep }: StepPreviewProps) => {
	const { getValues } = useFormContext<PreviewFormData>();
	const [previewData, setPreviewData] = useState<PreviewFormData>({});
	const [previews, setPreviews] = useState<string[]>([]);
	const [videoPreviews, setVideoPreviews] = useState<string[]>([]);

	useEffect(() => {
		const values = getValues();
		setPreviewData(values);
		const files = values.pictures ? [...values.pictures] : [];
		const urls = files.map((file) => URL.createObjectURL(file));
		const videoFiles = values.videos ? [...values.videos] : [];
		const videoUrls = videoFiles.map((file) => URL.createObjectURL(file));
		setPreviews(urls);
		setVideoPreviews(videoUrls);
		return () => {
			urls.forEach((url) => URL.revokeObjectURL(url));
			videoUrls.forEach((url) => URL.revokeObjectURL(url));
		};
	}, [getValues]);

	const formatBoolean = (val: boolean | undefined | null) => (
		<span
			className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
				val === true
					? "bg-green-100 text-green-700"
					: val === false
						? "bg-red-100 text-red-700"
						: "bg-slate-100 text-slate-600"
			}`}
		>
			{val === true ? (
				<CheckCircle size={14} />
			) : val === false ? (
				<XCircle size={14} />
			) : (
				<MinusCircle size={14} />
			)}
			{val === true ? "Yes" : val === false ? "No" : "N/A"}
		</span>
	);

	const formatDate = (val: string | undefined | null) => {
		if (!val) return "-";
		const d = new Date(val);
		return Number.isNaN(d.getTime()) ? String(val) : d.toLocaleDateString();
	};

	const formatCurrency = (value: unknown): string => {
		if (value === undefined || value === null || value === "") return "-";
		const parsed = typeof value === "string" ? Number(value) : value;
		if (typeof parsed === "number" && !Number.isNaN(parsed)) {
			return new Intl.NumberFormat("en-IN", {
				style: "currency",
				currency: "INR",
				maximumFractionDigits: 0,
			}).format(parsed);
		}
		return String(value);
	};

	const toDisplayValue = (value: unknown): ReactNode => {
		if (value === undefined || value === null || value === "") {
			return "-";
		}

		if (typeof value === "string" || typeof value === "number") {
			return value;
		}

		if (typeof value === "boolean") {
			return value ? "Yes" : "No";
		}

		return String(value);
	};

	const normalizeLabel = (field: string): string => {
		const map: Record<string, string> = {
			builtUpArea: "Built-up Area",
			availableLandSpace: "Land Area",
			availableLandSpaceUnit: "Land Area Unit",
			pricePerUnit: "Price Per Unit",
			totalPrice: "Total Price",
			shopArea: "Shop Area",
			availableForDuration: "Available Duration",
			availableForDurationUnit: "Duration Unit",
			pricePerFrequency: "Price Per Frequency",
		};
		if (map[field]) return map[field];
		return field
			.replace(/([A-Z])/g, " $1")
			.replace(/^./, (char) => char.toUpperCase());
	};

	const propertyCategory = previewData.propertyCategory;
	const isHouseOrFlat =
		propertyCategory === "house" || propertyCategory === "flat";
	const isLand = propertyCategory === "land";
	const isShop = propertyCategory === "shop";
	const sanitizedDescription = previewData.description
		? sanitizeHTML(previewData.description)
		: "";
	const hasRentPricing = previewData.pricePerFrequency !== undefined;
	const hasSellPricing = previewData.price !== undefined;
	const hasLandPricing = previewData.pricePerUnit !== undefined;

	const InfoRow = ({ label, value }: { label: string; value: ReactNode }) => (
		<div className="flex flex-col rounded-lg border border-slate-200 bg-white px-3 py-2">
			<span className="text-xs font-medium uppercase tracking-[0.08em] text-slate-500">
				{label}
			</span>
			<span className="break-words text-sm font-semibold text-slate-900">
				{value ?? "-"}
			</span>
		</div>
	);

	return (
		<div className="mx-auto max-w-5xl space-y-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
			<div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
				<div className="flex items-start gap-2">
					<div className="rounded-lg bg-slate-900 p-1.5 text-white">
						<FileText className="h-4 w-4" />
					</div>
					<div>
						<h2 className="text-lg font-bold text-slate-900 sm:text-2xl">
							Review Before Publish
						</h2>
						<p className="text-sm text-slate-600">
							Confirm information, pricing, and photos before final submission.
						</p>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
				<Button
					type="button"
					variant="outline"
					className="justify-start"
					onClick={() => onEditStep?.(0)}
				>
					<ArrowLeft className="mr-2 h-4 w-4" />
					Edit Basics
				</Button>
				<Button
					type="button"
					variant="outline"
					className="justify-start"
					onClick={() => onEditStep?.(1)}
				>
					<ArrowLeft className="mr-2 h-4 w-4" />
					Edit Details
				</Button>
				<Button
					type="button"
					variant="outline"
					className="justify-start"
					onClick={() => onEditStep?.(2)}
				>
					<ArrowLeft className="mr-2 h-4 w-4" />
					Edit Media
				</Button>
			</div>

			<div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
				<div className="flex items-center gap-2 text-slate-900">
					<MapPin className="h-4 w-4" />
					<h3 className="text-sm font-semibold uppercase tracking-[0.08em]">
						Listing Basics
					</h3>
				</div>
				<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
					<InfoRow label="Title" value={previewData.title} />
					<InfoRow label="Location" value={previewData.location} />
					<InfoRow
						label="Siliguri Area"
						value={toDisplayValue(previewData.wbLocalityLabel)}
					/>
					<InfoRow
						label="Exact Address / Landmark"
						value={toDisplayValue(previewData.alternateLocation)}
					/>
					<InfoRow
						label="Property Type"
						value={toDisplayValue(propertyCategory)}
					/>
				</div>
				<div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3">
					<p className="mb-2 text-xs font-medium uppercase tracking-[0.08em] text-slate-500">
						Description
					</p>
					{sanitizedDescription ? (
						<div
							className="property-description text-sm text-slate-800"
							dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
						/>
					) : (
						<p className="text-sm font-semibold text-slate-900">-</p>
					)}
				</div>
			</div>

			{isHouseOrFlat && (
				<div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
					<div className="flex items-center gap-2 text-slate-900">
						<Home className="h-4 w-4" />
						<h3 className="text-sm font-semibold uppercase tracking-[0.08em]">
							{String(propertyCategory)} Details
						</h3>
					</div>
					<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
						{["bedrooms", "bathrooms", "builtUpArea", "furnishing"].map(
							(field) => (
								<InfoRow
									key={field}
									label={normalizeLabel(field)}
									value={toDisplayValue(previewData[field])}
								/>
							),
						)}
						<InfoRow
							label="Attached Bathroom"
							value={formatBoolean(previewData.attachedBathroom)}
						/>
						<InfoRow
							label="Parking"
							value={formatBoolean(previewData.parking)}
						/>
						<InfoRow
							label="Available From"
							value={formatDate(previewData.availableFrom)}
						/>
					</div>
				</div>
			)}

			{isLand && (
				<div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
					<div className="flex items-center gap-2 text-slate-900">
						<Settings2 className="h-4 w-4" />
						<h3 className="text-sm font-semibold uppercase tracking-[0.08em]">
							Land Details
						</h3>
					</div>
					<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
						{[
							"availableLandSpace",
							"availableLandSpaceUnit",
							"unit",
							"pricePerUnit",
							"totalPrice",
						].map((field) => (
							<InfoRow
								key={field}
								label={normalizeLabel(field)}
								value={toDisplayValue(previewData[field])}
							/>
						))}
					</div>
				</div>
			)}

			{isShop && (
				<div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
					<div className="flex items-center gap-2 text-slate-900">
						<Settings2 className="h-4 w-4" />
						<h3 className="text-sm font-semibold uppercase tracking-[0.08em]">
							Shop Details
						</h3>
					</div>
					<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
						<InfoRow
							label="Shop Area (sq ft)"
							value={toDisplayValue(previewData.shopArea)}
						/>
						<InfoRow
							label="Has Shutter"
							value={formatBoolean(previewData.hasShutter)}
						/>
					</div>
				</div>
			)}

			<div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
				<div className="flex items-center gap-2 text-slate-900">
					<FileText className="h-4 w-4" />
					<h3 className="text-sm font-semibold uppercase tracking-[0.08em]">
						Pricing
					</h3>
				</div>
				<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
					{hasSellPricing && (
						<div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3">
							<p className="text-xs font-semibold uppercase tracking-[0.08em] text-emerald-700">
								Total Selling Price
							</p>
							<p className="mt-1 text-lg font-bold text-emerald-900">
								{formatCurrency(previewData.price)}
							</p>
						</div>
					)}
					{hasLandPricing && (
						<div className="rounded-xl border border-blue-200 bg-blue-50 p-3">
							<p className="text-xs font-semibold uppercase tracking-[0.08em] text-blue-700">
								Price Per Unit
							</p>
							<p className="mt-1 text-lg font-bold text-blue-900">
								{formatCurrency(previewData.pricePerUnit)}
							</p>
							<p className="mt-1 text-xs font-medium text-blue-700">
								Unit: {toDisplayValue(previewData.unit)}
							</p>
						</div>
					)}
					{previewData.totalPrice !== undefined && (
						<div className="rounded-xl border border-purple-200 bg-purple-50 p-3">
							<p className="text-xs font-semibold uppercase tracking-[0.08em] text-purple-700">
								Estimated Total
							</p>
							<p className="mt-1 text-lg font-bold text-purple-900">
								{formatCurrency(previewData.totalPrice)}
							</p>
						</div>
					)}
					{hasRentPricing && (
						<div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
							<p className="text-xs font-semibold uppercase tracking-[0.08em] text-amber-700">
								Rental Price
							</p>
							<p className="mt-1 text-lg font-bold text-amber-900">
								{formatCurrency(previewData.pricePerFrequency)}
							</p>
							<p className="mt-1 text-xs font-medium text-amber-700">
								Per {toDisplayValue(previewData.frequency)}
							</p>
						</div>
					)}
					{previewData.availableForDuration !== undefined && (
						<div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
							<p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-600">
								Available For
							</p>
							<p className="mt-1 text-base font-semibold text-slate-900">
								{toDisplayValue(previewData.availableForDuration)}{" "}
								{toDisplayValue(previewData.availableForDurationUnit)}
							</p>
						</div>
					)}
				</div>
			</div>

			{previews.length > 0 && (
				<div className="rounded-xl border border-slate-200 bg-white p-4">
					<div className="mb-3 flex items-center justify-between gap-2">
						<div className="flex items-center gap-2 text-slate-900">
							<Images className="h-4 w-4" />
							<h3 className="text-sm font-semibold uppercase tracking-[0.08em]">
								Uploaded Pictures
							</h3>
						</div>
						<span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
							{previews.length} files
						</span>
					</div>
					<div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
						{previews.map((src, idx) => (
							<div
								key={idx}
								className="aspect-square overflow-hidden rounded-lg border border-slate-200 bg-slate-50 shadow-sm transition hover:shadow-md"
							>
								<img
									src={src}
									alt={`preview-${idx}`}
									className="h-full w-full object-cover"
								/>
							</div>
						))}
					</div>
				</div>
			)}

			{videoPreviews.length > 0 && (
				<div className="rounded-xl border border-slate-200 bg-white p-4">
					<div className="mb-3 flex items-center justify-between gap-2">
						<div className="flex items-center gap-2 text-slate-900">
							<Images className="h-4 w-4" />
							<h3 className="text-sm font-semibold uppercase tracking-[0.08em]">
								Uploaded Videos
							</h3>
						</div>
						<span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
							{videoPreviews.length} files
						</span>
					</div>
					<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
						{videoPreviews.map((src, idx) => (
							<video
								key={src + idx}
								src={src}
								controls
								className="h-52 w-full rounded-lg border border-slate-200 object-cover"
							/>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default StepPreview;
