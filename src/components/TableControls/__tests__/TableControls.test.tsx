import { render, screen, fireEvent } from '@testing-library/react';
import TableControls from '../index';

const mockDispatch = jest.fn();

// IMPORTANT: this must be declared BEFORE the module mock uses it
let mockState: {
    table: {
        searchQuery: string;
        selectedIds: string[];
    };
} = {
    table: {
        searchQuery: '',
        selectedIds: [],
    },
};

jest.mock('../../../store/hooks', () => ({
    useAppDispatch: () => mockDispatch,
    useAppSelector: (selector: any) => selector(mockState),
}));

jest.mock('../../../store/tableSlice', () => ({
    setSearchQuery: (query: string) => ({ type: 'table/setSearchQuery', payload: query }),
    markAsViewed: () => ({ type: 'table/markAsViewed' }),
    markAsUnviewed: () => ({ type: 'table/markAsUnviewed' }),
}));

jest.mock('../../../store/selectors', () => ({
    selectStats: () => ({
        total: 100,
        healthyCount: 50,
        injuredCount: 30,
        criticalCount: 20,
    }),
}));

describe('TableControls', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockState = {
            table: {
                searchQuery: '',
                selectedIds: [],
            },
        };
    });

    test('renders search input and dispatches setSearchQuery on typing', () => {
        render(<TableControls />);

        const input = screen.getByPlaceholderText('Search characters...');
        fireEvent.change(input, { target: { value: 'Naruto' } });

        expect(mockDispatch).toHaveBeenCalledWith({
            type: 'table/setSearchQuery',
            payload: 'Naruto',
        });
    });

    test('Mark Viewed button is disabled when no selection', () => {
        render(<TableControls />);

        const btn = screen.getByRole('button', { name: /mark viewed/i });
        expect(btn).toBeDisabled();
    });

    test('Mark Viewed button enables and dispatches when selection exists', () => {
        mockState.table.selectedIds = ['1', '2'];

        render(<TableControls />);

        const btn = screen.getByRole('button', { name: /mark viewed/i });
        expect(btn).toBeEnabled();

        // count pill
        expect(screen.getByText('2')).toBeInTheDocument();

        fireEvent.click(btn);
        expect(mockDispatch).toHaveBeenCalledWith({ type: 'table/markAsViewed' });
    });

    test('Mark Unviewed button enables and dispatches when selection exists', () => {
        mockState.table.selectedIds = ['1'];

        render(<TableControls />);

        const btn = screen.getByRole('button', { name: /mark unviewed/i });
        expect(btn).toBeEnabled();

        fireEvent.click(btn);
        expect(mockDispatch).toHaveBeenCalledWith({ type: 'table/markAsUnviewed' });
    });
});
