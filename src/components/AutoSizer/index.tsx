import { useEffect, useRef, useState, type FC } from 'react';
import type { AutoSizerProps } from './types';

const AutoSizer: FC<AutoSizerProps> = ({ children }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [size, setSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new ResizeObserver((entries) => {
            const entry = entries[0];
            if (entry) {
                setSize({
                    width: entry.contentRect.width,
                    height: entry.contentRect.height,
                });
            }
        });

        observer.observe(element);
        return () => observer.disconnect();
    }, []);

    return (
        <div ref={ref} style={{ width: '100%', height: '100%', flex: 1 }}>
            {size.width > 0 && children(size)}
        </div>
    );
};

export default AutoSizer;
