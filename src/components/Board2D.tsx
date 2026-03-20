import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../store/hooks';
import { RootState } from '../store/store';
import { setSelectedSquare } from '../store/slices/boardSlice';
import { makeMove } from '../store/slices/gameSlice';
import { createSquareSpecificSelectors } from '../store/selectors/boardSelectors';
import { SQUARE_COLOURS, SquareId } from '../types/boardTypes';
import { Move } from '../types/gameTypes';
import { GameMode } from '../types/uiTypes';
import { store } from '../store/store';
import { getPieceImage } from '../utils/pieceImages';
import type { PieceType } from '../types/boardTypes';

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const;
const RANKS_WHITE_AT_BOTTOM = [8, 7, 6, 5, 4, 3, 2, 1] as const;
const RANKS_BLACK_AT_BOTTOM = [1, 2, 3, 4, 5, 6, 7, 8] as const;
const MOVE_ANIMATION_MS = 220;

function Square2D({ squareId, hidePiece }: { squareId: SquareId; hidePiece?: boolean }) {
    const dispatch = useAppDispatch();
    const squareSelectors = useMemo(() => createSquareSpecificSelectors(squareId), [squareId]);
    const isSelected = useSelector(squareSelectors.isSelected);
    const isLegal = useSelector(squareSelectors.isLegal);
    const lastMove = useSelector((s: RootState) => s.board.lastMove);
    const board = useSelector((s: RootState) => s.board.board);
    const piece = board[squareId];

    const isLastMoveSquare = lastMove && (lastMove.from === squareId || lastMove.to === squareId);
    const squareColor = SQUARE_COLOURS[squareId.charAt(0)][squareId.charAt(1) as '1'|'2'|'3'|'4'|'5'|'6'|'7'|'8'];
    const isDark = squareColor === 'black';

    const handleClick = useCallback(() => {
        const currentState = store.getState();
        const selectedSquare = currentState.board.selectedSquare;

        if (currentState.ui.gameMode === GameMode.VS_BOT) {
            if (currentState.ui.fenParts.active !== currentState.ui.playerColor) return;
            if (currentState.ui.botThinking) return;
        }

        const squarePiece = currentState.board.board[squareId];
        const activeColor = currentState.ui.fenParts.active;

        if (selectedSquare === squareId) {
            dispatch(setSelectedSquare(null));
        } else if (selectedSquare === null) {
            if (squarePiece && squarePiece.pieceId.charAt(0) !== activeColor) return;
            dispatch(setSelectedSquare(squareId));
        } else {
            const move: Move = { from: selectedSquare, to: squareId };
            dispatch(makeMove(move));
        }
    }, [squareId, dispatch]);

    let bg = isDark ? 'bg-[#6B2D2D]' : 'bg-[#F0D9B5]'; // dark red, light (white-ish)
    if (isSelected) bg = 'bg-lime-400';
    else if (isLastMoveSquare) bg = 'bg-[#fef08a]';

    return (
        <div
            role="button"
            tabIndex={0}
            data-squareid={squareId}
            onClick={handleClick}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick(); } }}
            className={`relative w-full aspect-square ${bg} flex items-center justify-center cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-white/50`}
            style={{ minHeight: 0 }}
        >
            {isLegal && !piece && (
                <span className="absolute w-1/4 h-1/4 rounded-full bg-gray-600/60 pointer-events-none" />
            )}
            {isLegal && piece && (
                <span className="absolute inset-0 rounded-full ring-2 ring-red-500/50 pointer-events-none" />
            )}
            {piece && !hidePiece && (
                <img
                    src={getPieceImage(piece.pieceId.slice(1) as PieceType, piece.pieceId.charAt(0) as 'w' | 'b')}
                    alt=""
                    className="w-[85%] h-[85%] object-contain pointer-events-none"
                    draggable={false}
                />
            )}
        </div>
    );
}

type MovingPieceOverlay = {
    fromRect: { left: number; top: number; width: number; height: number };
    toRect: { left: number; top: number; width: number; height: number };
    pieceId: string;
    animating: boolean;
};

