import { useEffect, useRef, useState } from "react";
import { searchPlaces } from "../lib/weather";

export default function SearchBar({ onSelect, onUseLocation, locating }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    const t = setTimeout(() => {
      searchPlaces(query)
        .then((r) => {
          setResults(r);
          setOpen(true);
        })
        .catch(() => setResults([]))
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    function handleClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full sm:w-80">
      <div className="flex items-center gap-2 bg-panel-raised border border-hairline rounded-lg px-3 py-2.5 focus-within:border-brass transition-colors">
        <svg viewBox="0 0 24 24" className="w-4 h-4 text-mist shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length && setOpen(true)}
          placeholder="Search a place…"
          className="bg-transparent outline-none text-sm text-paper placeholder:text-mist/70 w-full font-body"
          aria-label="Search for a place"
        />
        <button
          onClick={onUseLocation}
          title="Use current location"
          aria-label="Use current location"
          className="text-mist hover:text-brass-bright transition-colors shrink-0"
        >
          {locating ? (
            <svg viewBox="0 0 24 24" className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 3a9 9 0 1 0 9 9" strokeLinecap="round" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="12" r="3" />
              <line x1="12" y1="2" x2="12" y2="5" />
              <line x1="12" y1="19" x2="12" y2="22" />
              <line x1="2" y1="12" x2="5" y2="12" />
              <line x1="19" y1="12" x2="22" y2="12" />
            </svg>
          )}
        </button>
      </div>

      {open && (loading || results.length > 0) && (
        <div className="absolute z-20 mt-1.5 w-full bg-panel-raised border border-hairline rounded-lg overflow-hidden shadow-xl">
          {loading && <div className="px-3 py-2.5 text-xs text-mist font-mono">Searching…</div>}
          {!loading &&
            results.map((r) => (
              <button
                key={r.id}
                onClick={() => {
                  onSelect(r);
                  setQuery(`${r.name}`);
                  setOpen(false);
                }}
                className="w-full text-left px-3 py-2.5 text-sm text-paper hover:bg-hairline/50 transition-colors border-b border-hairline last:border-0"
              >
                <span className="font-medium">{r.name}</span>
                <span className="text-mist ml-1.5 text-xs">
                  {[r.admin1, r.country].filter(Boolean).join(", ")}
                </span>
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
