import { Component, ErrorInfo, ReactNode } from 'react';

interface WebGLErrorBoundaryProps {
	children: ReactNode;
	onError: () => void;
}

interface WebGLErrorBoundaryState {
	hasError: boolean;
}

/** Catches WebGL / Three.js init failures and triggers a 2D fallback. */
export class WebGLErrorBoundary extends Component<WebGLErrorBoundaryProps, WebGLErrorBoundaryState> {
	state: WebGLErrorBoundaryState = { hasError: false };

	static getDerivedStateFromError(): WebGLErrorBoundaryState {
		return { hasError: true };
	}

	componentDidCatch(error: Error, info: ErrorInfo): void {
		console.warn('3D scene failed to initialize:', error, info.componentStack);
		this.props.onError();
	}

	render(): ReactNode {
		if (this.state.hasError) return null;
		return this.props.children;
	}
}
