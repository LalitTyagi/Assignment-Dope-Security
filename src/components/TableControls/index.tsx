import { type ChangeEvent, type FC } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setSearchQuery, markAsViewed, markAsUnviewed } from '../../store/tableSlice';
import { selectStats } from '../../store/selectors';
import { Search, Eye, EyeOff } from 'lucide-react';

const TableControls: FC = () => {
    const dispatch = useAppDispatch();
    const searchQuery = useAppSelector(state => state.table.searchQuery);
    const selectedIds = useAppSelector(state => state.table.selectedIds);
    const stats = useAppSelector(selectStats);

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        dispatch(setSearchQuery(e.target.value));
    };

    const handleMarkViewed = () => {
        console.log('Selected IDs:', selectedIds);
        dispatch(markAsViewed());
    };

    const handleMarkUnviewed = () => {
        console.log('Selected IDs:', selectedIds);
        dispatch(markAsUnviewed());
    };


    const hasSelection = selectedIds.length > 0;

    return (
        <div className="flex justify-between items-center p-4 bg-card/80 backdrop-blur-md border-b border-white/10 gap-4 flex-wrap sticky top-0 z-20">
            <div className="flex items-center gap-4">
                <div className="relative flex items-center group">
                    <Search size={16} className="absolute left-3 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Search characters..."
                        value={searchQuery}
                        onChange={handleSearch}
                        className="bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm w-[280px] transition-all focus:outline-none focus:border-primary/50 focus:bg-white/10 focus:shadow-[0_0_15px_rgba(var(--primary),0.1)] text-foreground placeholder:text-muted-foreground/70"
                    />
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="text-muted-foreground text-sm font-medium">
                    Total: <span className="text-foreground">{stats.total}</span>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        className="bg-primary/10 text-primary border border-primary/20 rounded-lg py-2 px-4 text-sm font-medium cursor-pointer flex items-center gap-2 transition-all hover:bg-primary/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-transparent disabled:text-muted-foreground disabled:border-white/10"
                        onClick={handleMarkUnviewed}
                        disabled={!hasSelection}
                    >
                        <EyeOff size={16} />
                        Mark Unviewed
                    </button>

                    <button
                        className="bg-primary text-primary-foreground border-none rounded-lg py-2 px-5 text-sm font-medium cursor-pointer flex items-center gap-2 transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none"
                        onClick={handleMarkViewed}
                        disabled={!hasSelection}
                    >
                        <Eye size={16} />
                        Mark Viewed
                        {selectedIds.length > 0 && (
                            <span className="bg-white/20 px-1.5 py-0.5 rounded text-xs">
                                {selectedIds.length}
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TableControls;
