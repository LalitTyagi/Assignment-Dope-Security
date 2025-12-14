export interface Character {
    id: string;
    name: string;
    location: string;
    health: 'Healthy' | 'Injured' | 'Critical';
    power: number;
    viewed: boolean;
}

export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
    key: keyof Character;
    direction: SortDirection;
}

export interface TableState {
    data: Character[];
    // We don't store filteredData in state to avoid duplication, 
    // we derive it in selectors or components, 
    // BUT for 1000 items and simple logic, calculating in selector is fine.
    // However, for "performant" requirements, memoized selectors are best.
    loading: boolean;
    error: string | null;
    selectedIds: string[];
    searchQuery: string;
    healthFilter: string[]; // empty means all
    sortConfig: SortConfig | null;
}
