import { useState, type FC } from 'react';


// This version of react-window exports 'List' instead of 'FixedSizeList'
// rather than the standard 'FixedSizeList' you might be used to.
import { FixedSizeList as List } from 'react-window';

import { useCharacterData } from '../../hooks/useCharacterData';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { toggleSelection, toggleAllSelection, setSortConfig, setHealthFilter } from '../../store/tableSlice';
import { selectFilteredAndSortedData } from '../../store/selectors';
import TableControls from '../TableControls';

import classNames from 'classnames';
import { ChevronUp, Filter } from 'lucide-react';
import type { Character } from '../../types';

import AutoSizer from '../AutoSizer';
import Row from '../Row';

const Table: FC = () => {
    const { loading, error } = useCharacterData(); // Keeping track of loading and error states to keep the UI responsive.
    const dispatch = useAppDispatch();
    const filteredData = useAppSelector(selectFilteredAndSortedData); // The data pipeline goes: Filter -> Sort.
    const selectedIds = useAppSelector(state => state.table.selectedIds);
    const sortConfig = useAppSelector(state => state.table.sortConfig);
    const healthFilter = useAppSelector(state => state.table.healthFilter);

    const [isHealthFilterOpen, setIsHealthFilterOpen] = useState(false);

    const handleSort = (key: keyof Character) => {
        dispatch(setSortConfig(key));
    };

    const handleToggle = (id: string) => {
        dispatch(toggleSelection(id));
    };

    const handleSelectAll = () => {
        // When 'Select All' is clicked, we toggle all items in the current filtered view.
        dispatch(toggleAllSelection(filteredData.map(c => c.id)));
    };

    const toggleHealthFilter = (status: string) => {
        const newFilter = healthFilter.includes(status)
            ? healthFilter.filter(s => s !== status)
            : [...healthFilter, status];
        dispatch(setHealthFilter(newFilter));
    };

    const isPageSelected = filteredData.length > 0 && filteredData.every(item => selectedIds.includes(item.id));
    const isIndeterminate = filteredData.some(item => selectedIds.includes(item.id)) && !isPageSelected;

    if (error) return <div className="p-8 text-red-500 text-center font-medium bg-red-500/10 rounded-lg border border-red-500/20 mx-4">Error: {error}</div>;

    return (
        <div className="w-full h-[75vh] flex flex-col bg-card rounded-xl border border-white/10 overflow-hidden shadow-2xl relative">
            <TableControls />

            <div className="flex items-center bg-card/95 backdrop-blur z-10 border-b border-white/10 px-6 h-[50px] font-semibold text-muted-foreground text-[11px] uppercase tracking-[0.1em] select-none shadow-sm">
                <div className="w-[60px] flex justify-center">
                    <input
                        type="checkbox"
                        checked={isPageSelected}
                        ref={input => { if (input) input.indeterminate = isIndeterminate; }}
                        onChange={handleSelectAll}
                        aria-label="Select all"
                        className="w-4 h-4 rounded border-white/20 bg-transparent text-primary focus:ring-primary focus:ring-offset-0 accent-primary cursor-pointer hover:border-primary/50 transition-colors"
                    />
                </div>

                <div
                    className="flex-[2] flex items-center gap-2 cursor-pointer hover:text-primary transition-colors group"
                    onClick={() => handleSort('name')}
                >
                    Name
                    <ChevronUp
                        className={classNames("w-3 h-3 transition-transform duration-200", {
                            "rotate-180": sortConfig?.key === 'name' && sortConfig.direction === 'desc',
                            "opacity-0 group-hover:opacity-50": sortConfig?.key !== 'name',
                            "text-primary": sortConfig?.key === 'name'
                        })}
                    />
                </div>

                <div
                    className="flex-[1.5] flex items-center gap-2 cursor-pointer hover:text-primary transition-colors group"
                    onClick={() => handleSort('location')}
                >
                    Location
                    <ChevronUp
                        className={classNames("w-3 h-3 transition-transform duration-200", {
                            "rotate-180": sortConfig?.key === 'location' && sortConfig.direction === 'desc',
                            "opacity-0 group-hover:opacity-50": sortConfig?.key !== 'location',
                            "text-primary": sortConfig?.key === 'location'
                        })}
                    />
                </div>

                <div className="flex-[1.5] flex items-center gap-2 relative">
                    <div
                        className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors group"
                        onClick={() => handleSort('health')}
                    >
                        Health
                        <ChevronUp
                            className={classNames("w-3 h-3 transition-transform duration-200", {
                                "rotate-180": sortConfig?.key === 'health' && sortConfig.direction === 'desc',
                                "opacity-0 group-hover:opacity-50": sortConfig?.key !== 'health',
                                "text-primary": sortConfig?.key === 'health'
                            })}
                        />
                    </div>
                    <div className="relative ml-2">
                        <Filter
                            className={classNames("w-3.5 h-3.5 cursor-pointer transition-colors", {
                                "text-primary": healthFilter.length > 0,
                                "text-muted-foreground hover:text-primary": healthFilter.length === 0
                            })}
                            onClick={() => setIsHealthFilterOpen(!isHealthFilterOpen)}
                            aria-label="Filter Health"
                        />

                        {isHealthFilterOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setIsHealthFilterOpen(false)}
                                />
                                <div className="absolute top-full left-0 mt-2 w-40 bg-[#1a1b1e] border border-white/10 rounded-lg shadow-xl z-50 p-2 flex flex-col gap-1">
                                    {['Healthy', 'Injured', 'Critical'].map(status => (
                                        <label
                                            key={status}
                                            className="flex items-center gap-2 px-3 py-2 hover:bg-white/5 rounded-md cursor-pointer text-xs capitalize text-gray-300"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={healthFilter.includes(status)}
                                                onChange={() => toggleHealthFilter(status)}
                                                className="rounded border-white/20 bg-transparent text-primary focus:ring-primary focus:ring-offset-0 accent-primary"
                                            />
                                            {status}
                                        </label>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div
                    className="flex-[1.5] flex items-center gap-2 cursor-pointer hover:text-primary transition-colors group"
                    onClick={() => handleSort('power')}
                    role="button"
                    tabIndex={0}
                >
                    Power
                    <ChevronUp
                        className={classNames("w-3 h-3 transition-transform duration-200", {
                            "rotate-180": sortConfig?.key === 'power' && sortConfig.direction === 'desc',
                            "opacity-0 group-hover:opacity-50": sortConfig?.key !== 'power',
                            "text-primary": sortConfig?.key === 'power'
                        })}
                    />
                </div>
            </div>

            <div className="flex-1 w-full bg-black/10">
                {loading ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-muted-foreground bg-white/[0.02] h-full">
                        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin mb-4"></div>
                        <div className="animate-pulse text-sm font-medium tracking-wide">Loading Database...</div>
                    </div>
                ) : (
                    <AutoSizer>
                        {({ width, height }) => (
                            <List
                                height={height}
                                itemCount={filteredData.length}
                                itemSize={60}
                                width={width}
                                itemData={{ items: filteredData, selectedIds, toggle: handleToggle }}
                                className="thin-scrollbar"
                            >
                                {Row}
                            </List>
                        )}
                    </AutoSizer>
                )}
            </div>
        </div>
    );
};

export default Table;
