const FAVORITES_KEY = 'broker-atlas:favorites';
const NOTES_KEY = 'broker-atlas:notes';
const RECENT_KEY = 'broker-atlas:recent';
function readStorage(key, fallbackValue) {
  if (typeof window === 'undefined') {
    return fallbackValue;
  }

  try {
    const rawValue = window.localStorage.getItem(key);
    return rawValue ? JSON.parse(rawValue) : fallbackValue;
  } catch {
    return fallbackValue;
  }
}

function writeStorage(key, value) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

export function loadFavorites() {
  return readStorage(FAVORITES_KEY, []);
}

export function saveFavorites(value) {
  writeStorage(FAVORITES_KEY, value);
}

export function loadNotes() {
  return readStorage(NOTES_KEY, {});
}

export function saveNotes(value) {
  writeStorage(NOTES_KEY, value);
}

export function loadRecentViews() {
  return readStorage(RECENT_KEY, []);
}

export function saveRecentViews(value) {
  writeStorage(RECENT_KEY, value);
}
