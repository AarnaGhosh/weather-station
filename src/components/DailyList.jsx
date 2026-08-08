import WeatherIcon from "./WeatherIcon";
import { describeCode, formatDay } from "../lib/weather";

export default function DailyList({ days }) {
  if (!days?.length) return null;
  const allLows = days.map((d) => d.low);
  const allHighs = days.map((d) => d.high);
  const globalMin = Math.min(...allLows);
  const globalMax = Math.max(...allHighs);
  const span = Math.max(1, globalMax - globalMin);

  return (
    <div>
      <h2 className="font-display text-sm tracking-[0.2em] uppercase text-mist mb-3">7-Day Log</h2>
      <div className="divide-y divide-hairline border-y border-hairline">
        {days.map((d, i) => {
          const leftPct = ((d.low - globalMin) / span) * 100;
          const widthPct = ((d.high - d.low) / span) * 100;
          return (
            <div key={i} className="grid grid-cols-[2.5rem_1.5rem_1fr_auto] sm:grid-cols-[3rem_1.75rem_1fr_5.5rem] items-center gap-3 sm:gap-4 py-3">
              <span className="font-display text-sm text-paper">{i === 0 ? "Today" : formatDay(d.date)}</span>
              <WeatherIcon icon={describeCode(d.code).icon} className="w-4.5 h-4.5 text-teal" />
              <div className="relative h-1.5 rounded-full bg-hairline">
                <div
                  className="absolute h-1.5 rounded-full bg-gradient-to-r from-teal to-brass-bright"
                  style={{ left: `${leftPct}%`, width: `${Math.max(6, widthPct)}%` }}
                />
              </div>
              <div className="font-mono text-sm text-right tabular-nums">
                <span className="text-mist">{d.low}°</span>
                <span className="text-paper ml-2">{d.high}°</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
