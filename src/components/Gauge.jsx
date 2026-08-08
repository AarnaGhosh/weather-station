import { useEffect, useState } from "react";

// Signature element: a barometer-style circular gauge.
// The needle sweeps from a resting position up to the reading on mount.
export default function Gauge({ value, min = -20, max = 45, unit = "°", label }) {
  const [animatedValue, setAnimatedValue] = useState(min);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setAnimatedValue(value));
    return () => cancelAnimationFrame(raf);
  }, [value]);

  const clamped = Math.min(max, Math.max(min, animatedValue));
  const fraction = (clamped - min) / (max - min);
  // Dial sweeps 240deg, starting at -210deg (7 o'clock) to +30deg (5 o'clock)
  const startAngle = -210;
  const sweep = 240;
  const angle = startAngle + fraction * sweep;

  const ticks = [];
  const tickCount = 12;
  for (let i = 0; i <= tickCount; i++) {
    const a = startAngle + (i / tickCount) * sweep;
    const rad = (a * Math.PI) / 180;
    const isMajor = i % 3 === 0;
    const rOuter = 92;
    const rInner = isMajor ? 80 : 85;
    const x1 = 100 + rOuter * Math.cos(rad);
    const y1 = 100 + rOuter * Math.sin(rad);
    const x2 = 100 + rInner * Math.cos(rad);
    const y2 = 100 + rInner * Math.sin(rad);
    ticks.push(
      <line
        key={i}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={isMajor ? "#101b24" : "#101b24"}
        strokeOpacity={isMajor ? 0.55 : 0.25}
        strokeWidth={isMajor ? 2 : 1}
        strokeLinecap="round"
      />
    );
  }

  return (
    <div
      className="relative w-full max-w-[280px] aspect-square mx-auto"
      role="img"
      aria-label={`${label ? label + ", " : ""}${Math.round(value)} degrees${unit === "°" ? "" : unit}`}
    >
      <svg viewBox="0 0 200 200" aria-hidden="true" className="w-full h-full drop-shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
        <circle cx="100" cy="100" r="98" fill="#16232e" stroke="#2b4152" strokeWidth="1" />
        <circle cx="100" cy="100" r="90" className="paper-face" stroke="#c8bda3" strokeWidth="1" />
        {ticks}
        {/* min / max labels */}
        <text x="34" y="150" fontSize="7" fill="#4a4038" fontFamily="IBM Plex Mono, monospace">{min}°</text>
        <text x="148" y="150" fontSize="7" fill="#4a4038" fontFamily="IBM Plex Mono, monospace">{max}°</text>

        {/* needle */}
        <g style={{ transform: `rotate(${angle}deg)`, transformOrigin: "100px 100px", transition: "transform 1.1s cubic-bezier(0.22, 1, 0.36, 1)" }}>
          <line x1="100" y1="100" x2="100" y2="34" stroke="#c89b3c" strokeWidth="3" strokeLinecap="round" />
          <line x1="100" y1="100" x2="100" y2="115" stroke="#c89b3c" strokeWidth="3" strokeLinecap="round" />
        </g>
        <circle cx="100" cy="100" r="6" fill="#e0b559" stroke="#101b24" strokeWidth="1.5" />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center pt-6 pointer-events-none">
        <span className="font-mono text-5xl sm:text-6xl font-medium text-paper tabular-nums">
          {Math.round(value)}
          <span className="text-2xl align-top text-brass-bright">{unit}</span>
        </span>
        {label && <span className="mt-1 text-xs tracking-[0.2em] uppercase text-mist font-display">{label}</span>}
      </div>
    </div>
  );
}
