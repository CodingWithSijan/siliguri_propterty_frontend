import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	build: {
		rollupOptions: {
			output: {
				manualChunks(id) {
					if (!id.includes("node_modules")) {
						return;
					}

					if (/node_modules\/(react|react-dom|scheduler)\//.test(id)) {
						return "react-vendor";
					}

					if (/node_modules\/(react-router|react-router-dom)\//.test(id)) {
						return "router-vendor";
					}

					if (id.includes("@tiptap") || id.includes("prosemirror")) {
						return "editor-vendor";
					}

					if (
						id.includes("nuka-carousel") ||
						id.includes("embla-carousel") ||
						id.includes("react-responsive-carousel")
					) {
						return "carousel-vendor";
					}

					if (id.includes("react-icons")) {
						return "icons-vendor";
					}

					if (id.includes("@googlemaps")) {
						return "maps-vendor";
					}

					if (
						id.includes("react-hook-form") ||
						id.includes("@hookform/resolvers") ||
						id.includes("zod")
					) {
						return "forms-vendor";
					}

					if (id.includes("@reduxjs") || id.includes("react-redux")) {
						return "state-vendor";
					}

					if (
						id.includes("@headlessui") ||
						id.includes("vaul") ||
						id.includes("emoji-picker-react")
					) {
						return "interaction-vendor";
					}

					if (
						id.includes("@radix-ui") ||
						id.includes("lucide-react") ||
						id.includes("framer-motion")
					) {
						return "ui-vendor";
					}

					if (id.includes("axios") || id.includes("jwt-decode")) {
						return "network-vendor";
					}

					return "vendor";
				},
			},
		},
	},
});
