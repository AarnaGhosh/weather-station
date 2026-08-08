# Station Log — A Weather Dashboard

A single-page React weather dashboard styled as a meteorological field station:
an animated barometer-style gauge for the current reading, small instrument
cards for humidity / wind / pressure / UV, an hourly log strip, and a 7-day
forecast. Built with **React + Vite + Tailwind CSS v4**, data from the free
[Open-Meteo](https://open-meteo.com) API (no API key needed).

## Run it locally

```bash
npm install
npm run dev
```

Then open the printed local URL. `npm run build` produces a production build
in `dist/`.

## Features

- Search any city (Open-Meteo geocoding) or use your current location
- Animated circular gauge for current temperature, styled like an analog dial
- Instrument cards: wind (compass rose), humidity, pressure, UV index
- 24-hour scrollable forecast strip with a temperature sparkline
- 7-day forecast with a high/low range bar per day
- Loading and error states; keyboard-focus visible; respects
  `prefers-reduced-motion`

## Assignment context

This was built for the "React app development with AI" assignment —
independently building a React app using AI as a development assistant. Below
is the documentation the assignment asks for.

### Prompts used during development

These are (paraphrased) the prompts used, in order, working with Claude:

1. *"Help me build a weather dashboard for a Week 3 React assignment. Use
   React + Tailwind."*
2. Claude asked what kind of app and what stack — answered **weather
   dashboard** / **React + Tailwind**.
3. Follow-up direction given during the build: use a free weather API that
   doesn't need an API key (led to Open-Meteo), and make the visual design
   distinctive rather than a generic dashboard template — an "instrument
   panel" feel (gauges, dials, mono numerals) instead of plain stat cards.
4. Implicit prompts through iteration: reviewing the generated component
   structure (`Gauge`, `InstrumentCard`, `WindCompass`, `HourlyStrip`,
   `DailyList`, `SearchBar`) and confirming the build compiled cleanly.

### How AI assisted

- **Scaffolding**: generated the Vite + React project, wired up Tailwind CSS
  v4 (via `@tailwindcss/vite`, no `tailwind.config.js` needed in v4) and
  Google Fonts.
- **API integration**: wrote the Open-Meteo fetch/geocoding helpers
  (`src/lib/weather.js`), including the WMO weather-code-to-label mapping and
  unit/timezone handling.
- **Component design**: authored the custom SVG gauge and instrument-dial
  components from scratch (no charting library) — the barometer needle sweep,
  the half-circle instrument dials, and the compass rose are all hand-built
  SVG + React, not a template.
- **Design system**: proposed a cohesive palette/typography system (deep
  slate + brass + teal, Space Grotesk / IBM Plex Mono / Inter) deliberately
  avoiding generic "AI dashboard" defaults (cream + terracotta, or black +
  neon).
- **Verification**: ran `npm run build` after each significant change to
  catch compile errors (e.g. confirmed Tailwind's dynamic spacing utilities
  like `w-4.5` compiled correctly, confirmed custom color tokens generated
  the expected utility classes) before finishing.

### Manual improvements made after reviewing the AI-generated code

The first AI-generated draft built and ran, but a manual review turned up
real issues. Three were fixed and are documented below in
**AI version → What I changed → Why → Result** form.

---

**1. Geolocation permission denial destroyed the whole dashboard**

- **AI version**: `handleUseLocation` in `App.jsx` caught any geolocation
  error (denied permission, timeout, unavailable — all three) with a single
  generic handler that set `status` to `"error"` and showed `"Location
  request was denied."` This replaced the *entire* dashboard — including
  whatever city's weather was already loaded and visible — with a full-page
  error screen and a "Try again" button.
- **What I changed**: Split the geolocation error callback on `err.code`
  (`PERMISSION_DENIED`, `TIMEOUT`, or other) to show a specific,
  dismissible inline banner (`locationNotice` state) instead of touching
  page-level `status`. The existing weather data for whatever place was
  already shown stays on screen; only a small banner appears above it.
- **Why**: A permission denial isn't the same failure as "the API is down" —
  the app still has perfectly good data to show. Wiping the whole dashboard
  for a location-permission issue was a false equivalence, and the original
  message didn't tell the user what to do next.
- **Result**: Denying location access now shows: *"Location access was
  denied. You can still search for a city using the box above."* The
  dashboard underneath stays intact, and the user has a clear next action
  instead of hitting a dead end.

**2. Hourly forecast icons showed the sun even at night**

- **AI version**: `HourlyStrip` was built passing `isDay: true` hardcoded
  for every single hour in the 24-hour strip, so the icon logic that's
  supposed to distinguish sun vs. moon (`WeatherIcon`'s `isDay` prop) never
  actually saw a `false` value — every hour got a sun icon regardless of
  actual time of day.
- **What I changed**: Added `is_day` to the `hourly` variables requested
  from the Open-Meteo API (`src/lib/weather.js`), then read the real
  per-hour value (`hourly.is_day[i] === 1`) when building the hours array in
  `App.jsx`, instead of the hardcoded `true`.
- **Why**: The icon component already had day/night logic built in — it was
  just never fed real data, which is an easy thing to miss when skimming
  AI-generated code that "looks" complete because it compiles and renders.
- **Result**: The hourly strip now correctly shows a moon icon for night
  hours and a sun icon for day hours, matching each location's actual
  sunrise/sunset rather than defaulting to day for the full 24 hours.

**3. Label text failed WCAG AA contrast; gauge reading was invisible to screen readers**

- **AI version**: The `--color-mist` token (`#7c93a3`) was used for all card
  labels (e.g. "Humidity," "Wind," "Pressure") on the `panel-raised`
  background. I ran the actual contrast numbers (WCAG relative luminance
  formula) instead of eyeballing it: `#7c93a3` on `#1d2f3d` comes out to
  **4.29:1** — just under the 4.5:1 minimum for normal text. Separately, the
  temperature gauge's reading (`Gauge.jsx`) was only ever exposed as visual
  SVG `<text>` and an absolutely-positioned `<div>` overlay — a screen
  reader has no reason to announce either as "the current temperature."
- **What I changed**: Brightened `--color-mist` to `#8fa3b3`, which measures
  **5.28:1** against the same background (comfortably above AA). Added
  `role="img"` and a computed `aria-label` (e.g. `"Clear sky, 27 degrees"`)
  to the gauge's wrapper `div`, and marked the inner SVG `aria-hidden="true"`
  so screen readers read the one meaningful label instead of the raw SVG
  markup.
- **Why**: This wasn't a hunch — I measured it. An AI-authored palette can
  look fine to the eye while quietly failing accessibility minimums, and a
  gauge that's all `<svg>`/absolutely-positioned `<div>` is exactly the kind
  of thing that renders perfectly but says nothing to assistive tech.
- **Result**: Labels now pass WCAG AA contrast, and a screen reader
  announces something like *"Clear sky, 27 degrees"* for the main gauge
  instead of silence.

---

Other things I reviewed but left as-is (noted for transparency, not fixed):

- **Debounce timing** on `SearchBar.jsx` (300ms) — tested it live, felt
  responsive enough not to change.
- **Error boundaries / unit toggle (°F, mph)** — real gaps, but out of scope
  for this pass; noted here rather than silently left out.

## Tech stack

- React 19 + Vite
- Tailwind CSS v4 (`@tailwindcss/vite`)
- [Open-Meteo](https://open-meteo.com) forecast + geocoding APIs (free, no
  key required)
- Hand-built SVG for all gauges/icons — no charting or icon library
