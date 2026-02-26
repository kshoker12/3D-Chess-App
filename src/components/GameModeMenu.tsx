import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { useAppDispatch } from '../store/hooks';
import { setGameMode, setPlayerColor, setBotDifficulty, setShowGameModeMenu, setIsAutomated } from '../store/slices/uiSlice';
import { GameMode, BotDifficulty } from '../types/uiTypes';
import { makeBotMove } from '../store/slices/gameSlice';

const GameModeMenu: React.FC = () => {
    const dispatch = useAppDispatch();
    const { showGameModeMenu } = useSelector((state: RootState) => state.ui);
    const [selectedDifficulty, setSelectedDifficulty] = useState<BotDifficulty>('medium');

    if (!showGameModeMenu) return null;

    const handleColorSelection = (color: 'w' | 'b') => {
        dispatch(setBotDifficulty(selectedDifficulty));
        dispatch(setPlayerColor(color));
        dispatch(setIsAutomated(false));
        dispatch(setGameMode(GameMode.VS_BOT));

        // Automated play — commented out; menu is vs bot only with color + difficulty
        // if (isAutomatedSetup) {
        //     dispatch(setIsAutomated(true));
        //     dispatch(setGameMode(GameMode.PASS_AND_PLAY));
        //     if (color === 'w') setTimeout(() => dispatch(makeBotMove()), 500);
        // } else { ... }

        if (color === 'b') {
            setTimeout(() => dispatch(makeBotMove()), 1000);
        }
        dispatch(setShowGameModeMenu(false));
    };

    const difficultyConfig: { key: BotDifficulty; label: string; icon: string; activeClass: string }[] = [
        { key: 'easy', label: 'Easy', icon: 'fa-feather', activeClass: 'bg-emerald-500/90 text-white border-emerald-400/60 shadow-[0_0_20px_rgba(16,185,129,0.35)]' },
        { key: 'medium', label: 'Medium', icon: 'fa-user', activeClass: 'bg-amber-500/90 text-white border-amber-400/60 shadow-[0_0_20px_rgba(245,158,11,0.35)]' },
        { key: 'hard', label: 'Hard', icon: 'fa-brain', activeClass: 'bg-rose-500/90 text-white border-rose-400/60 shadow-[0_0_20px_rgba(244,63,94,0.35)]' },
    ];

    return (
        <div className="absolute inset-0 flex items-center justify-center z-[10000] pointer-events-auto p-4 sm:p-6 bg-black/60 backdrop-blur-md">
            <div className="w-full max-w-md rounded-2xl overflow-hidden bg-gradient-to-b from-slate-800/95 to-slate-900/95 backdrop-blur-xl border border-white/[0.12] shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset,0_24px_48px_-12px_rgba(0,0,0,0.6),0_0_80px_-24px_rgba(59,130,246,0.15)]">
                {/* Header */}
                <div className="relative px-6 pt-6 pb-4 sm:pt-7 sm:pb-5 text-center border-b border-white/[0.08]">
                    <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-amber-400/20 to-amber-600/10 border border-amber-400/30 mb-3 sm:mb-4 shadow-inner">
                        <i className="fas fa-chess-knight text-amber-400/90 text-xl sm:text-2xl" aria-hidden />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-300">
                        New game
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">
                        Choose your side and opponent strength
                    </p>
                </div>

                <div className="px-5 sm:px-6 py-5 sm:py-6 space-y-6">
                    {/* Difficulty */}
                    <div>
                        <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-3">
                            Difficulty
                        </p>
                        <div className="grid grid-cols-3 gap-2">
                            {difficultyConfig.map(({ key, label, icon, activeClass }) => (
                                <button
                                    key={key}
                                    type="button"
                                    onClick={() => setSelectedDifficulty(key)}
                                    className={`flex flex-col items-center gap-1.5 py-3 rounded-xl text-sm font-medium transition-all duration-200 border ${
                                        selectedDifficulty === key
                                            ? `${activeClass} ring-2 ring-white/20 scale-[1.02]`
                                            : 'bg-slate-800/80 text-slate-400 border-slate-600/60 hover:bg-slate-700/80 hover:text-slate-300 hover:border-slate-500/60'
                                    }`}
                                >
                                    <i className={`fas ${icon} text-base sm:text-lg opacity-90`} aria-hidden />
                                    <span className="capitalize">{label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Play as */}
                    <div>
                        <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-3">
                            Play as
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => handleColorSelection('w')}
                                className="group flex flex-col items-center gap-2 py-4 sm:py-5 rounded-xl font-semibold text-sm sm:text-base bg-gradient-to-b from-slate-100 to-slate-200 text-slate-900 border border-slate-300/80 shadow-lg hover:shadow-xl hover:scale-[1.02] hover:border-slate-200 transition-all duration-200"
                            >
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 flex items-center justify-center border border-slate-200 shadow-inner group-hover:bg-white transition-colors">
                                    <i className="fas fa-chess-king text-slate-700 text-lg sm:text-xl" aria-hidden />
                                </div>
                                <span>White</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => handleColorSelection('b')}
                                className="group flex flex-col items-center gap-2 py-4 sm:py-5 rounded-xl font-semibold text-sm sm:text-base bg-gradient-to-b from-slate-700 to-slate-900 text-slate-100 border border-slate-600/80 shadow-lg hover:shadow-xl hover:scale-[1.02] hover:border-slate-500 transition-all duration-200"
                            >
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-800/90 flex items-center justify-center border border-slate-600 shadow-inner group-hover:bg-slate-700/90 transition-colors">
                                    <i className="fas fa-chess-king text-slate-200 text-lg sm:text-xl" aria-hidden />
                                </div>
                                <span>Black</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GameModeMenu;
