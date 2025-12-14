

import { render, screen, fireEvent } from '@testing-library/react';
import Row from '../index';

describe('Row', () => {
    const mockToggle = jest.fn();
    const mockItems: any[] = [
        { id: '1', name: 'Naruto', location: 'Konoha', health: 'Healthy', power: 9000, viewed: false },
        { id: '2', name: 'Sasuke', location: 'Konoha', health: 'Injured', power: 8500, viewed: true },
        { id: '3', name: 'Gaara', location: 'Suna', health: 'Critical', power: 8000, viewed: false },
    ];

    const defaultProps = {
        index: 0,
        style: {},
        data: {
            items: mockItems,
            selectedIds: [],
            toggle: mockToggle,
        },
    };

    test('renders character data correctly', () => {
        render(<Row {...defaultProps} />);

        expect(screen.getByText('Naruto')).toBeInTheDocument();
        expect(screen.getByText('Konoha')).toBeInTheDocument();
        expect(screen.getByText('Healthy')).toBeInTheDocument();
        expect(screen.getByText('9,000')).toBeInTheDocument();
    });

    test('handles selection toggle', () => {
        render(<Row {...defaultProps} />);

        const checkbox = screen.getByLabelText('Select Naruto');
        fireEvent.click(checkbox);

        expect(mockToggle).toHaveBeenCalledWith('1');
    });

    test('shows checked state when selected', () => {
        const props = {
            ...defaultProps,
            data: {
                ...defaultProps.data,
                selectedIds: ['1']
            }
        };
        render(<Row {...props} />);

        const checkbox = screen.getByLabelText('Select Naruto');
        expect(checkbox).toBeChecked();
    });

    test('applies viewed styling', () => {
        // Index 1 is Sasuke, who is viewed: true
        const { container } = render(<Row {...defaultProps} index={1} />);

        // We look for the class that applies opacity/grayscale
        // "opacity-50 grayscale-[50%] bg-black/40"
        const rowDiv = container.firstChild;
        expect(rowDiv).toHaveClass('opacity-50');
        expect(rowDiv).toHaveClass('grayscale-[50%]');
    });

    test('applies health status styling correctly', () => {
        const { rerender } = render(<Row {...defaultProps} index={0} />); // Healthy
        expect(screen.getByText('Healthy')).toHaveClass('text-green-400');

        rerender(<Row {...defaultProps} index={1} />); // Injured
        expect(screen.getByText('Injured')).toHaveClass('text-yellow-400');

        rerender(<Row {...defaultProps} index={2} />); // Critical
        expect(screen.getByText('Critical')).toHaveClass('text-red-400');
    });
});
