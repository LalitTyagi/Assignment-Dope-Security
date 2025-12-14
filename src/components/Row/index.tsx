import classNames from 'classnames';
import type { RowProps } from './types';

const Row = ({ index, style, data }: RowProps) => {
    const { items, selectedIds, toggle } = data;
    const item = items[index];
    const isSelected = selectedIds.includes(item.id);

    return (
        <div
            className={classNames("flex items-center border-b border-white/5 px-6 transition-all text-foreground text-[0.95rem] hover:bg-white/[0.04] group", {
                "bg-primary/5 hover:bg-primary/10": isSelected,
                "opacity-50 grayscale-[50%] bg-black/40": item.viewed
            })}
            style={style}
        >
            <div className="w-[60px] flex justify-center">
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggle(item.id)}
                    aria-label={`Select ${item.name}`}
                    className="w-4 h-4 rounded border-white/20 bg-transparent text-primary focus:ring-primary focus:ring-offset-0 accent-primary cursor-pointer transition-all hover:border-primary/50"
                />
            </div>
            <div className="flex-[2] font-medium group-hover:text-primary/90 transition-colors">{item.name}</div>
            <div className="flex-[1.5] text-muted-foreground group-hover:text-foreground transition-colors">{item.location}</div>
            <div className="flex-[1.5]">
                <span className={classNames("px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-sm", {
                    "bg-green-500/10 text-green-400 border border-green-500/20 shadow-green-500/5": item.health.toLowerCase() === 'healthy',
                    "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 shadow-yellow-500/5": item.health.toLowerCase() === 'injured',
                    "bg-red-500/10 text-red-400 border border-red-500/20 shadow-red-500/5": item.health.toLowerCase() === 'critical'
                })}>
                    {item.health}
                </span>
            </div>
            <div className="flex-[1.5] flex items-center gap-2 font-mono text-xs text-muted-foreground">{item.power.toLocaleString()}</div>
        </div>
    );
};

export default Row;
