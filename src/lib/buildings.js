export const AREA_OPTIONS = ['LIC', 'Queens', 'DTBK', 'JSQ', 'West NY'];
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
