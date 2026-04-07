export const TYPE_OPTIONS = ['Studio', '1B', '2B'];
export const PRICE_OPTIONS = ['Under $3k', '$3k-$4k', '$4k+'];

export function getMinPrice(priceRange) {
  const [minimum] = String(priceRange).split('-');
  const value = Number(minimum);
  return Number.isFinite(value) ? value : null;
}

export function getPriceBucket(priceRange) {
  const minimum = getMinPrice(priceRange);

  if (minimum === null) {
    return 'Unknown';
  }

  if (minimum < 3000) {
    return 'Under $3k';
  }

  if (minimum < 4000) {
    return '$3k-$4k';
  }

  return '$4k+';
}

export function formatPrice(priceRange) {
  const minimum = getMinPrice(priceRange);
  return minimum === null ? 'Price on request' : `$${priceRange}`;
}

export function getBuildingInventory(building) {
  if (!Array.isArray(building?.inventory)) {
    return [];
  }

  return building.inventory.filter((item) => {
    return item && typeof item.type === 'string' && item.type && item.price;
  });
}

export function getBuildingTypes(building) {
  const inventory = getBuildingInventory(building);

  if (inventory.length > 0) {
    return [...new Set(inventory.map((item) => item.type))];
  }

  return Array.isArray(building?.type) ? building.type : [];
}

export function getBuildingPriceRange(building) {
  const inventory = getBuildingInventory(building);

  if (inventory.length === 0) {
    return building?.price ?? 'Ask';
  }

  const prices = inventory
    .map((item) => getMinPrice(item.price))
    .filter((value) => value !== null);

  if (prices.length === 0) {
    return building?.price ?? 'Ask';
  }

  const minimum = Math.min(...prices);
  const maximum = Math.max(...prices);

  return minimum === maximum ? String(minimum) : `${minimum}-${maximum}`;
}

export function matchesBuildingFilters(building, selectedPrices, selectedTypes) {
  const inventory = getBuildingInventory(building);

  if (inventory.length > 0) {
    return inventory.some((item) => {
      const matchesType =
        selectedTypes.length === 0 || selectedTypes.includes(item.type);
      const matchesPrice =
        selectedPrices.length === 0 || selectedPrices.includes(getPriceBucket(item.price));

      return matchesType && matchesPrice;
    });
  }

  const matchesType =
    selectedTypes.length === 0 || selectedTypes.some((type) => getBuildingTypes(building).includes(type));

  const matchesPrice =
    selectedPrices.length === 0 || selectedPrices.includes(getPriceBucket(building?.price));

  return matchesType && matchesPrice;
}
