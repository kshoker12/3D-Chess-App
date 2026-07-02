/** Returns true when the browser can create a WebGL rendering context. */
export function isWebGLAvailable(): boolean {
	try {
		const canvas = document.createElement('canvas');
		return !!(
			canvas.getContext('webgl2') ||
			canvas.getContext('webgl') ||
			canvas.getContext('experimental-webgl' as 'webgl')
		);
	} catch {
		return false;
	}
}

export const WEBGL_UNAVAILABLE_MESSAGE =
	'3D mode needs WebGL. Try a full browser (Chrome, Safari, or Firefox) with hardware acceleration enabled.';
