import { type CSSProperties } from 'react';
import type { Character } from '../../types';

export interface RowData {
    items: Character[];
    selectedIds: string[];
    toggle: (id: string) => void;
}

export interface RowProps {
    index: number;
    style: CSSProperties;
    data: RowData;
}
