import { getPriceBucket } from '../lib/buildings';

const markerToneByPrice = {
  'Under $3k': 'bg-white text-pine border-white/80',
  '$3k-$4k': 'bg-sage text-pine border-sage',
  '$4k+': 'bg-pine text-white border-pine',
  Unknown: 'bg-[rgba(245,241,232,0.95)] text-[var(--text-main)] border-[rgba(35,66,50,0.16)]',
};

function Marker({ building, isSelected, isFavorite, onClick }) {
  const tone = markerToneByPrice[getPriceBucket(building.price)];

  return (
    <button
      type="button"
      className={`group relative -translate-y-2 rounded-full border px-3 py-2 text-sm font-semibold shadow-lg transition hover:-translate-y-3 ${
        isSelected ? 'scale-110 ring-4 ring-white/65' : ''
      } ${tone}`}
      onClick={onClick}
    >
      <span className="flex items-center gap-2">
        {isFavorite ? <span className="text-xs">★</span> : null}
        <span>{building.name}</span>
      </span>
      <span className="absolute left-1/2 top-full h-3 w-3 -translate-x-1/2 -translate-y-1.5 rotate-45 border-b border-r bg-inherit" />
    </button>
  );
}

export default Marker;
