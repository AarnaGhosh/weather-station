import { useEffect, useState } from "react";
import SearchBar from "./components/SearchBar";
import Gauge from "./components/Gauge";
import InstrumentCard from "./components/InstrumentCard";
import WindCompass from "./components/WindCompass";
import HourlyStrip from "./components/HourlyStrip";
import DailyList from "./components/DailyList";
import WeatherIcon from "./components/WeatherIcon";
import {
  fetchForecast,
  describeCode,
  windCompass,
  reverseFallbackName,
  formatClock,
} from "./lib/weather";

const DEFAULT_PLACE = {
  name: "New Delhi",
  admin1: "Delhi",
  country: "India",
  latitude: 28.6139,
  longitude: 77.209,
  timezone: "Asia/Kolkata",
};

export default function App() {
  const [place, setPlace] = useState(DEFAULT_PLACE);
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [errorMsg, setErrorMsg] = useState("");
  const [locating, setLocating] = useState(false);
  const [locationNotice, setLocationNotice] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    fetchForecast(place.latitude, place.longitude)
      .then((res) => {
        if (cancelled) return;
        setData(res);
        setStatus("ready");
      })
      .catch((err) => {
        if (cancelled) return;
        setErrorMsg(err.message || "Something went wrong reading the instruments.");
        setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [place]);

  function handleUseLocation() {
    if (!navigator.geolocation) {
      setErrorMsg("This browser can't share your location.");
      setStatus("error");
      return;
    }
    setLocating(true);
    setLocationNotice(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const name = await reverseFallbackName(latitude, longitude);
        setPlace({ name, admin1: "", country: "", latitude, longitude });
        setLocating(false);
      },
      (err) => {
        // Keep whatever is already on screen — don't blow the whole
        // dashboard away for a location permission issue. Give a message
        // specific enough that the person knows what to do next.
        if (err.code === err.PERMISSION_DENIED) {
          setLocationNotice(
            "Location access was denied. You can still search for a city using the box above."
          );
        } else if (err.code === err.TIMEOUT) {
          setLocationNotice("Location request timed out. Try again, or search for a city instead.");
        } else {
          setLocationNotice("Couldn't determine your location. Try searching for a city instead.");
        }
        setLocating(false);
      },
      { timeout: 8000 }
    );
  }

  const current = data?.current;
  const daily = data?.daily;
  const hourly = data?.hourly;

  const condition = current ? describeCode(current.weather_code) : null;

  let hours = [];
  if (hourly?.time) {
    const now = new Date();
    const startIdx = hourly.time.findIndex((t) => new Date(t) >= now);
    const from = Math.max(0, startIdx);
    for (let i = from; i < Math.min(from + 24, hourly.time.length); i++) {
      hours.push({
        time: hourly.time[i],
        temp: Math.round(hourly.temperature_2m[i]),
        code: hourly.weather_code[i],
        pop: hourly.precipitation_probability[i],
        isDay: hourly.is_day[i] === 1,
      });
    }
  }

  let days = [];
  if (daily?.time) {
    days = daily.time.map((t, i) => ({
      date: t,
      code: daily.weather_code[i],
      high: Math.round(daily.temperature_2m_max[i]),
      low: Math.round(daily.temperature_2m_min[i]),
      sunrise: daily.sunrise[i],
      sunset: daily.sunset[i],
      uv: daily.uv_index_max[i],
      pop: daily.precipitation_probability_max[i],
    }));
  }

  const todayHigh = days[0]?.high;
  const todayLow = days[0]?.low;

  return (
    <div className="min-h-screen text-paper pb-16">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 pt-8 sm:pt-12">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-brass-bright mb-1">
              Station Log · No. 7
            </p>
            <h1 className="font-display text-2xl sm:text-3xl font-semibold text-paper">
              Observed Conditions
            </h1>
          </div>
          <SearchBar onSelect={setPlace} onUseLocation={handleUseLocation} locating={locating} />
        </header>

        {locationNotice && (
          <div
            role="status"
            className="flex items-start justify-between gap-3 bg-panel-raised border border-coral/40 rounded-lg px-4 py-3 mb-8 text-sm text-paper"
          >
            <span>{locationNotice}</span>
            <button
              onClick={() => setLocationNotice(null)}
              aria-label="Dismiss"
              className="text-mist hover:text-paper shrink-0 leading-none text-base"
            >
              ×
            </button>
          </div>
        )}

        {status === "loading" && (
          <div className="py-24 text-center">
            <div className="inline-block w-8 h-8 border-2 border-hairline border-t-brass rounded-full animate-spin" />
            <p className="mt-4 text-sm text-mist font-mono">Calibrating instruments…</p>
          </div>
        )}

        {status === "error" && (
          <div className="py-24 text-center max-w-sm mx-auto">
            <p className="font-display text-lg text-coral mb-2">The station lost signal.</p>
            <p className="text-sm text-mist">{errorMsg}</p>
            <button
              onClick={() => setPlace({ ...place })}
              className="mt-5 px-4 py-2 rounded-lg bg-panel-raised border border-hairline text-sm hover:border-brass transition-colors"
            >
              Try again
            </button>
          </div>
        )}

        {status === "ready" && current && (
          <>
            {/* Hero */}
            <section className="bg-panel border border-hairline rounded-2xl p-6 sm:p-10 mb-8">
              <div className="grid sm:grid-cols-[auto_1fr] gap-8 sm:gap-12 items-center">
                <Gauge value={current.temperature_2m} label={condition.label} />
                <div className="text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                    <WeatherIcon icon={condition.icon} className="w-6 h-6 text-brass-bright" isDay={current.is_day} />
                    <h2 className="font-display text-xl text-paper">{condition.label}</h2>
                  </div>
                  <p className="text-3xl sm:text-4xl font-display font-semibold text-paper mb-1">
                    {place.name}
                  </p>
                  <p className="text-sm text-mist mb-4">
                    {[place.admin1, place.country].filter(Boolean).join(", ") || "Custom coordinates"}
                  </p>
                  <div className="flex flex-wrap justify-center sm:justify-start gap-x-5 gap-y-1.5 text-sm font-mono text-mist">
                    <span>Feels {Math.round(current.apparent_temperature)}°</span>
                    <span className="text-hairline">·</span>
                    <span>H {todayHigh}° L {todayLow}°</span>
                    <span className="text-hairline">·</span>
                    <span>Read at {formatClock(current.time)}</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Instrument row */}
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              <WindCompass
                speed={current.wind_speed_10m}
                direction={current.wind_direction_10m}
                compassLabel={windCompass(current.wind_direction_10m)}
              />
              <InstrumentCard
                label="Humidity"
                value={current.relative_humidity_2m}
                unit="%"
                min={0}
                max={100}
                accent="var(--color-teal)"
              />
              <InstrumentCard
                label="Pressure"
                value={Math.round(current.surface_pressure)}
                unit="hPa"
                min={970}
                max={1050}
                accent="var(--color-brass-bright)"
              />
              <InstrumentCard
                label="UV Index"
                value={days[0]?.uv ?? 0}
                unit=""
                min={0}
                max={11}
                accent="var(--color-coral)"
              />
            </section>

            {/* Hourly */}
            <section className="mb-10">
              <HourlyStrip hours={hours} />
            </section>

            {/* Daily */}
            <section>
              <DailyList days={days} />
            </section>
          </>
        )}
      </div>

      <footer className="max-w-5xl mx-auto px-5 sm:px-8 mt-16">
        <p className="text-[11px] text-mist/70 font-mono text-center">
          Data via Open-Meteo · Built with React, Tailwind & AI assistance
        </p>
      </footer>
    </div>
  );
}
