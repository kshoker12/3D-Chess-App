import { SquareId } from "../types/boardTypes";
import { FenParts } from "../types/uiTypes";

export const START_FEN: string = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

export function parseFen(fen: string): FenParts {
    const [placement, active, castling, enPassant, halfmove, fullmove] = fen.trim().split(/\s+/);
    return {
        placement,
        active: active as 'w' | 'b',
        castling,
        enPassant: enPassant as SquareId | '-',
        halfmove: Number(halfmove),
        fullmove: Number(fullmove),
    }
}

export function partsToFen(parts: FenParts): string {
    return `${parts.placement} ${parts.active} ${parts.castling} ${parts.enPassant} ${parts.halfmove} ${parts.fullmove}`;
}


/** 
 * @description Derive an 8x8 array from placement (upper=white lower=black)
 * @param placement - The placement string from the FEN
 * @returns An 8x8 array of strings or nulls
 */
export function placementToBoard(placement: string): (string|null)[][] {
    const rows = placement.split('/');
    return rows.map(row => {
      const cells: (string|null)[] = [];
      for (const ch of row) {
        if (/\d/.test(ch)) cells.push(...Array(Number(ch)).fill(null));
        else cells.push(ch);
      }
      return cells;
    });
  }