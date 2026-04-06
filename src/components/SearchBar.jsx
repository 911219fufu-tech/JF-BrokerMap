function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 5 5" />
    </svg>
  );
}

function SearchBar({ value, onChange, resultCount }) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-muted)]">Search Buildings</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[var(--text-main)]">
            Fast lookup for buildings and areas
          </h1>
        </div>
        <p className="text-sm text-[var(--text-muted)]">{resultCount} matches</p>
      </div>

      <label className="flex items-center gap-3 rounded-[24px] border border-[var(--line)] bg-white/85 px-4 py-3 shadow-sm transition focus-within:border-[var(--line-strong)] focus-within:bg-white">
        <div className="text-[var(--text-muted)]">
          <SearchIcon />
        </div>
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Search by building or area"
          className="w-full border-0 bg-transparent text-base text-[var(--text-main)] outline-none placeholder:text-[var(--text-muted)]"
        />
      </label>
    </div>
  );
}

export default SearchBar;
