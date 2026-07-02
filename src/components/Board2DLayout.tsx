import { FC, ReactNode } from 'react';

/** Shared layout wrapper for the 2D board (banner spacer + board area). */
const Board2DLayout: FC<{ children: ReactNode }> = ({ children }) => (
	<div
		className="absolute inset-0 flex flex-col"
		style={{ ['--banner-height' as string]: '100px' }}
	>
		<div className="flex-shrink-0 h-[var(--banner-height)]" aria-hidden />
		<div className="flex-1 min-h-0 w-full relative">{children}</div>
	</div>
);

export default Board2DLayout;
