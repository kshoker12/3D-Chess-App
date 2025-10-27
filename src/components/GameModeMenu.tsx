import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { useAppDispatch } from '../store/hooks';
import { setGameMode, setPlayerColor, setBotDifficulty, setShowGameModeMenu } from '../store/slices/uiSlice';
import { GameMode, BotDifficulty } from '../types/uiTypes';
import { makeBotMove } from '../store/slices/gameSlice';

const GameModeMenu: React.FC = () => {
    const dispatch = useAppDispatch();
    const { showGameModeMenu } = useSelector((state: RootState) => state.ui);
    const [showColorSelection, setShowColorSelection] = useState(false);
    const [selectedDifficulty, setSelectedDifficulty] = useState<BotDifficulty>('medium');

    if (!showGameModeMenu) return null;

    const handlePassAndPlay = () => {
        dispatch(setGameMode(GameMode.PASS_AND_PLAY));
        dispatch(setShowGameModeMenu(false));
    };

    const handleVsBot = () => {
        setShowColorSelection(true);
    };

    const handleColorSelection = (color: 'w' | 'b') => {
        // Set bot difficulty before starting the game
        dispatch(setBotDifficulty(selectedDifficulty));
        dispatch(setPlayerColor(color));
        dispatch(setGameMode(GameMode.VS_BOT));
        dispatch(setShowGameModeMenu(false));
        setShowColorSelection(false);
        
        // If user selects black, trigger bot's first move after a short delay
        if (color === 'b') {
            setTimeout(() => {
                dispatch(makeBotMove());
            }, 1000);
        }
    };

    const handleBack = () => {
        setShowColorSelection(false);
    };

    return (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[10000] pointer-events-auto">
            <div className="bg-gradient-to-r from-gray-800/95 to-gray-900/95 backdrop-blur-md rounded-2xl p-4 lg:p-8 border-4 border-gray-600 shadow-2xl text-center max-w-sm lg:max-w-md mx-4">
                {!showColorSelection ? (
                    <>
                        <div className="text-4xl lg:text-6xl mb-3 lg:mb-4">
                            <i className="fas fa-chess text-white"></i>
                        </div>
                        <h2 className="text-2xl lg:text-4xl font-bold text-white mb-4 lg:mb-6">
                            Choose Game Mode
                        </h2>
                        <p className="text-gray-300 text-base lg:text-lg mb-6 lg:mb-8">
                            Select how you want to play chess
                        </p>
                        <div className="flex flex-col space-y-3 lg:space-y-4">
                            <button
                                onClick={handlePassAndPlay}
                                className="px-6 py-3 lg:px-8 lg:py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors text-lg lg:text-xl flex items-center justify-center space-x-2 lg:space-x-3"
                            >
                                <i className="fas fa-users text-xl lg:text-2xl"></i>
                                <span>Pass & Play</span>
                            </button>
                            <button
                                onClick={handleVsBot}
                                className="px-6 py-3 lg:px-8 lg:py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-colors text-lg lg:text-xl flex items-center justify-center space-x-2 lg:space-x-3"
                            >
                                <i className="fas fa-robot text-xl lg:text-2xl"></i>
                                <span>VS Bot</span>
                            </button>
                        </div>
                        <div className="mt-4 lg:mt-6 text-gray-400 text-xs lg:text-sm">
                            <i className="fas fa-info-circle mr-1 lg:mr-2"></i>
                            Pass & Play: Two players on the same device
                        </div>
                    </>
                ) : (
                    <>
                        <div className="text-4xl lg:text-6xl mb-3 lg:mb-4">
                            <i className="fas fa-robot text-purple-400"></i>
                        </div>
                        <h2 className="text-2xl lg:text-4xl font-bold text-white mb-3 lg:mb-4">
                            Choose Bot Difficulty
                        </h2>
                        <p className="text-gray-300 text-sm lg:text-base mb-4">
                            Select how challenging the bot should be
                        </p>
                        <div className="flex flex-col space-y-2 mb-4 lg:mb-6">
                            <button
                                onClick={() => setSelectedDifficulty('easy')}
                                className={`px-6 py-2 lg:py-3 rounded-lg font-bold text-base lg:text-lg transition-colors flex items-center justify-center space-x-2 ${
                                    selectedDifficulty === 'easy'
                                        ? 'bg-green-600 hover:bg-green-700 text-white border-2 border-green-400'
                                        : 'bg-gray-700 hover:bg-gray-600 text-gray-300 border-2 border-gray-600'
                                }`}
                            >
                                <i className="fas fa-baby"></i>
                                <span>Easy</span>
                            </button>
                            <button
                                onClick={() => setSelectedDifficulty('medium')}
                                className={`px-6 py-2 lg:py-3 rounded-lg font-bold text-base lg:text-lg transition-colors flex items-center justify-center space-x-2 ${
                                    selectedDifficulty === 'medium'
                                        ? 'bg-yellow-600 hover:bg-yellow-700 text-white border-2 border-yellow-400'
                                        : 'bg-gray-700 hover:bg-gray-600 text-gray-300 border-2 border-gray-600'
                                }`}
                            >
                                <i className="fas fa-user"></i>
                                <span>Medium</span>
                            </button>
                            <button
                                onClick={() => setSelectedDifficulty('hard')}
                                className={`px-6 py-2 lg:py-3 rounded-lg font-bold text-base lg:text-lg transition-colors flex items-center justify-center space-x-2 ${
                                    selectedDifficulty === 'hard'
                                        ? 'bg-red-600 hover:bg-red-700 text-white border-2 border-red-400'
                                        : 'bg-gray-700 hover:bg-gray-600 text-gray-300 border-2 border-gray-600'
                                }`}
                            >
                                <i className="fas fa-brain"></i>
                                <span>Hard</span>
                            </button>
                        </div>
                        <div className="mb-3 lg:mb-4">
                            <div className="h-px bg-gray-600"></div>
                        </div>
                        <h3 className="text-xl lg:text-2xl font-bold text-white mb-3 lg:mb-4">
                            Choose Your Color
                        </h3>
                        <p className="text-gray-300 text-sm lg:text-base mb-4 lg:mb-6">
                            Select which color you want to play as
                        </p>
                        <div className="flex flex-col space-y-3 lg:space-y-4">
                            <button
                                onClick={() => handleColorSelection('w')}
                                className="px-6 py-3 lg:px-8 lg:py-4 bg-white hover:bg-gray-100 text-black font-bold rounded-lg transition-colors text-lg lg:text-xl flex items-center justify-center space-x-2 lg:space-x-3"
                            >
                                <i className="fas fa-chess-king text-xl lg:text-2xl"></i>
                                <span>Play as White</span>
                            </button>
                            <button
                                onClick={() => handleColorSelection('b')}
                                className="px-6 py-3 lg:px-8 lg:py-4 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-lg transition-colors text-lg lg:text-xl flex items-center justify-center space-x-2 lg:space-x-3"
                            >
                                <i className="fas fa-chess-king text-xl lg:text-2xl"></i>
                                <span>Play as Black</span>
                            </button>
                        </div>
                        <button
                            onClick={handleBack}
                            className="mt-4 lg:mt-6 px-4 py-2 lg:px-6 lg:py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors text-sm lg:text-base"
                        >
                            <i className="fas fa-arrow-left mr-1 lg:mr-2"></i>
                            Back
                        </button>
                        <div className="mt-3 lg:mt-4 text-gray-400 text-xs lg:text-sm">
                            <i className="fas fa-info-circle mr-1 lg:mr-2"></i>
                            White moves first
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default GameModeMenu;
