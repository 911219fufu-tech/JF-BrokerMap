import { useEffect, useRef, useState } from 'react';

function FilterGroup({ label, options, selectedOptions, onToggle }) {
  return (
    <div className="space-y-3">
      <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">{label}</p>
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 xl:mx-0 xl:flex-wrap xl:overflow-visible xl:px-0">
        {options.map((option) => {
          const active =
            option === 'ALL' ? selectedOptions.length === 0 : selectedOptions.includes(option);

          return (
            <button
              key={option}
              type="button"
              className={`min-h-11 shrink-0 rounded-full border px-3 py-2 text-sm font-medium transition ${
                active
                  ? 'border-pine bg-pine text-white shadow-sm'
                  : 'border-[var(--line)] bg-white/70 text-[var(--text-muted)] hover:border-[var(--line-strong)] hover:bg-white'
              }`}
              onClick={() => onToggle(option)}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function formatCurrency(value) {
  return `$${value.toLocaleString()}`;
}

function AreaFilterDropdown({ options, selectedOptions, onToggle }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handlePointerDown = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  const summary =
    selectedOptions.length === 0
      ? 'All areas'
      : selectedOptions.length <= 2
        ? selectedOptions.join(', ')
        : `${selectedOptions.length} areas`;

  return (
    <div ref={containerRef} className="relative z-[70] space-y-2">
      <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">Area</p>

      <button
        type="button"
        className="flex h-[84px] w-full items-center justify-between gap-3 rounded-[24px] border border-[var(--line)] bg-white/70 px-4 py-3 text-left text-sm font-medium text-[var(--text-main)] transition hover:border-[var(--line-strong)] hover:bg-white"
        onClick={() => setOpen((currentValue) => !currentValue)}
      >
        <div className="min-w-0">
          <p className="truncate text-base font-semibold text-[var(--text-main)]">{summary}</p>
          <p className="mt-0.5 text-xs text-[var(--text-muted)]">
            {selectedOptions.length === 0 ? 'No filter applied' : `${selectedOptions.length} selected`}
          </p>
        </div>
        <span className={`shrink-0 text-lg text-[var(--text-muted)] transition ${open ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {open ? (
        <div className="absolute top-[calc(100%+0.5rem)] left-0 right-0 z-[80] rounded-[24px] border border-[var(--line)] bg-[rgba(250,248,242,0.99)] p-3 shadow-[0_24px_60px_rgba(29,36,31,0.18)] backdrop-blur-xl">
          <div className="flex max-h-64 flex-wrap gap-2 overflow-y-auto pr-1">
            {options.map((option) => {
              const active =
                option === 'ALL' ? selectedOptions.length === 0 : selectedOptions.includes(option);

              return (
                <button
                  key={option}
                  type="button"
                  className={`min-h-11 shrink-0 rounded-full border px-3 py-2 text-sm font-medium transition ${
                    active
                      ? 'border-pine bg-pine text-white shadow-sm'
                      : 'border-[var(--line)] bg-white/70 text-[var(--text-muted)] hover:border-[var(--line-strong)] hover:bg-white'
                  }`}
                  onClick={() => onToggle(option)}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function PriceRangeControl({ bounds, value, onChange }) {
  const step = 50;
  const range = Math.max(bounds.max - bounds.min, 1);
  const leftPercent = ((value.min - bounds.min) / range) * 100;
  const rightPercent = ((value.max - bounds.min) / range) * 100;
  const sliderClass =
    'pointer-events-none absolute top-1/2 h-10 w-full -translate-y-1/2 appearance-none bg-transparent [&::-webkit-slider-runnable-track]:h-2 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:mt-[-6px] [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-[3px] [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-pine [&::-webkit-slider-thumb]:shadow-[0_6px_14px_rgba(29,36,31,0.2)] [&::-moz-range-track]:h-2 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-transparent [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-[3px] [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-pine [&::-moz-range-thumb]:shadow-[0_6px_14px_rgba(29,36,31,0.2)]';

  return (
    <div className="space-y-2">
      <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">Price</p>

      <div className="flex h-[84px] flex-col justify-between rounded-[24px] border border-[var(--line)] bg-white/70 px-4 py-3">
        <div className="relative h-[36px]">
          <div className="absolute top-1/2 h-2 w-full -translate-y-1/2 rounded-full bg-[rgba(35,66,50,0.10)]" />
          <div
            className="absolute top-1/2 h-2 -translate-y-1/2 rounded-full bg-pine"
            style={{
              left: `${leftPercent}%`,
              width: `${Math.max(rightPercent - leftPercent, 0)}%`,
            }}
          />

          <input
            type="range"
            min={bounds.min}
            max={bounds.max}
            step={step}
            value={value.min}
            onChange={(event) =>
              onChange({
                min: Math.min(Number(event.target.value), value.max),
                max: value.max,
              })
            }
            className={sliderClass}
          />

          <input
            type="range"
            min={bounds.min}
            max={bounds.max}
            step={step}
            value={value.max}
            onChange={(event) =>
              onChange({
                min: value.min,
                max: Math.max(Number(event.target.value), value.min),
              })
            }
            className={sliderClass}
          />
        </div>

        <div className="mt-3 flex items-center justify-between text-sm font-medium text-[var(--text-muted)]">
          <span>{formatCurrency(value.min)}</span>
          <span>{formatCurrency(value.max)}</span>
        </div>
      </div>
    </div>
  );
}

function FilterBar({
  areaOptions,
  priceBounds,
  typeOptions,
  selectedAreas,
  selectedPriceRange,
  selectedTypes,
  onAreaToggle,
  onPriceChange,
  onTypeToggle,
  onClear,
}) {
  return (
    <div className="relative z-30 mt-4 grid gap-4 border-t border-[var(--line)] pt-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto] xl:items-start">
      <AreaFilterDropdown
        options={areaOptions}
        selectedOptions={selectedAreas}
        onToggle={onAreaToggle}
      />

      <PriceRangeControl
        bounds={priceBounds}
        value={selectedPriceRange}
        onChange={onPriceChange}
      />

      <FilterGroup
        label="Apartment Type"
        options={typeOptions}
        selectedOptions={selectedTypes}
        onToggle={onTypeToggle}
      />

      <button
        type="button"
        className="min-h-11 h-fit rounded-full border border-[var(--line)] bg-white/70 px-4 py-2.5 text-sm font-medium text-[var(--text-main)] transition hover:border-[var(--line-strong)] hover:bg-white xl:justify-self-end"
        onClick={onClear}
      >
        Reset
      </button>
    </div>
  );
}

export default FilterBar;