const Board2D: React.FC = () => {
    const gridRef = useRef<HTMLDivElement>(null);
    const playerColor = useSelector((s: RootState) => s.ui.playerColor);
    const lastMove = useSelector((s: RootState) => s.board.lastMove);
    const board = useSelector((s: RootState) => s.board.board);
    const [movingOverlay, setMovingOverlay] = useState<MovingPieceOverlay | null>(null);

    const ranks = playerColor === 'b' ? RANKS_BLACK_AT_BOTTOM : RANKS_WHITE_AT_BOTTOM;
    const squares = useMemo(() => {
        // Horizontal mirroring: for black view, render files right-to-left (a-h becomes h-a).
        const files = playerColor === 'b' ? [...FILES].reverse() : FILES;
        const out: SquareId[] = [];
        for (const r of ranks) {
            for (const f of files) {
                out.push(`${f}${r}` as SquareId);
            }
        }
        return out;
    }, [playerColor, ranks]);

    useEffect(() => {
        if (!lastMove || !gridRef.current) return;
        const piece = board[lastMove.to];
        if (!piece) return;
        const grid = gridRef.current;
        const fromEl = grid.querySelector(`[data-squareid="${lastMove.from}"]`) as HTMLElement | null;
        const toEl = grid.querySelector(`[data-squareid="${lastMove.to}"]`) as HTMLElement | null;
        if (!fromEl || !toEl) return;
        const gridRect = grid.getBoundingClientRect();
        const fromRect = fromEl.getBoundingClientRect();
        const toRect = toEl.getBoundingClientRect();
        setMovingOverlay({
            fromRect: {
                left: fromRect.left - gridRect.left,
                top: fromRect.top - gridRect.top,
                width: fromRect.width,
                height: fromRect.height,
            },
            toRect: {
                left: toRect.left - gridRect.left,
                top: toRect.top - gridRect.top,
                width: toRect.width,
                height: toRect.height,
            },
            pieceId: piece.pieceId,
            animating: false,
        });
    }, [lastMove?.from, lastMove?.to]);

    useEffect(() => {
        if (!movingOverlay) return;
        const t = requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                setMovingOverlay((prev) => (prev ? { ...prev, animating: true } : null));
            });
        });
        return () => cancelAnimationFrame(t);
    }, [movingOverlay?.fromRect.left, movingOverlay?.fromRect.top]);

    useEffect(() => {
        if (!movingOverlay?.animating) return;
        const id = setTimeout(() => setMovingOverlay(null), MOVE_ANIMATION_MS);
        return () => clearTimeout(id);
    }, [movingOverlay?.animating]);

    return (
        <div className="w-full h-full min-h-0 flex items-center justify-center p-2 sm:p-4 bg-slate-900">
            <div
                ref={gridRef}
                className="relative grid grid-cols-8 gap-0 border-2 border-slate-700 shadow-2xl rounded overflow-hidden aspect-square w-[min(100%,calc(100vh-var(--banner-height,100px)))] max-w-full max-h-full"
                style={{ minWidth: 0, minHeight: 0 }}
            >
                {squares.map((squareId) => (
                    <Square2D
                        key={squareId}
                        squareId={squareId}
                        hidePiece={!!(movingOverlay && lastMove?.to === squareId)}
                    />
                ))}
                {movingOverlay && (
                    <div
                        className="absolute flex items-center justify-center pointer-events-none z-10"
                        style={{
                            left: movingOverlay.animating ? movingOverlay.toRect.left : movingOverlay.fromRect.left,
                            top: movingOverlay.animating ? movingOverlay.toRect.top : movingOverlay.fromRect.top,
                            width: movingOverlay.fromRect.width,
                            height: movingOverlay.fromRect.height,
                            transition: `left ${MOVE_ANIMATION_MS}ms ease-out, top ${MOVE_ANIMATION_MS}ms ease-out`,
                        }}
                    >
                        <img
                            src={getPieceImage(
                                movingOverlay.pieceId.slice(1) as PieceType,
                                movingOverlay.pieceId.charAt(0) as 'w' | 'b'
                            )}
                            alt=""
                            className="w-[85%] h-[85%] object-contain"
                            draggable={false}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Board2D;
