// Open-Meteo — free, no API key required.
const GEOCODE_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

export async function searchPlaces(query) {
  if (!query || query.trim().length < 2) return [];
  const url = `${GEOCODE_URL}?name=${encodeURIComponent(query)}&count=6&language=en&format=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Could not reach the location index.");
  const data = await res.json();
  return (data.results || []).map((r) => ({
    id: `${r.id}`,
    name: r.name,
    admin1: r.admin1,
    country: r.country,
    countryCode: r.country_code,
    latitude: r.latitude,
    longitude: r.longitude,
    timezone: r.timezone,
  }));
}

export async function reverseFallbackName(lat, lon) {
  // Open-Meteo has no reverse endpoint; label by coordinates.
  const latLabel = `${Math.abs(lat).toFixed(2)}°${lat >= 0 ? "N" : "S"}`;
  const lonLabel = `${Math.abs(lon).toFixed(2)}°${lon >= 0 ? "E" : "W"}`;
  return `${latLabel}, ${lonLabel}`;
}

export async function fetchForecast(lat, lon) {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    current: [
      "temperature_2m",
      "apparent_temperature",
      "relative_humidity_2m",
      "weather_code",
      "wind_speed_10m",
      "wind_direction_10m",
      "surface_pressure",
      "is_day",
    ].join(","),
    hourly: ["temperature_2m", "weather_code", "precipitation_probability", "is_day"].join(","),
    daily: [
      "weather_code",
      "temperature_2m_max",
      "temperature_2m_min",
      "sunrise",
      "sunset",
      "uv_index_max",
      "precipitation_probability_max",
    ].join(","),
    timezone: "auto",
    forecast_days: "7",
    wind_speed_unit: "kmh",
  });
  const res = await fetch(`${FORECAST_URL}?${params.toString()}`);
  if (!res.ok) throw new Error("The forecast service did not respond.");
  return res.json();
}

// WMO weather codes -> label + simple icon key + visibility estimate class
export const WEATHER_CODES = {
  0: { label: "Clear sky", icon: "sun" },
  1: { label: "Mostly clear", icon: "sun-cloud" },
  2: { label: "Partly cloudy", icon: "sun-cloud" },
  3: { label: "Overcast", icon: "cloud" },
  45: { label: "Fog", icon: "fog" },
  48: { label: "Rime fog", icon: "fog" },
  51: { label: "Light drizzle", icon: "drizzle" },
  53: { label: "Drizzle", icon: "drizzle" },
  55: { label: "Dense drizzle", icon: "drizzle" },
  56: { label: "Freezing drizzle", icon: "drizzle" },
  57: { label: "Freezing drizzle", icon: "drizzle" },
  61: { label: "Light rain", icon: "rain" },
  63: { label: "Rain", icon: "rain" },
  65: { label: "Heavy rain", icon: "rain" },
  66: { label: "Freezing rain", icon: "rain" },
  67: { label: "Freezing rain", icon: "rain" },
  71: { label: "Light snow", icon: "snow" },
  73: { label: "Snow", icon: "snow" },
  75: { label: "Heavy snow", icon: "snow" },
  77: { label: "Snow grains", icon: "snow" },
  80: { label: "Light showers", icon: "rain" },
  81: { label: "Showers", icon: "rain" },
  82: { label: "Violent showers", icon: "rain" },
  85: { label: "Snow showers", icon: "snow" },
  86: { label: "Snow showers", icon: "snow" },
  95: { label: "Thunderstorm", icon: "storm" },
  96: { label: "Thunderstorm, hail", icon: "storm" },
  99: { label: "Thunderstorm, hail", icon: "storm" },
};

export function describeCode(code) {
  return WEATHER_CODES[code] || { label: "Unknown", icon: "cloud" };
}

export function windCompass(deg) {
  const dirs = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  return dirs[Math.round(deg / 22.5) % 16];
}

export function formatHour(iso, timezone) {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-US", { hour: "numeric", hour12: true });
}

export function formatDay(iso) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { weekday: "short" });
}

export function formatClock(iso) {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}
