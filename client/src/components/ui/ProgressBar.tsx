interface ProgressBarProps {
  value: number;
  max: number;
  color?: string;
  label?: string;
  showValue?: boolean;
}

export default function ProgressBar({ value, max, color = 'bg-rpg-accent', label, showValue = true }: ProgressBarProps) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;

  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="flex justify-between text-xs text-rpg-muted mb-1">
          {label && <span>{label}</span>}
          {showValue && <span>{value}/{max}</span>}
        </div>
      )}
      <div className="w-full h-3 bg-rpg-border rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
