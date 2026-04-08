export const TYPE_OPTIONS = ['Studio', '1B', '2B', '3B'];
export const NEWPORT_RENTALS_FEE_GUIDE = {
  required: [
    {
      label: 'Application Fee',
      value: '$100 one-time',
      note: 'Per applicant / guarantor',
    },
    {
      label: "Renter's Insurance",
      value: 'Variable per month',
      note: 'Residents must maintain an active policy or may be charged a $20 non-compliance monthly fee',
    },
    {
      label: 'Window Guard Fee',
      value: '$20 per window one-time',
      note: 'Required by law if a child 10 or younger resides in the apartment',
    },
    {
      label: "First Month's Rent",
      value: "One month's rent",
      note: 'Due at lease signing',
    },
    {
      label: 'Security Deposit',
      value: 'Variable one-time',
    },
  ],
  other: [
    {
      label: 'Pet Screening',
      value: '$25 one-time',
      note: 'Per pet',
    },
    {
      label: 'Pet Fee',
      value: '$50 per month',
      note: 'Per pet',
    },
    {
      label: 'Late Fee',
      value: '5% per occurrence',
    },
    {
      label: 'Parking',
      value: 'Variable / 3rd party',
    },
  ],
  utilities: [
    {
      label: 'Electric',
      value: 'Metered per month',
    },
    {
      label: 'Water',
      value: 'Metered per month',
    },
    {
      label: 'Sewer',
      value: 'Metered per month',
    },
    {
      label: 'Trash',
      value: '$12.50 per month',
    },
  ],
  notes: 'All final fees and charges will be disclosed with the lease agreement.',
};

export const MAGNOLIA_DUMBO_FEE_GUIDE = {
  required: [
    {
      label: 'Application Fee',
      value: '$20 one-time',
    },
    {
      label: 'Security Deposit',
      value: '100% one-time',
      note: 'Standard refundable deposit',
    },
    {
      label: 'Pet Registration',
      value: 'Varies annually',
      note: 'Third-party fee',
    },
    {
      label: 'Amenity Fee',
      value: '$100 per month',
    },
    {
      label: "Renter's Liability Insurance",
      value: 'Varies per month',
      note: 'Renter provided',
    },
  ],
  other: [
    {
      label: 'Parking',
      value: 'Varies per month',
      note: 'Third party',
    },
    {
      label: 'Pet Rent',
      value: '$50 per month',
    },
    {
      label: 'Bicycle Storage',
      value: '$25 per month',
    },
    {
      label: 'Property Insurance Program',
      value: '$15 per month',
      note: 'Optional renters liability program',
    },
    {
      label: 'Cable TV',
      value: '3rd party monthly',
    },
    {
      label: 'Internet',
      value: '3rd party monthly',
      note: 'Optional',
    },
  ],
  utilities: [
    {
      label: 'Electric',
      value: '3rd party monthly',
    },
    {
      label: 'Gas',
      value: 'Included',
    },
    {
      label: 'Water',
      value: 'Included',
    },
    {
      label: 'Sewer',
      value: 'Included',
    },
    {
      label: 'Trash',
      value: 'Included',
    },
  ],
};

export const WILLOUGHBY_FEE_GUIDE = {
  required: [
    {
      label: 'Application Fee',
      value: '$20 one-time',
    },
    {
      label: 'Security Deposit',
      value: '100% one-time',
      note: 'Standard refundable deposit',
    },
    {
      label: 'Pet Registration',
      value: 'Varies annually',
      note: 'Third-party fee',
    },
    {
      label: 'Amenity Fee',
      value: '$95 per month',
    },
    {
      label: "Renter's Liability Insurance",
      value: 'Varies per month',
      note: 'Renter provided',
    },
  ],
  other: [
    {
      label: 'Parking',
      value: 'Varies per month',
      note: 'Third party',
    },
    {
      label: 'Pet Rent',
      value: '$50 per month',
    },
    {
      label: 'Bicycle Storage',
      value: '$20 per month',
    },
    {
      label: 'Storage Space',
      value: '$100-$150 per month',
    },
    {
      label: 'Property Insurance Program',
      value: '$15 per month',
      note: 'Optional renters liability program',
    },
    {
      label: 'Cable TV',
      value: '3rd party monthly',
    },
    {
      label: 'Internet',
      value: '3rd party monthly',
      note: 'Optional',
    },
  ],
  utilities: [
    {
      label: 'Electric',
      value: 'Usage based monthly',
    },
    {
      label: 'Gas',
      value: 'Included',
    },
    {
      label: 'Water',
      value: 'Included',
    },
    {
      label: 'Sewer',
      value: 'Included',
    },
    {
      label: 'Trash',
      value: 'Included',
    },
  ],
};

export function getMinPrice(priceRange) {
  const [minimum] = String(priceRange).split('-');
  const value = Number(minimum);
  return Number.isFinite(value) ? value : null;
}

export function getMaxPrice(priceRange) {
  const parts = String(priceRange).split('-');
  const value = Number(parts.at(-1));
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

function getPriceRangeValues(priceRange) {
  const minimum = getMinPrice(priceRange);
  const maximum = getMaxPrice(priceRange);

  if (minimum === null || maximum === null) {
    return null;
  }

  return {
    min: minimum,
    max: maximum,
  };
}

function rangesOverlap(leftRange, rightRange) {
  return leftRange.min <= rightRange.max && rightRange.min <= leftRange.max;
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

export function getPriceBounds(buildings) {
  const prices = buildings.flatMap((building) => {
    const inventory = getBuildingInventory(building);

    if (inventory.length > 0) {
      return inventory
        .map((item) => getPriceRangeValues(item.price))
        .filter(Boolean)
        .flatMap((item) => [item.min, item.max]);
    }

    const buildingRange = getPriceRangeValues(building?.price);
    return buildingRange ? [buildingRange.min, buildingRange.max] : [];
  });

  if (prices.length === 0) {
    return {
      min: 0,
      max: 10000,
    };
  }

  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  };
}

export function matchesBuildingFilters(building, selectedPriceRange, selectedTypes) {
  const inventory = getBuildingInventory(building);
  const hasPriceFilter = Boolean(selectedPriceRange);

  if (inventory.length > 0) {
    return inventory.some((item) => {
      const matchesType =
        selectedTypes.length === 0 || selectedTypes.includes(item.type);
      const itemPriceRange = getPriceRangeValues(item.price);
      const matchesPrice =
        !hasPriceFilter ||
        (itemPriceRange && rangesOverlap(itemPriceRange, selectedPriceRange));

      return matchesType && matchesPrice;
    });
  }

  const matchesType =
    selectedTypes.length === 0 || selectedTypes.some((type) => getBuildingTypes(building).includes(type));

  const buildingPriceRange = getPriceRangeValues(building?.price);
  const matchesPrice =
    !hasPriceFilter ||
    (buildingPriceRange && rangesOverlap(buildingPriceRange, selectedPriceRange));

  return matchesType && matchesPrice;
}

export function getBuildingFeeGuide(building) {
  if (building?.feeGuide) {
    return building.feeGuide;
  }

  const website = building?.website?.toLowerCase() ?? '';

  if (website.includes('newportrentals.com')) {
    return NEWPORT_RENTALS_FEE_GUIDE;
  }

  if (website.includes('magnolia-dumbo.com')) {
    return MAGNOLIA_DUMBO_FEE_GUIDE;
  }

  if (website.includes('willoughbybk.com')) {
    return WILLOUGHBY_FEE_GUIDE;
  }

  return null;
}
