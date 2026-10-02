type CloudinaryOptimizeOptions = {
	width: number;
	height: number;
	crop?: "fill" | "fit" | "limit";
	quality?: "auto" | "auto:eco" | "auto:good" | "auto:best" | number;
};

const CLOUDINARY_HOST_PATTERN = /res\.cloudinary\.com/i;

export const optimizeCloudinaryImage = (
	url: string,
	options: CloudinaryOptimizeOptions,
): string => {
	if (!url || !CLOUDINARY_HOST_PATTERN.test(url)) {
		return url;
	}

	const uploadToken = "/image/upload/";
	const uploadIndex = url.indexOf(uploadToken);
	if (uploadIndex === -1) {
		return url;
	}

	const existingTransformStart = uploadIndex + uploadToken.length;
	const rest = url.slice(existingTransformStart);
	const firstSlash = rest.indexOf("/");

	// If no slash exists, the URL is malformed for Cloudinary delivery.
	if (firstSlash === -1) {
		return url;
	}

	const pathAfterTransforms = rest.slice(firstSlash + 1);
	const crop = options.crop ?? "fill";
	const quality = options.quality ?? "auto:good";
	const transform = `f_auto,q_${quality},dpr_auto,c_${crop},w_${options.width},h_${options.height}`;

	return `${url.slice(0, existingTransformStart)}${transform}/${pathAfterTransforms}`;
};
