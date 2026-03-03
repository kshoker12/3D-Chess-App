import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { decrementTimer, resetUI, setShowGameModeMenu, setViewMode } from '../store/slices/uiSlice';
import { PieceType } from '../types/boardTypes';
import { getPieceImageWhite, getPieceImageBlack } from '../utils/pieceImages';
import { GameStatus } from '../types/gameTypes';
import { resetGame } from '../store/slices/gameSlice';
import { setBoardFromFen, setLastMove, setMovingPiece } from '../store/slices/boardSlice';

const GameUI: React.FC = () => {
    const dispatch = useDispatch();
    const { teams, fenParts, gameStarted, botThinking, playerColor, viewMode } = useSelector((state: RootState) => state.ui);
    const botColor = playerColor === 'w' ? 'b' : 'w';
    const { status } = useSelector((state: RootState) => state.game);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const [showCheckmateOverlay, setShowCheckmateOverlay] = useState(false);
    const checkmateTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Timer logic
    useEffect(() => {
        if (gameStarted) {
            intervalRef.current = setInterval(() => {
                dispatch(decrementTimer(fenParts.active));
            }, 1000);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [gameStarted, fenParts.active, dispatch]);

    // Delay checkmate overlay slightly so the final position is obvious.
    useEffect(() => {
        if (checkmateTimeoutRef.current) {
            clearTimeout(checkmateTimeoutRef.current);
            checkmateTimeoutRef.current = null;
        }

        if (status === GameStatus.CHECKMATE) {
            setShowCheckmateOverlay(false);
            checkmateTimeoutRef.current = setTimeout(() => {
                setShowCheckmateOverlay(true);
                checkmateTimeoutRef.current = null;
            }, 3000);
        } else {
            setShowCheckmateOverlay(false);
        }

        return () => {
            if (checkmateTimeoutRef.current) {
                clearTimeout(checkmateTimeoutRef.current);
                checkmateTimeoutRef.current = null;
            }
        };
    }, [status]);

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const getGameStatusDisplay = () => {
        switch (status) {
            case GameStatus.CHECKMATE:
                const winner = fenParts.active === 'w' ? 'Black' : 'White';
                return {
                    text: `${winner} Wins!`,
                    icon: 'fa-crown',
                    color: 'text-yellow-400 bg-yellow-900/30 border-yellow-500',
                    bgColor: 'bg-gradient-to-r from-yellow-600/90 to-yellow-800/90'
                };
            case GameStatus.STALEMATE:
                return {
                    text: 'Stalemate - Draw',
                    icon: 'fa-handshake',
                    color: 'text-gray-400 bg-gray-900/30 border-gray-500',
                    bgColor: 'bg-gradient-to-r from-gray-600/90 to-gray-800/90'
                };
            case GameStatus.DRAW:
                return {
                    text: 'Draw',
                    icon: 'fa-equals',
                    color: 'text-gray-400 bg-gray-900/30 border-gray-500',
                    bgColor: 'bg-gradient-to-r from-gray-600/90 to-gray-800/90'
                };
            case GameStatus.CHECK:
                const playerInCheck = fenParts.active === 'w' ? 'White' : 'Black';
                return {
                    text: `${playerInCheck} in Check`,
                    icon: 'fa-exclamation-triangle',
                    color: 'text-red-400 bg-red-900/30 border-red-500',
                    bgColor: 'bg-gradient-to-r from-red-600/90 to-red-800/90'
                };
            default:
                return {
                    text: gameStarted ? 'In progress' : 'Ready',
                    icon: 'fa-chess-board',
                    color: gameStarted ? 'text-emerald-400 bg-emerald-900/30 border-emerald-500' : 'text-slate-400 bg-slate-800/50 border-slate-500',
                    bgColor: gameStarted ? 'bg-gradient-to-r from-emerald-600/90 to-emerald-800/90' : 'bg-gradient-to-r from-slate-600/90 to-slate-800/90'
                };
        }
    };

    const handleNewGame = () => {
        // Reset all slice states
        dispatch(resetGame());
        dispatch(resetUI());
        dispatch(setBoardFromFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'));
        dispatch(setLastMove(null));
        dispatch(setMovingPiece(null));
        // Show game mode menu for new game
        dispatch(setShowGameModeMenu(true));
    };

    const materialAdvantage = teams.w.points - teams.b.points;

    const bannerCardClass = 'overflow-visible bg-gradient-to-b from-slate-800/95 to-slate-900/95 backdrop-blur-xl border-b border-x border-white/[0.12] shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset,0_24px_48px_-12px_rgba(0,0,0,0.6),0_0_80px_-24px_rgba(59,130,246,0.15)]';
    const bannerSectionClass = 'rounded-xl bg-white/[0.06] border border-white/[0.08]';
    const capturesTrayClass = `rounded-lg py-1 px-2 ${bannerSectionClass}`;
    /* Light tray only for black piece icons (White's captures) so they're visible on dark banner */
    const capturesTrayWhiteSide = 'rounded-lg py-1 px-2 bg-slate-100/90 border border-slate-300/60';

    const botThinkingIndicator = (
        <div className="absolute top-full left-0 mt-1.5 z-50 inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-violet-400/40 bg-violet-500/20 text-violet-200 text-xs font-medium shadow-lg whitespace-nowrap">
            <i className="fas fa-robot text-violet-400 animate-pulse" aria-hidden />
            Bot is thinking
            <span className="flex gap-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400/90 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400/90 animate-bounce" style={{ animationDelay: '120ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400/90 animate-bounce" style={{ animationDelay: '240ms' }} />
            </span>
        </div>
    );

    return (
        <div className="absolute inset-0 pointer-events-none z-10">
            {/* Desktop: banner card (menu-style) */}
            <header className="hidden sm:block absolute top-0 left-0 right-0">
                <div className={`${bannerCardClass} px-3 sm:px-4 py-2 sm:py-3`}>
                    {/* Row 1: side + timer | center (status + New game) | timer + side */}
                    <div className="flex items-center justify-between gap-2 sm:gap-4 flex-wrap">
                        <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0 flex-1">
                            <div className="relative">
                                <div className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg ${bannerSectionClass}`}>
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-white to-slate-200 flex-shrink-0 flex items-center justify-center border border-white/40 shadow-inner">
                                        <i className="fas fa-chess-king text-slate-800 text-[10px]" aria-hidden />
                                    </div>
                                    <span className="text-white font-semibold text-xs sm:text-sm">White</span>
                                </div>
                                {botThinking && botColor === 'w' && botThinkingIndicator}
                            </div>
                            <div className={`flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2.5 py-1.5 rounded-lg font-mono text-xs sm:text-sm tabular-nums min-w-[3.75rem] sm:min-w-[4.5rem] justify-center shrink-0 ${teams.w.timeRemaining < 60 ? 'text-red-300 bg-red-500/20 border border-red-400/30' : bannerSectionClass}`}>
                                <i className={`fas fa-clock text-[10px] sm:text-xs flex-shrink-0 ${teams.w.timeRemaining < 60 ? 'text-red-400' : 'text-slate-400'}`} aria-hidden />
                                <span className="text-slate-200 whitespace-nowrap">{formatTime(teams.w.timeRemaining)}</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-shrink-0">
                            <button
                                type="button"
                                onClick={() => dispatch(setViewMode(viewMode === '3d' ? '2d' : '3d'))}
                                className="pointer-events-auto flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 min-h-[2.5rem] sm:min-h-0 rounded-lg sm:rounded-xl bg-white/10 hover:bg-white/15 border border-white/[0.12] text-slate-200 hover:text-white text-xs sm:text-sm font-medium transition-all shadow-sm active:scale-[0.98]"
                            >
                                {viewMode === '3d' ? 'Play 2D' : 'Play 3D'}
                            </button>
                            <button
                                type="button"
                                onClick={handleNewGame}
                                className="pointer-events-auto flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 min-h-[2.5rem] sm:min-h-0 rounded-lg sm:rounded-xl bg-white/10 hover:bg-white/15 border border-white/[0.12] text-slate-200 hover:text-white text-xs sm:text-sm font-medium transition-all shadow-sm active:scale-[0.98]"
                            >
                                <i className="fas fa-plus text-[10px] sm:text-xs" aria-hidden />
                                New game
                            </button>
                        </div>
                        <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0 flex-1 justify-end">
                            <div className={`flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2.5 py-1.5 rounded-lg font-mono text-xs sm:text-sm tabular-nums min-w-[3.75rem] sm:min-w-[4.5rem] justify-center shrink-0 ${teams.b.timeRemaining < 60 ? 'text-red-300 bg-red-500/20 border border-red-400/30' : bannerSectionClass}`}>
                                <span className="text-slate-200 whitespace-nowrap">{formatTime(teams.b.timeRemaining)}</span>
                                <i className={`fas fa-clock text-[10px] sm:text-xs flex-shrink-0 ${teams.b.timeRemaining < 60 ? 'text-red-400' : 'text-slate-400'}`} aria-hidden />
                            </div>
                            <div className="relative">
                                <div className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg ${bannerSectionClass}`}>
                                    <span className="text-white font-semibold text-xs sm:text-sm">Black</span>
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex-shrink-0 flex items-center justify-center border border-slate-500/50 shadow-inner">
                                        <i className="fas fa-chess-king text-slate-200 text-[10px]" aria-hidden />
                                    </div>
                                </div>
                                {botThinking && botColor === 'b' && (
                                    <div className="absolute top-full right-0 mt-1.5 z-50 inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-violet-400/40 bg-violet-500/20 text-violet-200 text-xs font-medium shadow-lg whitespace-nowrap">
                                        <i className="fas fa-robot text-violet-400 animate-pulse" aria-hidden />
                                        Bot is thinking
                                        <span className="flex gap-0.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-violet-400/90 animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <span className="w-1.5 h-1.5 rounded-full bg-violet-400/90 animate-bounce" style={{ animationDelay: '120ms' }} />
                                            <span className="w-1.5 h-1.5 rounded-full bg-violet-400/90 animate-bounce" style={{ animationDelay: '240ms' }} />
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* Row 2: captured pieces underneath each side */}
                    <div className="flex items-center justify-between gap-2 sm:gap-4 mt-2 pt-2 border-t border-white/[0.08]">
                        <div className={`flex items-center gap-1 sm:gap-1.5 flex-wrap min-h-[26px] sm:min-h-[28px] flex-1 min-w-0 ${capturesTrayWhiteSide}`}>
                            {teams.b.capturedPieces.length > 0 ? teams.b.capturedPieces.map((p, i) => (
                                <img key={i} src={getPieceImageBlack(p as PieceType)} alt="" className="w-5 h-5 object-contain" />
                            )) : <span className="text-slate-500 text-xs">—</span>}
                            {materialAdvantage < 0 && (
                                <span className="font-mono text-sm font-semibold tabular-nums text-emerald-600">
                                    +{Math.abs(materialAdvantage)}
                                </span>
                            )}
                        </div>
                        <div className="flex-1 min-w-[60px] sm:min-w-[120px] flex-shrink-0" />
                        <div className={`flex items-center gap-1 sm:gap-1.5 flex-wrap min-h-[26px] sm:min-h-[28px] flex-1 min-w-0 justify-end ${capturesTrayClass}`}>
                            {teams.w.capturedPieces.length > 0 ? teams.w.capturedPieces.map((p, i) => (
                                <img key={i} src={getPieceImageWhite(p as PieceType)} alt="" className="w-5 h-5 object-contain" />
                            )) : <span className="text-slate-500 text-xs">—</span>}
                            {materialAdvantage > 0 && (
                                <span className="font-mono text-sm font-semibold tabular-nums text-emerald-600">
                                    +{materialAdvantage}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile: banner card (menu-style) */}
            <header className="sm:hidden absolute top-0 left-0 right-0">
                <div className={`${bannerCardClass} px-2 sm:px-3 py-2`}>
                    {/* Row 1: side + timer | center (status + New game) | timer + side */}
                    <div className="flex items-center justify-between gap-1.5">
                        <div className="flex items-center gap-1 sm:gap-1.5 min-w-0">
                            <div className="relative">
                                <div className={`flex items-center gap-1 px-1.5 sm:px-2 py-1 rounded-lg ${bannerSectionClass}`}>
                                    <div className="w-4 h-4 rounded-full bg-gradient-to-br from-white to-slate-200 flex-shrink-0 flex items-center justify-center border border-white/30">
                                        <i className="fas fa-chess-king text-slate-800 text-[8px]" aria-hidden />
                                    </div>
                                    <span className="text-white font-semibold text-xs">White</span>
                                </div>
                                {botThinking && botColor === 'w' && (
                                    <div className="absolute top-full left-0 mt-1 z-50 inline-flex items-center gap-1.5 px-2 py-1 rounded border border-violet-400/40 bg-violet-500/20 text-violet-200 text-[10px] font-medium shadow-lg whitespace-nowrap">
                                        <i className="fas fa-robot text-violet-400 animate-pulse" aria-hidden />
                                        Bot thinking
                                        <span className="flex gap-0.5">
                                            <span className="w-1 h-1 rounded-full bg-violet-400/90 animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <span className="w-1 h-1 rounded-full bg-violet-400/90 animate-bounce" style={{ animationDelay: '120ms' }} />
                                            <span className="w-1 h-1 rounded-full bg-violet-400/90 animate-bounce" style={{ animationDelay: '240ms' }} />
                                        </span>
                                    </div>
                                )}
                            </div>
                            <span className={`font-mono text-[10px] sm:text-xs tabular-nums min-w-[2.75rem] text-center px-1.5 py-0.5 rounded shrink-0 whitespace-nowrap ${teams.w.timeRemaining < 60 ? 'text-red-300 bg-red-500/20' : 'text-slate-200 bg-white/5'}`}>
                                {formatTime(teams.w.timeRemaining)}
                            </span>
                        </div>
                        <div className="flex items-center justify-center gap-1 flex-shrink-0 min-w-0">
                            <button
                                type="button"
                                onClick={() => dispatch(setViewMode(viewMode === '3d' ? '2d' : '3d'))}
                                className="pointer-events-auto inline-flex items-center justify-center gap-0.5 px-1.5 py-0.5 min-h-0 rounded bg-white/10 hover:bg-white/15 active:bg-white/20 border border-white/[0.12] text-slate-200 hover:text-white text-[9px] font-medium transition-all active:scale-[0.98] touch-manipulation"
                            >
                                {viewMode === '3d' ? 'Play 2D' : 'Play 3D'}
                            </button>
                            <button
                                type="button"
                                onClick={handleNewGame}
                                className="pointer-events-auto inline-flex items-center justify-center gap-0.5 px-1.5 py-0.5 min-h-0 rounded bg-white/10 hover:bg-white/15 active:bg-white/20 border border-white/[0.12] text-slate-200 hover:text-white text-[9px] font-medium transition-all active:scale-[0.98] touch-manipulation"
                            >
                                <i className="fas fa-plus text-[7px]" aria-hidden />
                                New game
                            </button>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-1.5 min-w-0 justify-end">
                            <span className={`font-mono text-[10px] sm:text-xs tabular-nums min-w-[2.75rem] text-center px-1.5 py-0.5 rounded shrink-0 whitespace-nowrap ${teams.b.timeRemaining < 60 ? 'text-red-300 bg-red-500/20' : 'text-slate-200 bg-white/5'}`}>
                                {formatTime(teams.b.timeRemaining)}
                            </span>
                            <div className="relative">
                                <div className={`flex items-center gap-1 px-1.5 sm:px-2 py-1 rounded-lg ${bannerSectionClass}`}>
                                    <span className="text-white font-semibold text-xs">Black</span>
                                    <div className="w-4 h-4 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex-shrink-0 flex items-center justify-center border border-slate-500/50">
                                        <i className="fas fa-chess-king text-slate-200 text-[8px]" aria-hidden />
                                    </div>
                                </div>
                                {botThinking && botColor === 'b' && (
                                    <div className="absolute top-full right-0 mt-1 z-50 inline-flex items-center gap-1.5 px-2 py-1 rounded border border-violet-400/40 bg-violet-500/20 text-violet-200 text-[10px] font-medium shadow-lg whitespace-nowrap">
                                        <i className="fas fa-robot text-violet-400 animate-pulse" aria-hidden />
                                        Bot thinking
                                        <span className="flex gap-0.5">
                                            <span className="w-1 h-1 rounded-full bg-violet-400/90 animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <span className="w-1 h-1 rounded-full bg-violet-400/90 animate-bounce" style={{ animationDelay: '120ms' }} />
                                            <span className="w-1 h-1 rounded-full bg-violet-400/90 animate-bounce" style={{ animationDelay: '240ms' }} />
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* Row 2: captured pieces underneath */}
                    <div className="flex items-center justify-between gap-1.5 mt-2 pt-2 border-t border-white/[0.08]">
                        <div className={`flex items-center gap-1 flex-wrap min-h-[20px] flex-1 min-w-0 overflow-hidden ${capturesTrayWhiteSide}`}>
                            {teams.b.capturedPieces.length > 0 ? teams.b.capturedPieces.slice(-6).map((p, i) => (
                                <img key={i} src={getPieceImageBlack(p as PieceType)} alt="" className="w-4 h-4 object-contain flex-shrink-0" />
                            )) : <span className="text-slate-500 text-[10px]">—</span>}
                            {materialAdvantage < 0 && (
                                <span className="font-mono text-[10px] font-semibold tabular-nums text-emerald-600">
                                    +{Math.abs(materialAdvantage)}
                                </span>
                            )}
                        </div>
                        <div className={`flex items-center gap-1 flex-wrap min-h-[20px] flex-1 min-w-0 justify-end overflow-hidden ${capturesTrayClass}`}>
                            {teams.w.capturedPieces.length > 0 ? teams.w.capturedPieces.slice(-6).map((p, i) => (
                                <img key={i} src={getPieceImageWhite(p as PieceType)} alt="" className="w-4 h-4 object-contain flex-shrink-0" />
                            )) : <span className="text-slate-500 text-[10px]">—</span>}
                            {materialAdvantage > 0 && (
                                <span className="font-mono text-[10px] font-semibold tabular-nums text-emerald-600">
                                    +{materialAdvantage}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Game Over Overlay */}
            {(status === GameStatus.STALEMATE || status === GameStatus.DRAW || (status === GameStatus.CHECKMATE && showCheckmateOverlay)) && (
                <div className="absolute inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[10000] pointer-events-auto p-4">
                    <div className={`${getGameStatusDisplay().bgColor} backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-white/20 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.08)_inset] text-center max-w-sm sm:max-w-md w-full`}>
                        <div className="text-4xl sm:text-5xl mb-4 text-white/90">
                            <i className={`fas ${getGameStatusDisplay().icon}`} aria-hidden />
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                            {getGameStatusDisplay().text}
                        </h2>
                        {status === GameStatus.CHECKMATE && (
                            <>
                                <p className="text-white/80 text-sm sm:text-base mb-2">
                                    {fenParts.active === 'w' ? 'Black' : 'White'} has achieved checkmate!
                                </p>
                                <p className="text-white/90 text-base sm:text-lg font-semibold mb-6">
                                    {(fenParts.active === 'w' ? 'b' : 'w') === playerColor ? 'You won.' : 'You lost.'}
                                </p>
                            </>
                        )}
                        {status === GameStatus.STALEMATE && (
                            <p className="text-white/80 text-sm sm:text-base mb-6">
                                The game ends in a draw due to stalemate.
                            </p>
                        )}
                        {status === GameStatus.DRAW && (
                            <p className="text-white/80 text-sm sm:text-base mb-6">
                                The game ends in a draw.
                            </p>
                        )}
                        <button
                            onClick={handleNewGame}
                            className="pointer-events-auto cursor-pointer inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 bg-white/95 hover:bg-white text-slate-900 font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl"
                        >
                            <i className="fas fa-redo text-sm" aria-hidden />
                            New game
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GameUI;
