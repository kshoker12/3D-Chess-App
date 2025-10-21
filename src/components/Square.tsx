import { FC, useMemo, memo } from "react";
import { SquareId } from "../types/boardTypes";
import { Texture } from "three";
import { Box, Outlines, Circle } from "@react-three/drei";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { createSquareSpecificSelectors } from "../store/selectors/boardSelectors";
import { setSelectedSquare } from "../store/slices/boardSlice";
import { makeMove } from "../store/slices/gameSlice";
import { Move } from "../types/gameTypes";
import { store } from "../store/store";

export interface SquareProps {
    squareId: SquareId;
    texture: Texture;
    wood: Texture;
    white: Texture;
}

const fileToNumber = (file: string): number => {
    return ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].indexOf(file);
}

const Square: FC<SquareProps> = memo(({squareId, texture, wood, white}) => { 
    const dispatch = useAppDispatch();
    
    // Create square-specific selectors that only trigger when THIS square is affected
    const squareSelectors = useMemo(() => createSquareSpecificSelectors(squareId), [squareId]);
    
    // Only subscribe to selectors that are relevant to this specific square
    const isSelected = useAppSelector(squareSelectors.isSelected);
    const isLegal = useAppSelector(squareSelectors.isLegal);

    // Memoize position calculations
    const x = useMemo(() => fileToNumber(squareId.charAt(0)), [squareId]);
    const y = useMemo(() => parseInt(squareId.charAt(1)) - 1, [squareId]);

    // Non-reactive click handler that reads current state at click time
    const handleClick = useMemo(() => (e: any) => {
        e.stopPropagation();
        // Get current state at click time instead of subscribing to it
        const currentState = store.getState();
        const selectedSquare = currentState.board.selectedSquare;
        
        if (selectedSquare === squareId) {
            dispatch(setSelectedSquare(null));
        } else if (selectedSquare === null) {
            dispatch(setSelectedSquare(squareId));
        } else {
            const move: Move = { from: selectedSquare as SquareId, to: squareId as SquareId };
            dispatch(makeMove(move));
        }
    }, [squareId, dispatch]);

    return (
        <>
            <Box 
                args={[1, 0.4, 1]} 
                position={[x - 4, -0.6, y - 4]}
                onClick={handleClick}
            >
                <meshStandardMaterial color={'grey'} attach={'material-0'} map={wood} />
                <meshStandardMaterial color={'grey'} attach={'material-1'} map={wood} />
                <meshStandardMaterial 
                    color={isSelected ? 'lime' : 'white'} attach={'material-2'} 
                    map={isSelected ? white : texture} 
                />
                <meshStandardMaterial color={'grey'} attach={'material-3'} map={wood} />
                <meshStandardMaterial color={'grey'} attach={'material-4'} map={wood} />
                <meshStandardMaterial color={'grey'} attach={'material-5'} map={wood} />
                {isLegal && <Outlines color="lime" scale={1.1} thickness={1} />}
            </Box>
            
            {/* Chess.com style circle indicator for legal moves */}
            {isLegal && (
                <Circle 
                    args={[0.2, 32]} 
                    position={[x - 4, -0.3, y - 4]}
                    rotation={[-Math.PI / 2, 0, 0]}
                >
                    <meshStandardMaterial color="#666666" transparent opacity={0.6} />
                </Circle>
            )}
            
            {/* Circle indicator for captures (when there's a piece) */}
            {isLegal && (
                <Circle 
                    args={[0.4, 32]} 
                    position={[x - 4, -0.5, y - 4]}
                    rotation={[-Math.PI / 2, 0, 0]}
                >
                    <meshStandardMaterial color="#ff0000" transparent opacity={0.3} />
                </Circle>
            )}
        </>
        
    )
});

Square.displayName = 'Square';

export default Square;