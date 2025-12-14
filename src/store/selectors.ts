import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from './store';
// Character type is used implicitly in RootState but not explicitly needed if we infer types correctly.

const selectData = (state: RootState) => state.table.data;
const selectSearchQuery = (state: RootState) => state.table.searchQuery;
const selectHealthFilter = (state: RootState) => state.table.healthFilter;
const selectSortConfig = (state: RootState) => state.table.sortConfig;



export const selectFilteredAndSortedData = createSelector(
    [selectData, selectSearchQuery, selectHealthFilter, selectSortConfig],
    (data, searchQuery, healthFilter, sortConfig) => {
        let result = [...data];

        // Filter by Search Query
        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            result = result.filter(char =>
                char.name.toLowerCase().includes(lowerQuery) ||
                char.location.toLowerCase().includes(lowerQuery)
            );
        }

        // Filter by Health
        if (healthFilter.length > 0) {
            result = result.filter(char => healthFilter.includes(char.health));
        }

        // Sort
        if (sortConfig) {
            result.sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];

                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return result;
    }
);



export const selectStats = createSelector(
    [selectFilteredAndSortedData],
    (data) => ({
        total: data.length,
        healthyCount: data.filter(c => c.health === 'Healthy').length,
        injuredCount: data.filter(c => c.health === 'Injured').length,
        criticalCount: data.filter(c => c.health === 'Critical').length
    })
);
