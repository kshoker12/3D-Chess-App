/** Resolve a public asset path for the current Vite base URL (e.g. GitHub Pages subpath). */
export function assetPath(path: string): string {
	const normalized = path.replace(/^\//, '');
	return `${import.meta.env.BASE_URL}${normalized}`;
}
