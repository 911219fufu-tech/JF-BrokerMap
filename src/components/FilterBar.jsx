function FilterGroup({ label, options, selectedOptions, onToggle }) {
  return (
    <div className="space-y-3">
      <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = selectedOptions.includes(option);

          return (
            <button
              key={option}
              type="button"
              className={`rounded-full border px-3 py-2 text-sm font-medium transition ${
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

function FilterBar({
  areaOptions,
  priceOptions,
  typeOptions,
  selectedAreas,
  selectedPrices,
  selectedTypes,
  onAreaToggle,
  onPriceToggle,
  onTypeToggle,
  onClear,
}) {
  return (
    <div className="mt-4 grid gap-4 border-t border-[var(--line)] pt-4 xl:grid-cols-[1.35fr_1fr_1fr_auto] xl:items-end">
      <FilterGroup
        label="Area"
        options={areaOptions}
        selectedOptions={selectedAreas}
        onToggle={onAreaToggle}
      />

      <FilterGroup
        label="Price"
        options={priceOptions}
        selectedOptions={selectedPrices}
        onToggle={onPriceToggle}
      />

      <FilterGroup
        label="Apartment Type"
        options={typeOptions}
        selectedOptions={selectedTypes}
        onToggle={onTypeToggle}
      />

      <button
        type="button"
        className="h-fit rounded-full border border-[var(--line)] bg-white/70 px-4 py-2.5 text-sm font-medium text-[var(--text-main)] transition hover:border-[var(--line-strong)] hover:bg-white"
        onClick={onClear}
      >
        Reset
      </button>
    </div>
  );
}

export default FilterBar;
