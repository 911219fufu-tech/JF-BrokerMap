import { memo } from 'react';
import { getPriceBucket } from '../lib/buildings';

const markerToneByPrice = {
  'Under $3k': 'bg-white text-pine border-white/80',
  '$3k-$4k': 'bg-sage text-pine border-sage',
  '$4k+': 'bg-pine text-white border-pine',
  Unknown: 'bg-[rgba(245,241,232,0.95)] text-[var(--text-main)] border-[rgba(35,66,50,0.16)]',
};

function Marker({ building, isSelected, isFavorite, showLabel, onClick }) {
  const tone = markerToneByPrice[getPriceBucket(building.price)];
  const label = building.mapLabel || building.name;

  if (!showLabel) {
    return (
      <button
        type="button"
        className={`relative flex h-4 w-4 items-center justify-center rounded-full border-2 shadow-md transition hover:scale-110 ${
          isSelected ? 'scale-125 ring-4 ring-white/70' : ''
        } ${tone}`}
        onClick={onClick}
        aria-label={building.name}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
        {isFavorite ? (
          <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-pine text-[9px] leading-none text-white">
            ★
          </span>
        ) : null}
      </button>
    );
  }

  return (
    <button
      type="button"
      className={`group relative -translate-y-2 rounded-full border px-2.5 py-1.5 text-xs font-semibold shadow-lg transition hover:-translate-y-3 ${
        isSelected ? 'scale-110 ring-4 ring-white/65' : ''
      } ${tone}`}
      onClick={onClick}
      aria-label={building.name}
    >
      <span className="flex items-center gap-2">
        {isFavorite ? <span className="text-[10px]">★</span> : null}
        <span>{label}</span>
      </span>
      <span className="absolute left-1/2 top-full h-3 w-3 -translate-x-1/2 -translate-y-1.5 rotate-45 border-b border-r bg-inherit" />
    </button>
  );
}

export default memo(Marker);
