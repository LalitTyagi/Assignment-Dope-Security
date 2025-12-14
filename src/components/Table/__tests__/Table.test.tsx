import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import tableReducer, { fetchCharacters } from '../../../store/tableSlice';
import Table from '../index';
import userEvent from '@testing-library/user-event';

// Mock hook to skip loading state
jest.mock('../../../hooks/useCharacterData', () => ({
    useCharacterData: () => ({
        loading: false,
        error: null,
    }),
}));

// Mock AutoSizer with fixed dimensions
jest.mock('../../AutoSizer', () => ({
    __esModule: true,
    default: ({ children }: any) => children({ width: 1000, height: 600 }),
}));


// Mock Row component instead of react-window to avoid ESM issues
jest.mock('../../Row', () => ({
    __esModule: true,
    default: ({ index, data }: any) => {
        const item = data.items[index];
        if (!item) return null;

        return (
            <div data-testid={`row-${item.id}`}>
                <span>{item.name}</span>
                <button aria-label={`select-${item.id}`} onClick={() => data.toggle(item.id)}>
                    select
                </button>
            </div>
        );
    },
}));

// Mock API with test data
global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        json: () =>
            Promise.resolve([
                { id: '1', name: 'Naruto', location: 'Konoha', health: 'Healthy', power: 9000, viewed: false },
                { id: '2', name: 'Sasuke', location: 'Konoha', health: 'Injured', power: 8500, viewed: false },
                { id: '3', name: 'Gaara', location: 'Suna', health: 'Critical', power: 8000, viewed: false },
            ]),
    })
) as unknown as jest.Mock;

const createTestStore = () =>
    configureStore({
        reducer: { table: tableReducer },
    });

describe('Table Integration', () => {
    let store: ReturnType<typeof createTestStore>;

    beforeEach(async () => {
        store = createTestStore();
        jest.clearAllMocks();
        await store.dispatch(fetchCharacters());
    });

    test('renders data', async () => {
        render(
            <Provider store={store}>
                <Table />
            </Provider>
        );

        // Verify characters are rendered
        expect(await screen.findByText('Naruto')).toBeInTheDocument();
        expect(screen.getByText('Sasuke')).toBeInTheDocument();
        expect(screen.getByText('Gaara')).toBeInTheDocument();
    });

    test('search functionality', async () => {
        render(
            <Provider store={store}>
                <Table />
            </Provider>
        );

        await waitFor(() => expect(screen.getByText('Naruto')).toBeInTheDocument());

        const input = screen.getByPlaceholderText(/search/i);
        await userEvent.type(input, 'Suna');

        expect(screen.queryByText('Naruto')).not.toBeInTheDocument();
        expect(screen.queryByText('Sasuke')).not.toBeInTheDocument();
        expect(screen.getByText('Gaara')).toBeInTheDocument();
    });

    test('filter functionality', async () => {
        render(
            <Provider store={store}>
                <Table />
            </Provider>
        );

        await waitFor(() => expect(screen.getByText('Naruto')).toBeInTheDocument());

        const filterBtn = screen.getByLabelText('Filter Health');
        fireEvent.click(filterBtn);

        const criticalCheckbox = screen.getByRole('checkbox', { name: 'Critical' });
        fireEvent.click(criticalCheckbox);

        await waitFor(() => {
            expect(screen.queryByText('Naruto')).not.toBeInTheDocument();
            expect(screen.queryByText('Sasuke')).not.toBeInTheDocument();
            expect(screen.getByText('Gaara')).toBeInTheDocument();
        });
    });

});
