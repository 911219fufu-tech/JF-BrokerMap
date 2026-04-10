import { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import buildings from './data/buildings.json';
import Navbar from './components/Navbar';
import SearchBar from './components/SearchBar';
import FilterBar from './components/FilterBar';
import BuildingList from './components/BuildingList';
import DetailPanel from './components/DetailPanel';
import {
  TYPE_OPTIONS,
  getPriceBounds,
  matchesBuildingFilters,
} from './lib/buildings';
import {
  loadFavorites,
  loadNotes,
  loadRecentViews,
  saveFavorites,
  saveNotes,
  saveRecentViews,
} from './lib/storage';

const MapView = lazy(() => import('./components/MapView'));

function MapLoadingState() {
  return (
    <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(220,227,210,0.8),_transparent_35%),linear-gradient(180deg,_rgba(250,248,242,0.98),_rgba(237,231,219,0.96))] p-6">
      <div className="rounded-[28px] border border-[var(--line)] bg-white/85 px-5 py-4 text-sm text-[var(--text-muted)] shadow-panel">
        Loading map workspace...
      </div>
    </div>
  );
}

function App() {
  const priceBounds = useMemo(() => getPriceBounds(buildings), []);
  const [searchValue, setSearchValue] = useState('');
  const [selectedAreas, setSelectedAreas] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState(() => ({
    min: priceBounds.min,
    max: priceBounds.max,
  }));
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedBuildingId, setSelectedBuildingId] = useState(null);
  const [focusNonce, setFocusNonce] = useState(0);
  const [favoriteIds, setFavoriteIds] = useState(() => loadFavorites());
  const [notesById, setNotesById] = useState(() => loadNotes());
  const [recentIds, setRecentIds] = useState(() => loadRecentViews());

  useEffect(() => {
    saveFavorites(favoriteIds);
  }, [favoriteIds]);

  useEffect(() => {
    saveNotes(notesById);
  }, [notesById]);

  useEffect(() => {
    saveRecentViews(recentIds);
  }, [recentIds]);

  const hasCustomPriceRange =
    selectedPriceRange.min !== priceBounds.min || selectedPriceRange.max !== priceBounds.max;

  const activePriceRange = hasCustomPriceRange ? selectedPriceRange : null;

  const filteredBuildings = useMemo(
    () =>
      buildings.filter((building) => {
        const searchTerm = searchValue.trim().toLowerCase();
        const matchesSearch =
          !searchTerm ||
          building.name.toLowerCase().includes(searchTerm) ||
          building.area.toLowerCase().includes(searchTerm);

        const matchesArea =
          selectedAreas.length === 0 || selectedAreas.includes(building.area);

        const matchesInventoryFilters = matchesBuildingFilters(
          building,
          activePriceRange,
          selectedTypes,
        );

        return matchesSearch && matchesArea && matchesInventoryFilters;
      }),
    [searchValue, selectedAreas, activePriceRange, selectedTypes],
  );

  const portfolioBuildings = useMemo(() => {
    return [...filteredBuildings].sort((leftBuilding, rightBuilding) => {
      const leftHasPriorityOp = /^1\b/i.test(leftBuilding.op?.trim() ?? '');
      const rightHasPriorityOp = /^1\b/i.test(rightBuilding.op?.trim() ?? '');

      if (leftHasPriorityOp === rightHasPriorityOp) {
        return 0;
      }

      return leftHasPriorityOp ? -1 : 1;
    });
  }, [filteredBuildings]);

  useEffect(() => {
    if (!selectedBuildingId) {
      return;
    }

    const isStillVisible = filteredBuildings.some(
      (building) => building.id === selectedBuildingId,
    );

    if (!isStillVisible) {
      setSelectedBuildingId(null);
    }
  }, [filteredBuildings, selectedBuildingId]);

  const selectedBuilding = useMemo(
    () => buildings.find((building) => building.id === selectedBuildingId) ?? null,
    [selectedBuildingId],
  );

  const recentBuildings = useMemo(
    () =>
      recentIds
        .map((id) => buildings.find((building) => building.id === id))
        .filter(Boolean),
    [recentIds],
  );

  const favoriteCount = favoriteIds.length;
  const areaOptions = useMemo(() => {
    const areaOrder = ['LIC', 'Queens', 'DTBK', 'DTJC', 'JSQ', 'Newport', 'Harrison', 'Union City', 'Forten', 'Midtown West', 'Upper Manhattan', 'West NY'];
    const existingAreas = new Set(buildings.map((building) => building.area));
    return ['ALL', ...areaOrder.filter((area) => existingAreas.has(area))];
  }, []);

  const toggleSelection = (buildingId) => {
    setSelectedBuildingId(buildingId);
    setFocusNonce((currentValue) => currentValue + 1);
    setRecentIds((currentIds) => [
      buildingId,
      ...currentIds.filter((id) => id !== buildingId),
    ].slice(0, 8));
  };

  const toggleFavorite = (buildingId) => {
    setFavoriteIds((currentIds) =>
      currentIds.includes(buildingId)
        ? currentIds.filter((id) => id !== buildingId)
        : [buildingId, ...currentIds],
    );
  };

  const updateArea = (value) => {
    if (value === 'ALL') {
      setSelectedAreas([]);
      return;
    }

    setSelectedAreas((currentValues) =>
      currentValues.includes(value)
        ? currentValues.filter((item) => item !== value)
        : [...currentValues, value],
    );
  };

  const updateType = (value) => {
    setSelectedTypes((currentValues) =>
      currentValues.includes(value)
        ? currentValues.filter((item) => item !== value)
        : [...currentValues, value],
    );
  };

  const clearFilters = () => {
    setSelectedAreas([]);
    setSelectedPriceRange({
      min: priceBounds.min,
      max: priceBounds.max,
    });
    setSelectedTypes([]);
    setSearchValue('');
  };

  const updateNote = (buildingId, nextValue) => {
    setNotesById((currentNotes) => ({
      ...currentNotes,
      [buildingId]: nextValue,
    }));
  };

  const copyWebsiteLink = async (url) => {
    if (!url || !navigator.clipboard) {
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
    } catch {
      return;
    }
  };

  const openWebsite = (url) => {
    if (!url) {
      return;
    }

    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-transparent text-[var(--text-main)]">
      <Navbar
        favoriteCount={favoriteCount}
        recentBuildings={recentBuildings}
        onSelectBuilding={toggleSelection}
      />

      <main className="mx-auto flex max-w-[1600px] flex-col gap-4 px-4 pb-4 pt-3 sm:px-6 lg:px-8">
        <section className="glass-panel relative z-20 overflow-visible rounded-[28px] p-4 sm:p-5">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
            <SearchBar
              value={searchValue}
              onChange={setSearchValue}
              resultCount={filteredBuildings.length}
            />

            <div className="hidden items-center justify-end gap-2 lg:flex">
              <div className="rounded-full border border-[var(--line)] bg-white/70 px-4 py-2 text-sm text-[var(--text-muted)]">
                {favoriteCount} favorites saved
              </div>
              <div className="rounded-full border border-[var(--line)] bg-white/70 px-4 py-2 text-sm text-[var(--text-muted)]">
                {recentBuildings.length} recent views
              </div>
            </div>
          </div>

          <FilterBar
            areaOptions={areaOptions}
            priceBounds={priceBounds}
            typeOptions={TYPE_OPTIONS}
            selectedAreas={selectedAreas}
            selectedPriceRange={selectedPriceRange}
            selectedTypes={selectedTypes}
            onAreaToggle={updateArea}
            onPriceChange={setSelectedPriceRange}
            onTypeToggle={updateType}
            onClear={clearFilters}
          />
        </section>

        <section className="flex flex-col gap-4 xl:grid xl:min-h-[calc(100vh-12.5rem)] xl:grid-cols-[minmax(340px,34%)_minmax(0,66%)]">
          <div className="order-2 xl:order-1">
            <BuildingList
              buildings={portfolioBuildings}
              selectedBuildingId={selectedBuildingId}
              favoriteIds={favoriteIds}
              onSelectBuilding={toggleSelection}
              onToggleFavorite={toggleFavorite}
              onOpenWebsite={openWebsite}
            />
          </div>

          <div className="order-1 xl:order-2">
            <div className="relative h-[54vh] min-h-[360px] overflow-hidden rounded-[32px] border border-[var(--line)] shadow-panel xl:min-h-[520px] xl:h-full">
              <Suspense fallback={<MapLoadingState />}>
                <MapView
                  buildings={filteredBuildings}
                  selectedBuilding={selectedBuilding}
                  favoriteIds={favoriteIds}
                  focusNonce={focusNonce}
                  onSelectBuilding={toggleSelection}
                />
              </Suspense>

              <DetailPanel
                building={selectedBuilding}
                isFavorite={selectedBuilding ? favoriteIds.includes(selectedBuilding.id) : false}
                noteValue={selectedBuilding ? notesById[selectedBuilding.id] ?? '' : ''}
                onClose={() => setSelectedBuildingId(null)}
                onOpenWebsite={openWebsite}
                onCopyLink={copyWebsiteLink}
                onToggleFavorite={toggleFavorite}
                onNoteChange={updateNote}
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
