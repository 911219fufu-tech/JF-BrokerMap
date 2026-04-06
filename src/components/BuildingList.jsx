import BuildingCard from './BuildingCard';

function BuildingList({
  buildings,
  selectedBuildingId,
  favoriteIds,
  onSelectBuilding,
  onToggleFavorite,
  onOpenWebsite,
}) {
  return (
    <section className="glass-panel flex min-h-[520px] flex-col rounded-[32px] p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3 border-b border-[var(--line)] pb-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-muted)]">Portfolio View</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight">Buildings</h2>
        </div>
        <div className="rounded-full border border-[var(--line)] bg-white/75 px-3 py-2 text-sm text-[var(--text-muted)]">
          {buildings.length} shown
        </div>
      </div>

      <div className="soft-scrollbar mt-4 flex-1 space-y-3 overflow-y-auto pr-1">
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
