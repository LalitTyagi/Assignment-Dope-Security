
import { render, act } from '@testing-library/react';
import { screen } from '@testing-library/dom';

import AutoSizer from '../index';

describe('AutoSizer', () => {
    // We will use a class-based mock for ResizeObserver
    // This allows us to capture the callback and mock instance methods
    let mockResizeObserverInstance: ResizeObserverMock | undefined;
    let triggerResizeCallback: ((entries: ResizeObserverEntry[]) => void) | undefined;

    class ResizeObserverMock {
        private callback: ResizeObserverCallback;
        public observe = jest.fn();
        public unobserve = jest.fn();
        public disconnect = jest.fn();

        constructor(callback: ResizeObserverCallback) {
            this.callback = callback;
            mockResizeObserverInstance = this; // Store the instance
            // Type cast to any to bypass strict ResizeObserverEntry requirement for test
            triggerResizeCallback = (entries: any) => this.callback(entries, this as unknown as ResizeObserver);
        }
    }

    // Stub the global ResizeObserver with our mock class
    window.ResizeObserver = ResizeObserverMock as any;

    beforeEach(() => {
        jest.clearAllMocks();
        mockResizeObserverInstance = undefined;
        triggerResizeCallback = undefined;
    });

    test('renders children function', () => {
        render(
            <AutoSizer>
                {({ width, height }) => <div>{width}x{height}</div>}
            </AutoSizer>
        );

        // Check if observe was called on the element
        expect(mockResizeObserverInstance?.observe).toHaveBeenCalled();
    });

    test('updates size when ResizeObserver triggers', () => {
        render(
            <AutoSizer>
                {({ width, height }) => <div data-testid="sizer">{width}x{height}</div>}
            </AutoSizer>
        );

        // Simulate resize
        // We need to trigger the callback manually
        const entries = [{ contentRect: { width: 500, height: 300 } }] as any;

        // Wrap in act if state update (Vitest usually handles this or use waitFor)
        // Since we are triggering callback directly outside of React event loop, wrapping in act might be needed or just wait.
        // But let's try calling it.
        if (triggerResizeCallback) {
            act(() => {
                triggerResizeCallback!(entries);
            });
        }

        expect(screen.getByTestId('sizer')).toHaveTextContent('500x300');
    });
});
