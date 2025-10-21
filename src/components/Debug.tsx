import React from 'react'
import { selectSelectedSquare } from '../store/selectors/boardSelectors';
import { useAppSelector } from '../store/hooks';

export default function Debug() {
    const selectedSquare = useAppSelector(selectSelectedSquare);

  return (
    <div className="absolute top-0 left-0 z-50 text-black bg-red-500">{selectedSquare ? `Selected Square: ${selectedSquare}` : 'No square selected'}</div>
  )
}
