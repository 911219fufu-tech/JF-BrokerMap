import { useEffect, useRef, useState } from 'react';
import BuildingCard from './BuildingCard';

const CARD_MIN_HEIGHT = 192;
const CARD_GAP = 12;
const VISIBLE_CARDS = 4;
const VIEWPORT_HEIGHT = CARD_MIN_HEIGHT * VISIBLE_CARDS + CARD_GAP * (VISIBLE_CARDS - 1);

function ArrowButton({ direction, onClick, disabled }) {
  const rotateClass = direction === 'up' ? '-rotate-90' : 'rotate-90';

  return (
    <button
      type="button"
      className={`flex h-10 w-10 items-center justify-center rounded-full border transition ${
        disabled
          ? 'cursor-not-allowed border-[var(--line)] bg-[var(--bg-soft)] text-[var(--text-muted)]'
          : 'border-[var(--line)] bg-white/80 text-[var(--text-main)] hover:border-[var(--line-strong)] hover:bg-white'
      }`}
      onClick={onClick}
      disabled={disabled}
      aria-label={`Scroll ${direction}`}
    >
      <svg
        viewBox="0 0 24 24"
        className={`h-4 w-4 ${rotateClass}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="m9 5 7 7-7 7" />
      </svg>
    </button>
  );
}

function BuildingList({
  buildings,
  selectedBuildingId,
  favoriteIds,
  onSelectBuilding,
  onToggleFavorite,
  onOpenWebsite,
}) {
  const listRef = useRef(null);
  const dragStateRef = useRef({
    isDragging: false,
    startY: 0,
    startScrollTop: 0,
    pointerId: null,
  });
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);

  useEffect(() => {
    const listNode = listRef.current;

    if (!listNode) {
      return;
    }

    const syncScroll = () => {
      setScrollPosition(listNode.scrollTop);
      setMaxScroll(Math.max(0, listNode.scrollHeight - listNode.clientHeight));
    };

    syncScroll();
    listNode.addEventListener('scroll', syncScroll, { passive: true });
    window.addEventListener('resize', syncScroll);

    return () => {
      listNode.removeEventListener('scroll', syncScroll);
      window.removeEventListener('resize', syncScroll);
    };
  }, [buildings.length]);

  useEffect(() => {
    if (!listRef.current || !selectedBuildingId) {
      return;
    }

    const selectedCard = listRef.current.querySelector(
      `[data-building-id="${selectedBuildingId}"]`,
    );

    if (!selectedCard) {
      return;
    }

    selectedCard.scrollIntoView({
      block: 'nearest',
      behavior: 'smooth',
    });
  }, [buildings, selectedBuildingId]);

  const scrollByStep = (direction) => {
    if (!listRef.current) {
      return;
    }

    listRef.current.scrollBy({
      top: direction * Math.max(180, listRef.current.clientHeight * 0.55),
      behavior: 'smooth',
    });
  };

  const handlePointerDown = (event) => {
    if (event.pointerType === 'mouse') {
      const interactiveTarget = event.target.closest('button, a, input, textarea');

      if (interactiveTarget) {
        return;
      }
    }

    const listNode = listRef.current;

    if (!listNode) {
      return;
    }

    dragStateRef.current = {
      isDragging: true,
      startY: event.clientY,
      startScrollTop: listNode.scrollTop,
      pointerId: event.pointerId,
    };

    listNode.setPointerCapture(event.pointerId);
    listNode.style.cursor = 'grabbing';
    listNode.style.userSelect = 'none';
  };

  const handlePointerMove = (event) => {
    const listNode = listRef.current;
    const dragState = dragStateRef.current;

    if (!listNode || !dragState.isDragging) {
      return;
    }

    const nextScrollTop = dragState.startScrollTop - (event.clientY - dragState.startY);
    listNode.scrollTop = nextScrollTop;
  };

  const endDrag = () => {
    const listNode = listRef.current;

    dragStateRef.current = {
      isDragging: false,
      startY: 0,
      startScrollTop: 0,
      pointerId: null,
    };

    if (!listNode) {
      return;
    }

    listNode.style.cursor = '';
    listNode.style.userSelect = '';
  };

  const canScrollUp = scrollPosition > 4;
  const canScrollDown = scrollPosition < maxScroll - 4;

  return (
    <section className="glass-panel flex min-h-0 flex-col rounded-[32px] p-4 sm:p-5 xl:min-h-[520px]">
      <div className="flex items-center justify-between gap-3 border-b border-[var(--line)] pb-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-muted)]">Portfolio View</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight">Buildings</h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="rounded-full border border-[var(--line)] bg-white/75 px-3 py-2 text-sm text-[var(--text-muted)]">
            {buildings.length} shown
          </div>
          <ArrowButton direction="up" onClick={() => scrollByStep(-1)} disabled={!canScrollUp} />
          <ArrowButton direction="down" onClick={() => scrollByStep(1)} disabled={!canScrollDown} />
        </div>
      </div>

      <div
        ref={listRef}
        className="soft-scrollbar mt-4 space-y-3 overflow-y-auto pr-1 [scrollbar-gutter:stable] [scroll-snap-type:y_proximity] [scroll-behavior:smooth] touch-pan-y"
        style={{ height: VIEWPORT_HEIGHT }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={endDrag}
        onKeyDown={(event) => {
          if (event.key === 'ArrowUp') {
            event.preventDefault();
            scrollByStep(-1);
          }

          if (event.key === 'ArrowDown') {
            event.preventDefault();
            scrollByStep(1);
          }
        }}
        tabIndex={0}
      >
        {buildings.length > 0 ? (
          buildings.map((building) => (
            <BuildingCard
              key={building.id}
              building={building}
              isSelected={building.id === selectedBuildingId}
              isFavorite={favoriteIds.includes(building.id)}
              onSelect={() => onSelectBuilding(building.id)}
              onToggleFavorite={() => onToggleFavorite(building.id)}
              onOpenWebsite={() => onOpenWebsite(building.website)}
              className="snap-start"
            />
          ))
        ) : (
          <div className="rounded-[28px] border border-dashed border-[var(--line)] bg-white/55 px-5 py-10 text-center">
            <p className="text-lg font-semibold tracking-tight">No buildings match the current filters.</p>
            <p className="mt-2 text-sm text-[var(--text-muted)]">
              Adjust the search or clear a few filters to widen the view.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default BuildingList;
