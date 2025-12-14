import type { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import TableControls from './index';
import tableReducer from '../../store/tableSlice';

type TableControlsStoryArgs = {
  storeState?: Partial<{
    data: any[];
    loading: boolean;
    error: string | null;
    selectedIds: string[];
    searchQuery: string;
    sortConfig: any;
    healthFilter: string[];
  }>;
};

// Create a mock store factory
const createMockStore = (initialState: TableControlsStoryArgs['storeState'] = {}) => {
  return configureStore({
    reducer: {
      table: tableReducer,
    },
    preloadedState: {
      table: {
        data: [],
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
  title: 'Components/TableControls',
  component: TableControls,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  decorators: [
    (Story, context) => {
      const args = context.args as TableControlsStoryArgs;
      const store = createMockStore(args.storeState ?? {});
      return (
        <Provider store={store}>
          <div className="bg-[#0a0a0a] min-h-screen p-4">
            <Story />
          </div>
        </Provider>
      );
    },
  ],
} satisfies Meta<typeof TableControls>;

export default meta;

type Story = StoryObj<typeof meta>;

const makeData = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    id: `${i + 1}`,
    name: `Character ${i + 1}`,
    location: 'Konoha',
    health: 'Healthy',
    power: 5000,
    viewed: false,
  }));

export const Default: Story = {
  args: {
    storeState: {
      data: makeData(100),
    },
  },
};

export const WithSelection: Story = {
  args: {
    storeState: {
      data: makeData(100),
      selectedIds: ['1', '2', '3', '4', '5'],
    },
  },
};

export const WithSearch: Story = {
  args: {
    storeState: {
      data: makeData(100),
      searchQuery: 'Naruto',
    },
  },
};

export const EmptyState: Story = {
  args: {
    storeState: {
      data: [],
    },
  },
};
