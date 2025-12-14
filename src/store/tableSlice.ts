import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { Character, SortConfig } from '../types';

interface TableState {
    data: Character[];
    loading: boolean;
    error: string | null;
    selectedIds: string[];
    searchQuery: string;
    healthFilter: string[];
    sortConfig: SortConfig | null;
}

const initialState: TableState = {
    data: [],
    loading: false,
    error: null,
    selectedIds: [],
    searchQuery: '',
    healthFilter: [],
    sortConfig: null,
};

const DB_URL =
  'https://raw.githubusercontent.com/LalitTyagi/Assignment-Dope-Security/main/db.json';

export const fetchCharacters = createAsyncThunk('table/fetchCharacters', async () => {
  const res = await fetch(DB_URL);
  if (!res.ok) throw new Error('Failed to fetch data');
  const json = await res.json();
  return json.characters; // <-- IMPORTANT
});


const tableSlice = createSlice({
    name: 'table',
    initialState,
    reducers: {
        toggleSelection: (state, action: PayloadAction<string>) => {
            const id = action.payload;
            if (state.selectedIds.includes(id)) {
                state.selectedIds = state.selectedIds.filter(itemId => itemId !== id);
            } else {
                state.selectedIds.push(id);
            }
        },
        toggleAllSelection: (state, action: PayloadAction<string[]>) => {
            // If all currently filtered IDs are selected, deselect them.
            // Otherwise, select them.
            const currentIds = action.payload;
            const allSelected = currentIds.every(id => state.selectedIds.includes(id));

            if (allSelected) {
                state.selectedIds = state.selectedIds.filter(id => !currentIds.includes(id));
            } else {
                // Add ones that aren't already selected
                const newIds = currentIds.filter(id => !state.selectedIds.includes(id));
                state.selectedIds.push(...newIds);
            }
        },
        setSearchQuery: (state, action: PayloadAction<string>) => {
            state.searchQuery = action.payload;
        },
        setHealthFilter: (state, action: PayloadAction<string[]>) => {
            state.healthFilter = action.payload;
        },
        setSortConfig: (state, action: PayloadAction<keyof Character>) => {
            const key = action.payload;
            if (state.sortConfig && state.sortConfig.key === key) {
                // Toggle direction
                state.sortConfig.direction = state.sortConfig.direction === 'asc' ? 'desc' : 'asc';
            } else {
                state.sortConfig = { key, direction: 'asc' };
            }
        },

        markAsViewed: (state) => {
            // Mark selected rows as viewed
            state.data.forEach(char => {
                if (state.selectedIds.includes(char.id)) {
                    char.viewed = true;
                }
            });
        },
        markAsUnviewed: (state) => {
            // Mark selected rows as unviewed
            state.data.forEach(char => {
                if (state.selectedIds.includes(char.id)) {
                    char.viewed = false;
                }
            });
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCharacters.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCharacters.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchCharacters.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch';
            });
    },
});

export const {
    toggleSelection,
    toggleAllSelection,
    setSearchQuery,
    setHealthFilter,
    setSortConfig,
    markAsViewed,
    markAsUnviewed
} = tableSlice.actions;

export default tableSlice.reducer;
