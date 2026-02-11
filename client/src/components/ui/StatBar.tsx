interface StatBarProps {
  label: string;
  value: number;
  max?: number;
  onIncrement?: () => void;
  onDecrement?: () => void;
  canIncrement?: boolean;
  canDecrement?: boolean;
}

export default function StatBar({
  label,
  value,
  max = 20,
  onIncrement,
  onDecrement,
  canIncrement = false,
  canDecrement = false,
}: StatBarProps) {
  const pct = (value / max) * 100;

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-rpg-muted w-24 shrink-0">{label}</span>
      {onDecrement && (
        <button
          onClick={onDecrement}
          disabled={!canDecrement}
          className="w-8 h-8 rounded-lg bg-rpg-surface border border-rpg-border text-rpg-text disabled:opacity-30 active:scale-90"
        >
          -
        </button>
      )}
      <div className="flex-1 h-3 bg-rpg-border rounded-full overflow-hidden">
        <div
          className="h-full bg-rpg-accent rounded-full transition-all duration-200"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-sm font-bold w-6 text-center">{value}</span>
      {onIncrement && (
        <button
          onClick={onIncrement}
          disabled={!canIncrement}
          className="w-8 h-8 rounded-lg bg-rpg-surface border border-rpg-border text-rpg-text disabled:opacity-30 active:scale-90"
        >
          +
        </button>
      )}
    </div>
  );
}
