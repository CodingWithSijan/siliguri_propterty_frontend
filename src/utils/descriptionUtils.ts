import DOMPurify from "dompurify";

/**
 * Sanitize HTML content to prevent XSS attacks
 * @param html - Raw HTML string
 * @returns Sanitized HTML string
 */
export const sanitizeHTML = (html: string): string => {
	return DOMPurify.sanitize(html, {
		ALLOWED_TAGS: [
			"p",
			"strong",
			"em",
			"u",
			"s",
			"h2",
			"h3",
			"ul",
			"ol",
			"li",
			"br",
		],
		ALLOWED_ATTR: [],
	});
};

/**
 * Extract plain text from HTML content
 * @param html - HTML string
 * @returns Plain text without HTML tags
 */
export const getPlainText = (html: string): string => {
	const div = document.createElement("div");
	div.innerHTML = html;
	return div.textContent || div.innerText || "";
};

/**
 * Count words in a text string
 * @param text - Text to count words in
 * @returns Number of words
 */
export const countWords = (text: string): number => {
	return text
		.trim()
		.split(/\s+/)
		.filter((word) => word.length > 0).length;
};

/**
 * Truncate HTML content while preserving tags
 * @param html - HTML string to truncate
 * @param maxWords - Maximum number of words to keep
 * @returns Truncated HTML string
 */
export const getTruncatedHTML = (html: string, maxWords: number): string => {
	const tempDiv = document.createElement("div");
	tempDiv.innerHTML = html;

	let wordCounter = 0;
	let truncated = false;

	const traverse = (node: Node): Node | null => {
		if (truncated) return null;

		if (node.nodeType === Node.TEXT_NODE) {
			const words = (node.textContent || "")
				.trim()
				.split(/\s+/)
				.filter((w) => w.length > 0);
			if (wordCounter + words.length > maxWords) {
				const allowedWords = maxWords - wordCounter;
				node.textContent = words.slice(0, allowedWords).join(" ") + "...";
				truncated = true;
				wordCounter = maxWords;
			} else {
				wordCounter += words.length;
			}
			return node;
		}

		if (node.nodeType === Node.ELEMENT_NODE) {
			const element = node as Element;
			const clone = element.cloneNode(false);

			Array.from(element.childNodes).forEach((child) => {
				if (!truncated) {
					const processedChild = traverse(child);
					if (processedChild) {
						clone.appendChild(processedChild);
					}
				}
			});

			return clone;
		}

		return null;
	};

	const result = traverse(tempDiv);
	return result ? (result as Element).innerHTML : "";
};

/**
 * Process description for display
 * @param description - Raw description HTML
 * @param wordLimit - Maximum words before truncation
 * @returns Processed description data
 */
export const processDescription = (
	description?: string,
	wordLimit: number = 100,
) => {
	if (!description) {
		return {
			sanitizedHTML: "",
			plainText: "",
			wordCount: 0,
			shouldTruncate: false,
		};
	}

	const sanitizedHTML = sanitizeHTML(description);
	const plainText = getPlainText(sanitizedHTML);
	const wordCount = countWords(plainText);
	const shouldTruncate = wordCount > wordLimit;

	return {
		sanitizedHTML,
		plainText,
		wordCount,
		shouldTruncate,
	};
};
