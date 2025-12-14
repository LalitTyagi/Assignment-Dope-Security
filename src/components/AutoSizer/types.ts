import { type ReactNode } from 'react';

export interface AutoSizerProps {
    children: (size: { width: number; height: number }) => ReactNode;
}
