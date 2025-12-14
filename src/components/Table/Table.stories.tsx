import type { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Table from './index';
import tableReducer from '../../store/tableSlice';

// Mock the character data hook
jest.mock('../../hooks/useCharacterData', () => ({
    useCharacterData: () => ({
        loading: false,
        error: null,
    }),
}));

type TablePreloadedState = {
    data?: any[];
    loading?: boolean;
    error?: string | null;
    selectedIds?: string[];
    searchQuery?: string;
    sortConfig?: any;
    healthFilter?: string[];
};

const createMockStore = (initialState: TablePreloadedState = {}) => {
    const defaultData = Array.from({ length: 50 }, (_, i) => ({
        id: `${i + 1}`,
        name: `Character ${i + 1}`,
        location: i % 3 === 0 ? 'Konoha' : i % 3 === 1 ? 'Suna' : 'Cloud Village',
        health: i % 3 === 0 ? 'Healthy' : i % 3 === 1 ? 'Injured' : 'Critical',
        power: 5000 + i * 100,
        viewed: false,
    }));

    return configureStore({
        reducer: { table: tableReducer },
        preloadedState: {
            table: {
                data: defaultData,
                loading: false,
                error: null,
                selectedIds: [],
                searchQuery: '',
                sortConfig: null,
                healthFilter: [],
                ...initialState,
            },
        },
    });
};

const meta = {
    title: 'Components/Table',
    component: Table,
    parameters: { layout: 'fullscreen' },
    tags: ['autodocs'],
    decorators: [
        (Story, context) => {
            const store = createMockStore((context.args as any)?.storeState ?? {});
            return (
                <Provider store={store}>
                    <div className="bg-[#0a0a0a] min-h-screen p-8">
                        <Story />
                    </div>
                </Provider>
            );
        },
    ],
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

// keep your stories same
export const Default: Story = { args: { storeState: {} } };
export const WithSelection: Story = { args: { storeState: { selectedIds: ['1', '2', '3', '4', '5'] } } };
export const Filtered: Story = { args: { storeState: { healthFilter: ['Critical'] } } };
export const Sorted: Story = { args: { storeState: { sortConfig: { key: 'power', direction: 'desc' } } } };
export const WithSearch: Story = { args: { storeState: { searchQuery: 'Character 1' } } };
export const LargeDataset: Story = {
    args: {
        storeState: {
            data: Array.from({ length: 1000 }, (_, i) => ({
                id: `${i + 1}`,
                name: `Character ${i + 1}`,
                location: i % 3 === 0 ? 'Konoha' : i % 3 === 1 ? 'Suna' : 'Cloud Village',
                health: i % 3 === 0 ? 'Healthy' : i % 3 === 1 ? 'Injured' : 'Critical',
                power: 5000 + i * 100,
                viewed: false,
            })),
        },
    },
};
