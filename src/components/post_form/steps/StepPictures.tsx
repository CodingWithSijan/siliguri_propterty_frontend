// File: components/PostForm/steps/StepPictures.tsx

import { useFormContext, useWatch } from "react-hook-form";
import { Film, ImagePlus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { showError } from "../../../utils/toastUtils";

const MAX_IMAGES = 15;
const MAX_VIDEOS = 2;

const hasAllowedExtension = (
	fileName: string,
	allowedExtensions: string[],
): boolean => {
	const lower = fileName.toLowerCase();
	return allowedExtensions.some((ext) => lower.endsWith(ext));
};

const isImageFile = (file: File): boolean => {
	if (file.type.startsWith("image/")) return true;
	return hasAllowedExtension(file.name, [
		".jpg",
		".jpeg",
		".png",
		".webp",
		".gif",
		".avif",
		".heic",
	]);
};

const isVideoFile = (file: File): boolean => {
	if (file.type.startsWith("video/")) return true;
	return hasAllowedExtension(file.name, [".mp4", ".webm", ".mov", ".m4v"]);
};

const StepPictures = () => {
	const {
		setValue,
		getValues,
		control,
		register,
		formState: { errors },
	} = useFormContext();

	const [imageFiles, setImageFiles] = useState<File[]>(() => {
		const existing = getValues("pictures") as File[] | undefined;
		return existing ? [...existing] : [];
	});
	const [videoFiles, setVideoFiles] = useState<File[]>(() => {
		const existing = getValues("videos") as File[] | undefined;
		return existing ? [...existing] : [];
	});

	const watchedPictures = useWatch({ control, name: "pictures" });
	const watchedVideos = useWatch({ control, name: "videos" });

	useEffect(() => {
		register("pictures", {
			validate: (value) => {
				const files = Array.isArray(value) ? value : [];
				if (files.length < 1) {
					return "Please upload at least one image";
				}
				if (files.length > MAX_IMAGES) {
					return `You can upload up to ${MAX_IMAGES} images`;
				}
				return true;
			},
		});

		register("videos", {
			validate: (value) => {
				const files = Array.isArray(value) ? value : [];
				if (files.length > MAX_VIDEOS) {
					return `You can upload up to ${MAX_VIDEOS} videos`;
				}
				return true;
			},
		});
	}, [register]);

	useEffect(() => {
		if (!watchedPictures || watchedPictures.length === 0) {
			setImageFiles([]);
		}
	}, [watchedPictures]);

	useEffect(() => {
		if (!watchedVideos || watchedVideos.length === 0) {
			setVideoFiles([]);
		}
	}, [watchedVideos]);

	const imagePreviews = useMemo(
		() => imageFiles.map((file) => URL.createObjectURL(file)),
		[imageFiles],
	);
	const videoPreviews = useMemo(
		() => videoFiles.map((file) => URL.createObjectURL(file)),
		[videoFiles],
	);

	useEffect(() => {
		return () => {
			imagePreviews.forEach((url) => URL.revokeObjectURL(url));
			videoPreviews.forEach((url) => URL.revokeObjectURL(url));
		};
	}, [imagePreviews, videoPreviews]);

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const incoming = e.target.files ? Array.from(e.target.files) : [];
		const filtered = incoming.filter((file) => isImageFile(file));
		const unique = new Map(
			imageFiles.map((file) => [file.name + file.size, file]),
		);
		filtered.forEach((file) => unique.set(file.name + file.size, file));
		const combined = Array.from(unique.values());

		if (combined.length > MAX_IMAGES) {
			showError(`Maximum ${MAX_IMAGES} images allowed`);
			e.target.value = "";
			return;
		}

		setImageFiles(combined);
		setValue("pictures", combined, {
			shouldValidate: true,
			shouldDirty: true,
		});
		e.target.value = "";
	};

	const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const incoming = e.target.files ? Array.from(e.target.files) : [];
		const filtered = incoming.filter((file) => isVideoFile(file));
		const unique = new Map(
			videoFiles.map((file) => [file.name + file.size, file]),
		);
		filtered.forEach((file) => unique.set(file.name + file.size, file));
		const combined = Array.from(unique.values());

		if (combined.length > MAX_VIDEOS) {
			showError(`Maximum ${MAX_VIDEOS} videos allowed`);
			e.target.value = "";
			return;
		}

		setVideoFiles(combined);
		setValue("videos", combined, {
			shouldValidate: true,
			shouldDirty: true,
		});
		e.target.value = "";
	};

	const removeImage = (index: number) => {
		const updated = imageFiles.filter((_, idx) => idx !== index);
		setImageFiles(updated);
		setValue("pictures", updated, {
			shouldValidate: true,
			shouldDirty: true,
		});
	};

	const removeVideo = (index: number) => {
		const updated = videoFiles.filter((_, idx) => idx !== index);
		setVideoFiles(updated);
		setValue("videos", updated, {
			shouldValidate: true,
			shouldDirty: true,
		});
	};

	return (
		<div className="space-y-5">
			<section className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
				<div className="mb-3 flex items-center justify-between gap-2">
					<div>
						<h3 className="text-base font-semibold text-slate-900">
							Upload Media
						</h3>
						<p className="text-sm text-slate-600">
							Add high quality visuals. Cover image comes from your first
							uploaded image.
						</p>
					</div>
					<div className="space-y-1 text-right text-xs font-semibold text-slate-700">
						<p>
							{imageFiles.length}/{MAX_IMAGES} images
						</p>
						<p>
							{videoFiles.length}/{MAX_VIDEOS} videos
						</p>
					</div>
				</div>

				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<div>
						<label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-800">
							<ImagePlus className="h-4 w-4" />
							Images
						</label>
						<input
							name="pictures"
							id="post-images"
							type="file"
							multiple
							accept="image/*"
							onChange={handleImageChange}
							className="block h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-1 file:text-sm file:font-medium"
						/>
						{errors.pictures && (
							<p className="mt-1 text-sm text-red-500">
								{String(errors.pictures.message)}
							</p>
						)}
						<p className="mt-1 text-xs text-slate-500">
							Up to 15 images. JPG, PNG, WEBP recommended.
						</p>
						<p className="mt-1 text-xs text-slate-500">
							If your phone picker selects one image at a time, reopen and add
							more.
						</p>
					</div>

					<div>
						<label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-800">
							<Film className="h-4 w-4" />
							Videos
						</label>
						<input
							name="videos"
							id="post-videos"
							type="file"
							multiple
							accept="video/mp4,video/webm,video/quicktime"
							onChange={handleVideoChange}
							className="block h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-1 file:text-sm file:font-medium"
						/>
						{errors.videos && (
							<p className="mt-1 text-sm text-red-500">
								{String(errors.videos.message)}
							</p>
						)}
						<p className="mt-1 text-xs text-slate-500">
							Up to 2 videos. MP4/WebM/MOV only.
						</p>
					</div>
				</div>
			</section>

			{imagePreviews.length > 0 && (
				<section className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4">
					<h4 className="mb-3 text-sm font-semibold uppercase tracking-[0.08em] text-slate-700">
						Image Preview
					</h4>
					<div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
						{imagePreviews.map((src, idx) => (
							<div
								key={src + idx}
								className="group relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-white"
							>
								<img
									src={src}
									alt={`preview-image-${idx}`}
									className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
								/>
								<button
									type="button"
									className="absolute right-1 top-1 rounded-full bg-white/90 p-1 text-red-500 shadow-sm transition hover:bg-red-500 hover:text-white"
									onClick={() => removeImage(idx)}
									tabIndex={-1}
								>
									<Trash2 size={14} className="hover:text-white" />
								</button>
								{idx === 0 && (
									<span className="absolute bottom-1 left-1 rounded bg-slate-900/80 px-1.5 py-0.5 text-[10px] font-medium text-white">
										Cover
									</span>
								)}
							</div>
						))}
					</div>
				</section>
			)}

			{videoPreviews.length > 0 && (
				<section className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4">
					<h4 className="mb-3 text-sm font-semibold uppercase tracking-[0.08em] text-slate-700">
						Video Preview
					</h4>
					<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
						{videoPreviews.map((src, idx) => (
							<div
								key={src + idx}
								className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-2"
							>
								<video
									src={src}
									controls
									className="h-44 w-full rounded-lg object-cover sm:h-48"
								/>
								<button
									type="button"
									className="absolute right-3 top-3 rounded-full bg-white/90 p-1 text-red-500 shadow-sm transition hover:bg-red-500 hover:text-white"
									onClick={() => removeVideo(idx)}
								>
									<Trash2 size={14} className="hover:text-white" />
								</button>
							</div>
						))}
					</div>
				</section>
			)}
		</div>
	);
};

export default StepPictures;
