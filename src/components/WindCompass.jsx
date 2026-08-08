export default function WindCompass({ speed, direction, compassLabel }) {
  return (
    <div className="bg-panel-raised border border-hairline rounded-xl p-4 flex items-center gap-4">
      <svg viewBox="0 0 80 80" className="w-16 h-16 shrink-0">
        <circle cx="40" cy="40" r="34" fill="none" stroke="#2b4152" strokeWidth="1.5" />
        {["N", "E", "S", "W"].map((d, i) => {
          const a = i * 90 - 90;
          const rad = (a * Math.PI) / 180;
          const x = 40 + 27 * Math.cos(rad);
          const y = 40 + 27 * Math.sin(rad);
          return (
            <text key={d} x={x} y={y + 2} fontSize="7" textAnchor="middle" fill="#7c93a3" fontFamily="IBM Plex Mono, monospace">
              {d}
            </text>
          );
        })}
        <g style={{ transform: `rotate(${direction}deg)`, transformOrigin: "40px 40px", transition: "transform 1s ease" }}>
          <line x1="40" y1="40" x2="40" y2="14" stroke="#6fb8ae" strokeWidth="2.5" strokeLinecap="round" />
          <polygon points="40,10 36,17 44,17" fill="#6fb8ae" />
        </g>
        <circle cx="40" cy="40" r="3" fill="#efe7d8" />
      </svg>
      <div className="min-w-0">
        <div className="font-mono text-xl text-paper tabular-nums leading-none">
          {Math.round(speed)}
          <span className="text-sm text-mist ml-0.5">km/h</span>
        </div>
        <div className="text-[11px] tracking-[0.15em] uppercase text-mist font-display mt-1.5">
          Wind · {compassLabel}
        </div>
      </div>
    </div>
  );
}
