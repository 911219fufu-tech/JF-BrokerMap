import { useEffect, useMemo, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import Map, { Marker, NavigationControl, ScaleControl } from 'react-map-gl';
import BuildingMarker from './Marker';

const DEFAULT_VIEW = {
  longitude: -73.9342,
  latitude: 40.736,
  zoom: 10.4,
};
const LABEL_ZOOM_THRESHOLD = 12.2;

function hasCoordinates(building) {
  return Number.isFinite(building?.lat) && Number.isFinite(building?.lng);
}

function MissingTokenState() {
  return (
    <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(220,227,210,0.85),_transparent_35%),linear-gradient(180deg,_rgba(250,248,242,0.98),_rgba(237,231,219,0.96))] p-6">
      <div className="max-w-md rounded-[30px] border border-[var(--line)] bg-white/80 p-6 text-center shadow-panel">
        <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-muted)]">Mapbox Required</p>
        <h3 className="mt-3 text-2xl font-semibold tracking-tight">Add your token to enable the live map</h3>
        <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">
          Create a <code className="rounded bg-[var(--bg-soft)] px-1.5 py-0.5">.env</code> file and set
          <code className="ml-1 rounded bg-[var(--bg-soft)] px-1.5 py-0.5">VITE_MAPBOX_TOKEN=your_token</code>.
        </p>
      </div>
    </div>
  );
}

function MapView({
  buildings,
  selectedBuilding,
  favoriteIds,
  focusNonce,
  onSelectBuilding,
}) {
  const token = import.meta.env.VITE_MAPBOX_TOKEN;
  const mapRef = useRef(null);
  const [showLabels, setShowLabels] = useState(DEFAULT_VIEW.zoom >= LABEL_ZOOM_THRESHOLD);
  const mappableBuildings = useMemo(
    () => buildings.filter(hasCoordinates),
    [buildings],
  );
  const selectedMappableBuilding = useMemo(
    () => (hasCoordinates(selectedBuilding) ? selectedBuilding : null),
    [selectedBuilding],
  );

  useEffect(() => {
    if (!token || !mapRef.current || mappableBuildings.length === 0) {
      return;
    }

    const map = mapRef.current.getMap();
    const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 1024;
    const focusPadding = isDesktop
      ? { top: 80, right: 420, bottom: 80, left: 80 }
      : { top: 56, right: 24, bottom: 300, left: 24 };
    const boundsPadding = isDesktop
      ? 110
      : { top: 56, right: 28, bottom: 56, left: 28 };

    if (selectedMappableBuilding) {
      map.flyTo({
        center: [selectedMappableBuilding.lng, selectedMappableBuilding.lat],
        zoom: 13.4,
        duration: 900,
        padding: focusPadding,
      });
      return;
    }

    if (mappableBuildings.length === 1) {
      map.flyTo({
        center: [mappableBuildings[0].lng, mappableBuildings[0].lat],
        zoom: 13,
        duration: 900,
      });
      return;
    }

    const bounds = new mapboxgl.LngLatBounds();
    mappableBuildings.forEach((building) => bounds.extend([building.lng, building.lat]));

    map.fitBounds(bounds, {
      padding: boundsPadding,
      duration: 900,
      maxZoom: 13,
    });
  }, [focusNonce, mappableBuildings, selectedMappableBuilding, token]);

  if (!token) {
    return <MissingTokenState />;
  }

  return (
    <Map
      ref={mapRef}
      initialViewState={DEFAULT_VIEW}
      mapboxAccessToken={token}
      mapStyle="mapbox://styles/mapbox/light-v11"
      attributionControl={false}
      onZoom={(event) => {
        const nextShowLabels = event.viewState.zoom >= LABEL_ZOOM_THRESHOLD;
        setShowLabels((currentValue) =>
          currentValue === nextShowLabels ? currentValue : nextShowLabels,
        );
      }}
      style={{ width: '100%', height: '100%' }}
    >
      <NavigationControl position="bottom-right" showCompass={false} />
      <ScaleControl position="bottom-left" />

      {mappableBuildings.map((building) => (
        <Marker
          key={building.id}
          longitude={building.lng}
          latitude={building.lat}
          anchor="bottom"
        >
          <BuildingMarker
            building={building}
            isSelected={selectedBuilding?.id === building.id}
            isFavorite={favoriteIds.includes(building.id)}
            showLabel={showLabels}
            onClick={() => onSelectBuilding(building.id)}
          />
        </Marker>
      ))}
    </Map>
  );
}

export default MapView;
