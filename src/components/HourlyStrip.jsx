import WeatherIcon from "./WeatherIcon";
import { describeCode, formatHour } from "../lib/weather";

export default function HourlyStrip({ hours }) {
  if (!hours?.length) return null;
  const temps = hours.map((h) => h.temp);
  const min = Math.min(...temps);
  const max = Math.max(...temps);
  const range = Math.max(1, max - min);

  return (
    <div>
      <div className="flex items-baseline justify-between mb-3">
        <h2 className="font-display text-sm tracking-[0.2em] uppercase text-mist">Next 24 Hours</h2>
        <span className="text-[11px] text-mist font-mono">{min}° – {max}°</span>
      </div>
      <div className="log-strip flex gap-4 overflow-x-auto pb-3 -mx-1 px-1">
        {hours.map((h, i) => {
          const heightPct = 18 + ((h.temp - min) / range) * 60;
          return (
            <div key={i} className="flex flex-col items-center gap-2 shrink-0 w-14">
              <span className="text-[11px] font-mono text-mist">{i === 0 ? "Now" : formatHour(h.time)}</span>
              <WeatherIcon icon={describeCode(h.code).icon} className="w-5 h-5 text-teal" isDay={h.isDay} />
              <div className="h-16 flex items-end">
                <div
                  className="w-1.5 rounded-full bg-gradient-to-t from-brass/40 to-brass-bright"
                  style={{ height: `${heightPct}%` }}
                />
              </div>
              <span className="font-mono text-sm text-paper tabular-nums">{h.temp}°</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
