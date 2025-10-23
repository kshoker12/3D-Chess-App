import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { decrementTimer, pauseGame, startGame, resetUI, setShowGameModeMenu } from '../store/slices/uiSlice';
import { PieceType } from '../types/boardTypes';
import { PIECE_VALUE } from '../types/uiTypes';
import { GameStatus } from '../types/gameTypes';
import { resetGame } from '../store/slices/gameSlice';
import { setBoardFromFen, setLastMove, setMovingPiece } from '../store/slices/boardSlice';

const GameUI: React.FC = () => {
    const dispatch = useDispatch();
    const { teams, fenParts, gameStarted, gameMode, playerColor } = useSelector((state: RootState) => state.ui);
    const { status } = useSelector((state: RootState) => state.game);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

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
                    text: gameStarted ? 'Game Active' : 'Game Paused',
                    icon: gameStarted ? 'fa-play-circle' : 'fa-pause-circle',
                    color: gameStarted ? 'text-green-400 bg-green-900/30 border-green-500' : 'text-yellow-400 bg-yellow-900/30 border-yellow-500',
                    bgColor: gameStarted ? 'bg-gradient-to-r from-green-600/90 to-green-800/90' : 'bg-gradient-to-r from-yellow-600/90 to-yellow-800/90'
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

    const getPieceImage = (pieceType: PieceType): string => {
        const pieceMap: Record<PieceType, string> = {
            'p': 'https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wp.png',
            'r': 'https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wr.png',
            'b': 'https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wb.png',
            'n': 'https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wn.png',
            'q': 'https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wq.png',
            'k': 'https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wk.png',
        };
        return pieceMap[pieceType] || '';
    };

    const getPieceImageBlack = (pieceType: PieceType): string => {
        const pieceMap: Record<PieceType, string> = {
            'p': 'https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bp.png',
            'r': 'https://images.chesscomfiles.com/chess-themes/pieces/neo/150/br.png',
            'b': 'https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bb.png',
            'n': 'https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bn.png',
            'q': 'https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bq.png',
            'k': 'https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bk.png',
        };
        return pieceMap[pieceType] || '';
    };

    return (
        <div className="absolute inset-0 pointer-events-none z-10">
            <div className="hidden lg:block absolute top-0 left-0 right-0 bg-gradient-to-r from-black/90 via-gray-900/90 to-black/90 backdrop-blur-md border-b border-gray-600 shadow-2xl">
                <div className="flex justify-between items-center p-4">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-gray-300">
                                <i className="fas fa-chess-king text-black text-xl"></i>
                            </div>
                            <span className="text-white font-bold text-xl">White</span>
                            {gameMode === 'vs_bot' && playerColor === 'w' && (
                                <span className="text-green-400 text-sm font-semibold bg-green-900/30 px-2 py-1 rounded">
                                    <i className="fas fa-user mr-1"></i>You
                                </span>
                            )}
                            {gameMode === 'vs_bot' && playerColor === 'b' && (
                                <span className="text-purple-400 text-sm font-semibold bg-purple-900/30 px-2 py-1 rounded">
                                    <i className="fas fa-robot mr-1"></i>Bot
                                </span>
                            )}
                        </div>
                        <div className={`text-3xl font-mono px-6 py-3 rounded-xl shadow-lg transition-colors flex items-center space-x-2 ${
                            teams.w.timeRemaining < 60 
                                ? 'text-red-400 bg-red-900/50 border-2 border-red-500' 
                                : 'text-white bg-gray-800 border-2 border-gray-600'
                        }`}>
                            <i className={`fas fa-clock ${teams.w.timeRemaining < 60 ? 'text-red-400' : 'text-gray-400'}`}></i>
                            <span>{formatTime(teams.w.timeRemaining)}</span>
                        </div>
                        <div className="text-white font-semibold text-lg bg-gray-700/50 px-4 py-2 rounded-lg flex items-center space-x-2">
                            <i className="fas fa-trophy text-yellow-400"></i>
                            <span>Points: {teams.w.points}</span>
                        </div>
                    </div>
                    <div className="flex flex-col items-center">
                        {(() => {
                            const statusDisplay = getGameStatusDisplay();
                            return (
                                <div className={`font-bold text-2xl mb-2 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${statusDisplay.color}`}>
                                    <i className={`fas ${statusDisplay.icon}`}></i>
                                    <span>{statusDisplay.text}</span>
                                </div>
                            );
                        })()}
                        <div className="flex flex-row items-center space-x-2">
                            <div className="text-gray-300 text-lg font-semibold flex items-center space-x-2">
                                <i className={`fas fa-chess-${fenParts.active === 'w' ? 'pawn' : 'pawn'} ${fenParts.active === 'w' ? 'text-white' : 'text-gray-700'}`}></i>
                                <span>{fenParts.active === 'w' ? 'White to move' : 'Black to move'}</span>
                            </div>
                            <div className="font-bold text-lg flex items-center justify-center space-x-2">
                                <i className="fas fa-chess-board text-blue-400"></i>
                                <span>Move {Math.ceil(fenParts.fullmove)}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="text-white font-semibold text-lg bg-gray-700/50 px-4 py-2 rounded-lg flex items-center space-x-2">
                            <i className="fas fa-trophy text-yellow-400"></i>
                            <span>Points: {teams.b.points}</span>
                        </div>
                        <div className={`text-3xl font-mono px-6 py-3 rounded-xl shadow-lg transition-colors flex items-center space-x-2 ${
                            teams.b.timeRemaining < 60 
                                ? 'text-red-400 bg-red-900/50 border-2 border-red-500' 
                                : 'text-white bg-gray-800 border-2 border-gray-600'
                        }`}>
                            <i className={`fas fa-clock ${teams.b.timeRemaining < 60 ? 'text-red-400' : 'text-gray-400'}`}></i>
                            <span>{formatTime(teams.b.timeRemaining)}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            {gameMode === 'vs_bot' && playerColor === 'b' && (
                                <span className="text-green-400 text-sm font-semibold bg-green-900/30 px-2 py-1 rounded">
                                    <i className="fas fa-user mr-1"></i>You
                                </span>
                            )}
                            {gameMode === 'vs_bot' && playerColor === 'w' && (
                                <span className="text-purple-400 text-sm font-semibold bg-purple-900/30 px-2 py-1 rounded">
                                    <i className="fas fa-robot mr-1"></i>Bot
                                </span>
                            )}
                            <span className="text-white font-bold text-xl">Black</span>
                            <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center shadow-lg border-2 border-gray-600">
                                <i className="fas fa-chess-king text-white text-xl"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="lg:hidden absolute top-0 left-0 right-0 bg-gradient-to-r from-black/90 via-gray-900/90 to-black/90 backdrop-blur-md border-b border-gray-600 shadow-2xl">
                <div className="px-3 py-2">
                    {(() => {
                        const statusDisplay = getGameStatusDisplay();
                        return (
                            <div className={`font-bold text-lg mb-2 px-3 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2 ${statusDisplay.color}`}>
                                <i className={`fas ${statusDisplay.icon}`}></i>
                                <span>{statusDisplay.text}</span>
                            </div>
                        );
                    })()}
                </div>

                {/* Mobile Teams Row */}
                <div className="flex justify-between items-center px-3 pb-2">
                    {/* White Team */}
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-gray-300">
                            <i className="fas fa-chess-king text-black text-sm"></i>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-white font-bold text-sm">White</span>
                            {gameMode === 'vs_bot' && playerColor === 'w' && (
                                <span className="text-green-400 text-xs font-semibold bg-green-900/30 px-1 py-0.5 rounded">
                                    <i className="fas fa-user mr-1"></i>You
                                </span>
                            )}
                            {gameMode === 'vs_bot' && playerColor === 'b' && (
                                <span className="text-purple-400 text-xs font-semibold bg-purple-900/30 px-1 py-0.5 rounded">
                                    <i className="fas fa-robot mr-1"></i>Bot
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Center Info */}
                    <div className="flex flex-col items-center space-y-1">
                        <div className="text-gray-300 text-sm font-semibold flex items-center space-x-1">
                            <i className={`fas fa-chess-${fenParts.active === 'w' ? 'pawn' : 'pawn'} ${fenParts.active === 'w' ? 'text-white' : 'text-gray-700'}`}></i>
                            <span>{fenParts.active === 'w' ? 'White' : 'Black'} to move</span>
                        </div>
                        <div className="font-bold text-sm flex items-center justify-center space-x-1">
                            <i className="fas fa-chess-board text-blue-400"></i>
                            <span>Move {Math.ceil(fenParts.fullmove)}</span>
                        </div>
                    </div>

                    {/* Black Team */}
                    <div className="flex items-center space-x-2">
                        <div className="flex flex-col items-end">
                            <span className="text-white font-bold text-sm">Black</span>
                            {gameMode === 'vs_bot' && playerColor === 'b' && (
                                <span className="text-green-400 text-xs font-semibold bg-green-900/30 px-1 py-0.5 rounded">
                                    <i className="fas fa-user mr-1"></i>You
                                </span>
                            )}
                            {gameMode === 'vs_bot' && playerColor === 'w' && (
                                <span className="text-purple-400 text-xs font-semibold bg-purple-900/30 px-1 py-0.5 rounded">
                                    <i className="fas fa-robot mr-1"></i>Bot
                                </span>
                            )}
                        </div>
                        <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center shadow-lg border-2 border-gray-600">
                            <i className="fas fa-chess-king text-white text-sm"></i>
                        </div>
                    </div>
                </div>

                {/* Mobile Timers Row */}
                <div className="flex justify-between items-center px-3 pb-3">
                    {/* White Timer */}
                    <div className={`text-xl font-mono px-3 py-2 rounded-lg shadow-lg transition-colors flex items-center space-x-1 ${
                        teams.w.timeRemaining < 60 
                            ? 'text-red-400 bg-red-900/50 border-2 border-red-500' 
                            : 'text-white bg-gray-800 border-2 border-gray-600'
                    }`}>
                        <i className={`fas fa-clock text-sm ${teams.w.timeRemaining < 60 ? 'text-red-400' : 'text-gray-400'}`}></i>
                        <span>{formatTime(teams.w.timeRemaining)}</span>
                    </div>

                    {/* Points Display */}
                    <div className="flex space-x-2">
                        <div className="text-white font-semibold text-sm bg-gray-700/50 px-2 py-1 rounded flex items-center space-x-1">
                            <i className="fas fa-trophy text-yellow-400 text-xs"></i>
                            <span>W: {teams.w.points}</span>
                        </div>
                        <div className="text-white font-semibold text-sm bg-gray-700/50 px-2 py-1 rounded flex items-center space-x-1">
                            <i className="fas fa-trophy text-yellow-400 text-xs"></i>
                            <span>B: {teams.b.points}</span>
                        </div>
                    </div>

                    {/* Black Timer */}
                    <div className={`text-xl font-mono px-3 py-2 rounded-lg shadow-lg transition-colors flex items-center space-x-1 ${
                        teams.b.timeRemaining < 60 
                            ? 'text-red-400 bg-red-900/50 border-2 border-red-500' 
                            : 'text-white bg-gray-800 border-2 border-gray-600'
                    }`}>
                        <i className={`fas fa-clock text-sm ${teams.b.timeRemaining < 60 ? 'text-red-400' : 'text-gray-400'}`}></i>
                        <span>{formatTime(teams.b.timeRemaining)}</span>
                    </div>
                </div>
            </div>
            {/* Desktop Captured Pieces */}
            <div className="hidden lg:block absolute left-4 top-28 bg-white/95 backdrop-blur-md rounded-xl p-5 border-2 border-gray-400 shadow-xl">
                <div className="flex items-center space-x-2 mb-3">
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center border border-gray-300">
                        <i className="fas fa-chess-king text-black text-sm"></i>
                    </div>
                    <div className="text-black font-bold text-lg flex items-center space-x-2">
                        <i className="fas fa-capture text-red-500"></i>
                        <span>White Captured</span>
                    </div>
                </div>
                <div className="flex flex-wrap gap-2 max-w-40">
                    {teams.b.capturedPieces.map((piece, index) => (
                        <div key={index} className="relative group">
                            <img
                                src={getPieceImageBlack(piece)}
                                alt={`Captured ${piece}`}
                                className="w-8 h-8 object-contain hover:scale-110 transition-transform"
                            />
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                {PIECE_VALUE[piece]} pts
                            </div>
                        </div>
                    ))}
                    {teams.b.capturedPieces.length === 0 && (
                        <div className="text-gray-500 text-sm italic flex items-center space-x-1">
                            <i className="fas fa-minus-circle"></i>
                            <span>No pieces captured</span>
                        </div>
                    )}
                </div>
                <div className="mt-2 text-sm text-gray-600 font-semibold flex items-center space-x-1">
                    <i className="fas fa-calculator text-gray-500"></i>
                    <span>Total Value: {teams.b.capturedPieces.reduce((sum, piece) => sum + PIECE_VALUE[piece], 0)} pts</span>
                </div>
            </div>
            <div className="hidden lg:block absolute right-4 top-28 bg-gray-800/95 backdrop-blur-md rounded-xl p-5 border-2 border-gray-600 shadow-xl">
                <div className="flex items-center space-x-2 mb-3">
                    <div className="text-white font-bold text-lg flex items-center space-x-2">
                        <i className="fas fa-capture text-red-500"></i>
                        <span>Black Captured</span>
                    </div>
                    <div className="w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center border border-gray-600">
                        <i className="fas fa-chess-king text-white text-sm"></i>
                    </div>
                </div>
                <div className="flex flex-wrap gap-2 max-w-40">
                    {teams.w.capturedPieces.map((piece, index) => (
                        <div key={index} className="relative group">
                            <img
                                src={getPieceImage(piece)}
                                alt={`Captured ${piece}`}
                                className="w-8 h-8 object-contain hover:scale-110 transition-transform"
                            />
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                {PIECE_VALUE[piece]} pts
                            </div>
                        </div>
                    ))}
                    {teams.w.capturedPieces.length === 0 && (
                        <div className="text-gray-400 text-sm italic flex items-center space-x-1">
                            <i className="fas fa-minus-circle"></i>
                            <span>No pieces captured</span>
                        </div>
                    )}
                </div>
                <div className="mt-2 text-sm text-gray-300 font-semibold flex items-center space-x-1">
                    <i className="fas fa-calculator text-gray-400"></i>
                    <span>Total Value: {teams.w.capturedPieces.reduce((sum, piece) => sum + PIECE_VALUE[piece], 0)} pts</span>
                </div>
            </div>

            {/* Mobile Captured Pieces - Bottom Panel */}
            <div className="lg:hidden absolute bottom-20 left-2 right-2 bg-black/90 backdrop-blur-md rounded-xl p-3 border-2 border-gray-600 shadow-xl">
                <div className="flex justify-between items-start">
                    {/* White Captured */}
                    <div className="flex-1 mr-2">
                        <div className="flex items-center space-x-2 mb-2">
                            <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center border border-gray-300">
                                <i className="fas fa-chess-king text-black text-xs"></i>
                            </div>
                            <div className="text-white font-bold text-sm flex items-center space-x-1">
                                <i className="fas fa-capture text-red-500 text-xs"></i>
                                <span>White</span>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-1">
                            {teams.b.capturedPieces.map((piece, index) => (
                                <div key={index} className="relative group">
                                    <img
                                        src={getPieceImageBlack(piece)}
                                        alt={`Captured ${piece}`}
                                        className="w-6 h-6 object-contain"
                                    />
                                </div>
                            ))}
                            {teams.b.capturedPieces.length === 0 && (
                                <div className="text-gray-400 text-xs italic">
                                    None
                                </div>
                            )}
                        </div>
                        <div className="text-xs text-gray-300 font-semibold mt-1">
                            {teams.b.capturedPieces.reduce((sum, piece) => sum + PIECE_VALUE[piece], 0)} pts
                        </div>
                    </div>

                    {/* Black Captured */}
                    <div className="flex-1 ml-2">
                        <div className="flex items-center space-x-2 mb-2">
                            <div className="text-white font-bold text-sm flex items-center space-x-1">
                                <i className="fas fa-capture text-red-500 text-xs"></i>
                                <span>Black</span>
                            </div>
                            <div className="w-5 h-5 bg-gray-800 rounded-full flex items-center justify-center border border-gray-600">
                                <i className="fas fa-chess-king text-white text-xs"></i>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-1">
                            {teams.w.capturedPieces.map((piece, index) => (
                                <div key={index} className="relative group">
                                    <img
                                        src={getPieceImage(piece)}
                                        alt={`Captured ${piece}`}
                                        className="w-6 h-6 object-contain"
                                    />
                                </div>
                            ))}
                            {teams.w.capturedPieces.length === 0 && (
                                <div className="text-gray-400 text-xs italic">
                                    None
                                </div>
                            )}
                        </div>
                        <div className="text-xs text-gray-300 font-semibold mt-1">
                            {teams.w.capturedPieces.reduce((sum, piece) => sum + PIECE_VALUE[piece], 0)} pts
                        </div>
                    </div>
                </div>
            </div>
            {/* Desktop Game Controls */}
            <div className="hidden lg:block absolute bottom-4 right-4 bg-black/90 backdrop-blur-md rounded-xl p-5 border-2 border-gray-600 shadow-xl">
                <div className="flex flex-col space-y-3">
                    <div className="text-white font-bold text-lg mb-2 flex items-center space-x-2">
                        <i className="fas fa-gamepad"></i>
                        <span>Game Controls</span>
                    </div>
                    <button
                        onClick={() => {
                            if (gameStarted) {
                                dispatch(pauseGame());
                            } else {
                                dispatch(startGame());
                            }
                        }}
                        className={`px-6 py-3 rounded-xl font-bold text-lg transition-all duration-200 pointer-events-auto shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2 ${
                            gameStarted 
                                ? 'bg-red-600 hover:bg-red-700 text-white border-2 border-red-500' 
                                : 'bg-green-600 hover:bg-green-700 text-white border-2 border-green-500'
                        }`}
                    >
                        <i className={`fas ${gameStarted ? 'fa-pause' : 'fa-play'}`}></i>
                        <span>{gameStarted ? 'Pause Game' : 'Resume Game'}</span>
                    </button>
                    <div className="text-gray-400 text-sm text-center flex items-center justify-center space-x-1">
                        <i className="fas fa-info-circle"></i>
                        <span>Press to {gameStarted ? 'pause' : 'resume'} the timer</span>
                    </div>
                </div>
            </div>

            {/* Mobile Game Controls */}
            <div className="lg:hidden absolute bottom-2 right-2 bg-black/90 backdrop-blur-md rounded-xl p-3 border-2 border-gray-600 shadow-xl">
                <button
                    onClick={() => {
                        if (gameStarted) {
                            dispatch(pauseGame());
                        } else {
                            dispatch(startGame());
                        }
                    }}
                    className={`px-4 py-2 rounded-lg font-bold text-sm transition-all duration-200 pointer-events-auto shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2 ${
                        gameStarted 
                            ? 'bg-red-600 hover:bg-red-700 text-white border-2 border-red-500' 
                            : 'bg-green-600 hover:bg-green-700 text-white border-2 border-green-500'
                    }`}
                >
                    <i className={`fas ${gameStarted ? 'fa-pause' : 'fa-play'} text-sm`}></i>
                    <span>{gameStarted ? 'Pause' : 'Resume'}</span>
                </button>
            </div>
            {/* Desktop Active Player Indicator */}
            {gameStarted && (
                <div className={`hidden lg:block absolute bottom-4 left-4 backdrop-blur-md rounded-xl p-5 border-2 shadow-xl transition-all duration-300 ${
                    fenParts.active === 'w' 
                        ? 'bg-gradient-to-r from-blue-600/90 to-blue-800/90 border-blue-400' 
                        : 'bg-gradient-to-r from-purple-600/90 to-purple-800/90 border-purple-400'
                }`}>
                    <div className="flex items-center space-x-3">
                        <div className={`w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center ${
                            fenParts.active === 'w' ? 'bg-white' : 'bg-gray-800'
                        }`}>
                            <i className={`fas fa-chess-${fenParts.active === 'w' ? 'pawn' : 'pawn'} ${fenParts.active === 'w' ? 'text-gray-800' : 'text-white'} text-xs`}></i>
                        </div>
                        <span className="text-white font-bold text-lg">
                            {fenParts.active === 'w' ? 'White' : 'Black'} to move
                        </span>
                    </div>
                    <div className="text-gray-200 text-sm mt-1 flex items-center space-x-1">
                        <i className="fas fa-stopwatch text-green-400"></i>
                        <span>Timer is running...</span>
                    </div>
                </div>
            )}

            {/* Mobile Active Player Indicator */}
            {gameStarted && (
                <div className={`lg:hidden absolute bottom-2 left-2 backdrop-blur-md rounded-xl p-3 border-2 shadow-xl transition-all duration-300 ${
                    fenParts.active === 'w' 
                        ? 'bg-gradient-to-r from-blue-600/90 to-blue-800/90 border-blue-400' 
                        : 'bg-gradient-to-r from-purple-600/90 to-purple-800/90 border-purple-400'
                }`}>
                    <div className="flex items-center space-x-2">
                        <div className={`w-5 h-5 rounded-full border-2 border-white shadow-lg flex items-center justify-center ${
                            fenParts.active === 'w' ? 'bg-white' : 'bg-gray-800'
                        }`}>
                            <i className={`fas fa-chess-${fenParts.active === 'w' ? 'pawn' : 'pawn'} ${fenParts.active === 'w' ? 'text-gray-800' : 'text-white'} text-xs`}></i>
                        </div>
                        <span className="text-white font-bold text-sm">
                            {fenParts.active === 'w' ? 'White' : 'Black'} to move
                        </span>
                    </div>
                </div>
            )}

            {/* Bot Thinking Indicator */}
            {/* {botThinking && (
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] pointer-events-auto">
                    <div className="bg-gradient-to-r from-purple-600/90 to-purple-800/90 backdrop-blur-md rounded-2xl p-6 border-4 border-purple-400 shadow-2xl text-center">
                        <div className="text-4xl mb-3">
                            <i className="fas fa-robot text-purple-300 animate-pulse"></i>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">
                            Bot is thinking...
                        </h3>
                        <div className="flex justify-center space-x-1">
                            <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                    </div>
                </div>
            )} */}

            {/* Game Over Overlay */}
            {(status === GameStatus.CHECKMATE || status === GameStatus.STALEMATE || status === GameStatus.DRAW) && (
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[10000] pointer-events-auto">
                    <div className={`${getGameStatusDisplay().bgColor} backdrop-blur-md rounded-2xl p-6 lg:p-8 border-4 shadow-2xl text-center max-w-sm lg:max-w-md mx-4`}>
                        <div className="text-4xl lg:text-6xl mb-3 lg:mb-4">
                            <i className={`fas ${getGameStatusDisplay().icon} ${status === GameStatus.CHECKMATE ? 'text-yellow-400' : 'text-gray-400'}`}></i>
                        </div>
                        <h2 className="text-2xl lg:text-4xl font-bold text-white mb-3 lg:mb-4">
                            {getGameStatusDisplay().text}
                        </h2>
                        {status === GameStatus.CHECKMATE && (
                            <p className="text-gray-300 text-base lg:text-lg mb-4 lg:mb-6">
                                {fenParts.active === 'w' ? 'Black' : 'White'} has achieved checkmate!
                            </p>
                        )}
                        {status === GameStatus.STALEMATE && (
                            <p className="text-gray-300 text-base lg:text-lg mb-4 lg:mb-6">
                                The game ends in a draw due to stalemate.
                            </p>
                        )}
                        {status === GameStatus.DRAW && (
                            <p className="text-gray-300 text-base lg:text-lg mb-4 lg:mb-6">
                                The game ends in a draw.
                            </p>
                        )}
                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={handleNewGame}
                                className="cursor-pointer px-4 py-2 lg:px-6 lg:py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors text-sm lg:text-base"
                            >
                                <i className="fas fa-redo mr-2"></i>
                                New Game
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GameUI;
