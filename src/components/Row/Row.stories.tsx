import type { Meta, StoryObj } from '@storybook/react';
import Row from './index';
import type { Character } from '../../types';

const meta = {
    title: 'Components/Row',
    component: Row,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof Row>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mock data for stories
const mockCharacter: Character = {
    id: '1',
    name: 'Naruto Uzumaki',
    location: 'Konoha',
    health: 'Healthy',
    power: 9000,
    viewed: false,
};

const mockData = {
    items: [mockCharacter],
    selectedIds: [] as string[],
    toggle: (id: string) => console.log('Toggle:', id),
};

export const Default: Story = {
    args: {
        index: 0,
        style: { height: 60 },
        data: mockData,
    },
};

export const Selected: Story = {
    args: {
        index: 0,
        style: { height: 60 },
        data: {
            ...mockData,
            selectedIds: ['1'],
        },
    },
};

export const Viewed: Story = {
    args: {
        index: 0,
        style: { height: 60 },
        data: {
            ...mockData,
            items: [{ ...mockCharacter, viewed: true }],
        },
    },
};

export const Injured: Story = {
    args: {
        index: 0,
        style: { height: 60 },
        data: {
            ...mockData,
            items: [{ ...mockCharacter, health: 'Injured' }],
        },
    },
};

export const Critical: Story = {
    args: {
        index: 0,
        style: { height: 60 },
        data: {
            ...mockData,
            items: [{ ...mockCharacter, health: 'Critical' }],
        },
    },
};

export const HighPower: Story = {
    args: {
        index: 0,
        style: { height: 60 },
        data: {
            ...mockData,
            items: [{ ...mockCharacter, name: 'Madara Uchiha', power: 15000 }],
        },
    },
};
