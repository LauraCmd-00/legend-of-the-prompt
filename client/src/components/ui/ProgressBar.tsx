interface ProgressBarProps {
  value: number;
  max: number;
  color?: string;
  label?: string;
  showValue?: boolean;
}

export default function ProgressBar({ value, max, color, label, showValue = true }: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const fillColor = color || 'bg-white';

  return (
    <div className="flex-1">
      {(label || showValue) && (
        <div className="flex justify-between text-[10px] text-rpg-muted mb-0.5">
          {label && <span className="uppercase tracking-wider">{label}</span>}
          {showValue && <span>{value}/{max}</span>}
        </div>
      )}
      <div className="h-2 border border-white/30 bg-transparent">
        <div
          className={`h-full ${fillColor} transition-all duration-300`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
