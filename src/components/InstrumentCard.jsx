// Small "gauge card" used for humidity, pressure, UV, visibility.
// A short arc communicates the reading within its expected band at a glance.
export default function InstrumentCard({ label, value, unit, min, max, accent = "var(--color-teal)", children }) {
  const fraction = Math.min(1, Math.max(0, (value - min) / (max - min)));
  const sweep = 180; // half circle
  const startAngle = 180;
  const angle = startAngle + fraction * sweep;
  const rad = (angle * Math.PI) / 180;
  const r = 34;
  const cx = 40;
  const cy = 40;
  const x = cx + r * Math.cos(rad);
  const y = cy + r * Math.sin(rad);

  // arc path (background track, half circle)
  const trackStart = { x: cx + r * Math.cos(Math.PI), y: cy + r * Math.sin(Math.PI) };
  const trackEnd = { x: cx + r * Math.cos(0), y: cy + r * Math.sin(0) };

  const progressLarge = fraction > 0.5 ? 1 : 0;

  return (
    <div className="bg-panel-raised border border-hairline rounded-xl p-4 flex items-center gap-4">
      <svg viewBox="0 0 80 44" className="w-20 h-11 shrink-0 overflow-visible">
        <path
          d={`M ${trackStart.x} ${trackStart.y} A ${r} ${r} 0 0 1 ${trackEnd.x} ${trackEnd.y}`}
          fill="none"
          stroke="#2b4152"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <path
          d={`M ${trackStart.x} ${trackStart.y} A ${r} ${r} 0 ${progressLarge} 1 ${x} ${y}`}
          fill="none"
          stroke={accent}
          strokeWidth="5"
          strokeLinecap="round"
        />
        <circle cx={x} cy={y} r="3.2" fill={accent} />
      </svg>
      <div className="min-w-0">
        <div className="font-mono text-xl text-paper tabular-nums leading-none">
          {value}
          <span className="text-sm text-mist ml-0.5">{unit}</span>
        </div>
        <div className="text-[11px] tracking-[0.15em] uppercase text-mist font-display mt-1.5">{label}</div>
        {children}
      </div>
    </div>
  );
}
