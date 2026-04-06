import { formatPrice } from '../lib/buildings';

function StarIcon({ active }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill={active ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <path d="m12 3.6 2.6 5.28 5.82.85-4.21 4.11.99 5.8L12 16.9l-5.2 2.74.99-5.8L3.58 9.73l5.82-.85L12 3.6Z" />
    </svg>
  );
}

function BuildingCard({
  building,
  isSelected,
  isFavorite,
  onSelect,
  onToggleFavorite,
  onOpenWebsite,
}) {
  return (
    <article
      className={`rounded-[28px] border p-4 transition ${
        isSelected
          ? 'border-pine bg-[rgba(220,227,210,0.72)] shadow-sm'
          : 'border-[var(--line)] bg-white/80 hover:-translate-y-0.5 hover:border-[var(--line-strong)] hover:bg-white'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <button type="button" className="flex-1 text-left" onClick={onSelect}>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold tracking-tight">{building.name}</h3>
            <span className="rounded-full bg-[var(--bg-soft)] px-2.5 py-1 text-xs font-medium uppercase tracking-[0.18em] text-[var(--text-muted)]">
              {building.area}
            </span>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <p className="text-sm text-[var(--text-muted)]">{formatPrice(building.price)}</p>
            {building.op ? (
              <span className="rounded-full bg-[rgba(35,66,50,0.08)] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-pine">
                {building.op}
              </span>
            ) : null}
          </div>
        </button>

        <button
          type="button"
          className={`rounded-full border p-2 transition ${
            isFavorite
              ? 'border-pine bg-pine text-white'
              : 'border-[var(--line)] bg-white text-[var(--text-muted)] hover:border-[var(--line-strong)] hover:text-pine'
          }`}
          onClick={onToggleFavorite}
          aria-label="Toggle favorite"
        >
          <StarIcon active={isFavorite} />
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {building.type.length > 0 ? (
          building.type.map((type) => (
            <span
              key={type}
              className="rounded-full border border-[var(--line)] bg-[var(--bg-soft)] px-3 py-1 text-xs font-medium text-[var(--text-muted)]"
            >
              {type}
            </span>
          ))
        ) : (
          <span className="rounded-full border border-dashed border-[var(--line)] bg-[var(--bg-soft)] px-3 py-1 text-xs font-medium text-[var(--text-muted)]">
            Type info pending
          </span>
        )}
        {building.flags?.map((flag) => (
          <span
            key={flag}
            className="rounded-full border border-[rgba(35,66,50,0.08)] bg-[rgba(220,227,210,0.72)] px-3 py-1 text-xs font-medium text-pine"
          >
            {flag}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <button
          type="button"
          className="rounded-full bg-pine px-4 py-2 text-sm font-medium text-white transition hover:bg-moss"
          onClick={onSelect}
        >
          View Details
        </button>
        <button
          type="button"
          className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
            building.website
              ? 'border-[var(--line)] bg-white text-[var(--text-main)] hover:border-[var(--line-strong)]'
              : 'cursor-not-allowed border-[var(--line)] bg-[var(--bg-soft)] text-[var(--text-muted)]'
          }`}
          onClick={onOpenWebsite}
          disabled={!building.website}
        >
          {building.website ? 'Official Site' : 'No Website Yet'}
        </button>
      </div>
    </article>
  );
}

export default BuildingCard;
