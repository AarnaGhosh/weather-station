// Minimal line-icon set drawn to match the instrument-panel aesthetic.
export default function WeatherIcon({ icon, className = "w-6 h-6", isDay = true }) {
  const stroke = "currentColor";
  const common = { fill: "none", stroke, strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" };

  switch (icon) {
    case "sun":
      return (
        <svg viewBox="0 0 24 24" className={className} {...common}>
          {isDay ? (
            <>
              <circle cx="12" cy="12" r="4.5" />
              {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
                const rad = (a * Math.PI) / 180;
                const x1 = 12 + 8 * Math.cos(rad);
                const y1 = 12 + 8 * Math.sin(rad);
                const x2 = 12 + 10.5 * Math.cos(rad);
                const y2 = 12 + 10.5 * Math.sin(rad);
                return <line key={a} x1={x1} y1={y1} x2={x2} y2={y2} />;
              })}
            </>
          ) : (
            <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" />
          )}
        </svg>
      );
    case "sun-cloud":
      return (
        <svg viewBox="0 0 24 24" className={className} {...common}>
          <circle cx="9" cy="9" r="3.5" />
          <path d="M5 18a4 4 0 0 1 .3-8 5 5 0 0 1 9.6.6A3.5 3.5 0 0 1 14.5 18Z" />
        </svg>
      );
    case "cloud":
      return (
        <svg viewBox="0 0 24 24" className={className} {...common}>
          <path d="M6.5 18a4 4 0 0 1 .3-8 5.5 5.5 0 0 1 10.7 1.2A3.7 3.7 0 0 1 17 18Z" />
        </svg>
      );
    case "fog":
      return (
        <svg viewBox="0 0 24 24" className={className} {...common}>
          <path d="M6 9a4 4 0 0 1 7.8-1.2A3.5 3.5 0 0 1 18 11" />
          <line x1="4" y1="15" x2="20" y2="15" />
          <line x1="4" y1="18.5" x2="20" y2="18.5" />
        </svg>
      );
    case "drizzle":
      return (
        <svg viewBox="0 0 24 24" className={className} {...common}>
          <path d="M6.5 13a4 4 0 0 1 .3-8 5.5 5.5 0 0 1 10.7 1.2A3.7 3.7 0 0 1 17 13Z" />
          <line x1="8" y1="16" x2="7" y2="19" />
          <line x1="12" y1="16" x2="11" y2="19" />
          <line x1="16" y1="16" x2="15" y2="19" />
        </svg>
      );
    case "rain":
      return (
        <svg viewBox="0 0 24 24" className={className} {...common}>
          <path d="M6.5 12a4 4 0 0 1 .3-8 5.5 5.5 0 0 1 10.7 1.2A3.7 3.7 0 0 1 17 12Z" />
          <line x1="8" y1="15" x2="6.5" y2="19.5" />
          <line x1="12.5" y1="15" x2="11" y2="19.5" />
          <line x1="17" y1="15" x2="15.5" y2="19.5" />
        </svg>
      );
    case "snow":
      return (
        <svg viewBox="0 0 24 24" className={className} {...common}>
          <path d="M6.5 12a4 4 0 0 1 .3-8 5.5 5.5 0 0 1 10.7 1.2A3.7 3.7 0 0 1 17 12Z" />
          <g strokeWidth="1.4">
            <line x1="8" y1="15.5" x2="8" y2="19.5" />
            <line x1="6.3" y1="17.5" x2="9.7" y2="17.5" />
            <line x1="16" y1="15.5" x2="16" y2="19.5" />
            <line x1="14.3" y1="17.5" x2="17.7" y2="17.5" />
          </g>
        </svg>
      );
    case "storm":
      return (
        <svg viewBox="0 0 24 24" className={className} {...common}>
          <path d="M6.5 11a4 4 0 0 1 .3-8 5.5 5.5 0 0 1 10.7 1.2A3.7 3.7 0 0 1 17 11Z" />
          <polyline points="12,13 9.5,17.5 12.5,17.5 10.5,21" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" className={className} {...common}>
          <circle cx="12" cy="12" r="8" />
        </svg>
      );
  }
}
