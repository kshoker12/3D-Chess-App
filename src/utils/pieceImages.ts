import { PieceType } from '../types/boardTypes';

const BASE = 'https://images.chesscomfiles.com/chess-themes/pieces/neo/150';

const WHITE: Record<PieceType, string> = {
    p: `${BASE}/wp.png`,
    r: `${BASE}/wr.png`,
    b: `${BASE}/wb.png`,
    n: `${BASE}/wn.png`,
    q: `${BASE}/wq.png`,
    k: `${BASE}/wk.png`,
};

const BLACK: Record<PieceType, string> = {
    p: `${BASE}/bp.png`,
    r: `${BASE}/br.png`,
    b: `${BASE}/bb.png`,
    n: `${BASE}/bn.png`,
    q: `${BASE}/bq.png`,
    k: `${BASE}/bk.png`,
};

export function getPieceImageWhite(pieceType: PieceType): string {
    return WHITE[pieceType] ?? '';
}

export function getPieceImageBlack(pieceType: PieceType): string {
    return BLACK[pieceType] ?? '';
}

export function getPieceImage(pieceType: PieceType, color: 'w' | 'b'): string {
    return color === 'w' ? getPieceImageWhite(pieceType) : getPieceImageBlack(pieceType);
}
