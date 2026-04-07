import { readFile, writeFile } from 'node:fs/promises';

const CURRENT_DATA_PATH = new URL('../building-data-current.yaml', import.meta.url);
const APP_DATA_PATH = new URL('../src/data/buildings.json', import.meta.url);
const ENV_PATH = new URL('../.env', import.meta.url);

const NAME_ALIASES = {
  'arc luxury long island city apartments': 'arc',
  'sven luxury apartment rentals lic': 'sven',
  'heritage tower 28': 'tower 28',
  'heritage 27 on 27th': '27 on 27th',
  'linc lic apartments by rockrose': 'linc lic',
  'eagle lofts by rockrose': 'eagle lofts',
  'hayden lic apartments by rockrose': 'hayden lic',
  '5pointzlic': '5pointz',
  'watermark lic': 'watermark',
  'the amberly apartments': 'amberly',
  'brooklyn gold': 'bklyn gold',
  'the eagle': 'eagle',
  'the paxton': 'paxton',
  'the alanza apartments': 'alanza',
  'the guild apartments': 'guild',
  'the addison': 'addison',
  'sunnyside garden apartments': 'sunnyside garden',
  'fifty11 apartment': 'fifty11',
  'woodside central': 'woodside central',
  'sola woodside': 'sola woodside',
  'kings and queens apartments': 'kings queens',
  'alexander': 'alexander',
  'the drake': 'drake',
  'vista65': 'vista65',
  'parker towers': 'parker towers',
  '505 summit': '505 summit',
  'journal square urby apartments': 'urby jsq',
  'overlook flats jersey city': 'overlook flats',
  '632 newark': '632 newark',
  '28 cottage': '28 cottage',
  '9 homestead': '9 homestead',
  '26 van reipen': '26 van reipen',
  'the journal': 'journal',
  'mrk': 'mrk',
  '85 van reypen street apartments': '85 van reypen',
  '3 acres': '3 acres',
  'the agnes': 'agnes',
  'journal squared': 'journal squared',
  'journal squared 2': 'journal squared 2',
  'journal squared 3': 'journal squared 3',
  'cobalt lofts': 'cobalt lofts',
  'the wyldes': 'wyldes',
  'steel works': 'steel works',
  'harrison urby apartments': 'urby harrison',
  'the eddy harrison': 'eddy harrison',
  'bella vista apartments': 'bella vista',
  'flora building': 'flora',
  'the marq roxy': 'marq roxy',
  'one23 apartments': 'one23',
  'horizon heights': 'horizon heights',
  'bisby at newport': 'bisby',
  'beach at newport': 'beach',
  'laguna at newport': 'laguna',
  'ellipse at newport': 'ellipse',
  'parkside west at newport': 'parkside west',
  'parkside east at newport': 'parkside east',
  'aquablu at newport': 'aquablu',
  'waterside square north at newport': 'waterside north',
  'waterside square south at newport': 'waterside south',
  'east hampton at newport': 'east hampton',
  'southampton at newport': 'southampton',
  'newport': 'newport tower',
  'atlantic at newport': 'atlantic',
  'pacific at newport': 'pacific',
  'newport rentals apartments': 'newport rentals',
  'lincoln house at hamilton park': 'lincoln house',
  'roosevelt house at hamilton park': 'roosevelt house',
  '351 marin apartments': '351 marin',
};

const MAP_LABEL_ALIASES = {
  'arc luxury long island city apartments': 'ARC',
  'sven luxury apartment rentals lic': 'SVEN',
  'heritage tower 28': 'Tower 28',
  'heritage 27 on 27th': '27 on 27th',
  'jackson park lic': 'Jackson Park',
  'linc lic apartments by rockrose': 'Linc LIC',
  'eagle lofts by rockrose': 'Eagle Lofts',
  'hayden lic apartments by rockrose': 'Hayden LIC',
  '5pointzlic': '5Pointz',
  'watermark lic': 'Watermark',
  '8 court square': '8 Court',
  '4705 center boulevard apartments by rockrose': '4705 CB',
  '4615 center blvd': '4615 CB',
  '4610 center blvd': '4610 CB',
  '5203 center blvd': '5203 CB',
  '5241 center blvd': '5241 CB',
  'magnolia dumbo': 'Magnolia',
  'the amberly apartments': 'Amberly',
  'the eagle': 'The Eagle',
  'willoughby': 'Willoughby',
  'the paxton': 'Paxton',
  'the alanza apartments': 'Alanza',
  'the addison': 'Addison',
  'hoyt horn': 'Hoyt & Horn',
  'plank road': 'Plank Road',
  'caesura': 'Caesura',
  'hub': 'Hub',
  'the guild apartments': 'Guild',
  'brooklyn gold': 'BK Gold',
  'bklyn air': 'BKLYN AIR',
  'sunnyside garden apartments': 'Sunnyside',
  'fifty11 apartment': 'Fifty11',
  'woodside central': 'Woodside',
  'sola woodside': 'Sola',
  'kings and queens apartments': 'K&Q',
  'alexander': 'Alexander',
  'the drake': 'Drake',
  'vista65': 'Vista65',
  'parker towers': 'Parker',
  '505 summit': '505 Summit',
  'journal square urby apartments': 'Urby JSQ',
  'overlook flats jersey city': 'Overlook',
  '632 newark': '632 Newark',
  '28 cottage': '28 Cottage',
  '9 homestead': '9 Homestead',
  '26 van reipen': '26 Van Reipen',
  'the journal': 'The Journal',
  'mrk': 'MRK',
  '85 van reypen street apartments': '85 Van Reypen',
  '3 acres': '3 Acres',
  'the agnes': 'Agnes',
  'journal squared': 'JSQ 1',
  'journal squared 2': 'JSQ 2',
  'journal squared 3': 'JSQ 3',
  'cobalt lofts': 'Cobalt',
  'the wyldes': 'Wyldes',
  'steel works': 'Steel Works',
  'harrison urby apartments': 'Urby Harrison',
  'the eddy harrison': 'The Eddy',
  'bella vista apartments': 'Bella Vista',
  'flora building': 'Flora',
  'the marq roxy': 'Marq-Roxy',
  'one23 apartments': 'ONE23',
  'horizon heights': 'Horizon',
  'bisby at newport': 'Bisby',
  'beach at newport': 'Beach',
  'laguna at newport': 'Laguna',
  'ellipse at newport': 'Ellipse',
  'parkside west at newport': 'Parkside',
  'parkside east at newport': 'Parkside East',
  'aquablu at newport': 'Aquablu',
  'waterside square north at newport': 'Waterside N',
  'waterside square south at newport': 'Waterside S',
  'east hampton at newport': 'East Hampton',
  'southampton at newport': 'Southampton',
  'newport': 'Newport',
  'atlantic at newport': 'Atlantic',
  'pacific at newport': 'Pacific',
  'newport rentals apartments': 'Newport Rentals',
  'lincoln house at hamilton park': 'Lincoln House',
  'roosevelt house at hamilton park': 'Roosevelt House',
  '351 marin apartments': '351 Marin',
};

function normalizeName(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function parseYamlBlocks(content) {
  const rows = [];
  let currentRow = null;

  for (const rawLine of content.split('\n')) {
    const line = rawLine.replace(/\r/g, '');

    if (line.startsWith('- name:')) {
      if (currentRow) {
        rows.push(currentRow);
      }

      currentRow = { name: line.slice(7).trim() };
      continue;
    }

    if (!currentRow || !line.startsWith('  ')) {
      continue;
    }

    const separatorIndex = line.indexOf(':');

    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(2, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim();
    currentRow[key] = value;
  }

  if (currentRow) {
    rows.push(currentRow);
  }

  return rows;
}

function splitList(value) {
  if (!value) {
    return [];
  }

  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function getMatchKey(name) {
  const normalized = normalizeName(name);
  return NAME_ALIASES[normalized] ?? normalized;
}

function deriveMapLabel(name, existingRecord) {
  const normalized = normalizeName(name);

  if (MAP_LABEL_ALIASES[normalized]) {
    return MAP_LABEL_ALIASES[normalized];
  }

  if (existingRecord?.mapLabel) {
    return existingRecord.mapLabel;
  }

  return name;
}

function dedupeRows(rows) {
  const rowMap = new Map();

  for (const row of rows) {
    rowMap.set(normalizeName(row.name), row);
  }

  return [...rowMap.values()];
}

function parseEnvToken(content) {
  const match = content.match(/^VITE_MAPBOX_TOKEN=(.+)$/m);
  return match?.[1]?.trim() ?? '';
}

function deriveFlags(record, existingRecord) {
  const flags = new Set(existingRecord?.flags ?? []);

  if (record.notes?.toLowerCase().includes('no 2b')) {
    flags.add('No 2B');
  }

  return [...flags];
}

async function geocodeAddress(address, token) {
  const url = new URL(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json`,
  );
  url.searchParams.set('access_token', token);
  url.searchParams.set('limit', '1');
  url.searchParams.set('country', 'us');
  url.searchParams.set('types', 'address');
  url.searchParams.set('autocomplete', 'false');

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Geocoding failed for ${address}: ${response.status}`);
  }

  const payload = await response.json();
  const feature = payload.features?.[0];

  if (!feature?.center) {
    return null;
  }

  return {
    lng: feature.center[0],
    lat: feature.center[1],
  };
}

async function main() {
  const [yamlContent, jsonContent, envContent] = await Promise.all([
    readFile(CURRENT_DATA_PATH, 'utf8'),
    readFile(APP_DATA_PATH, 'utf8'),
    readFile(ENV_PATH, 'utf8'),
  ]);

  const token = parseEnvToken(envContent);

  if (!token) {
    throw new Error('Missing VITE_MAPBOX_TOKEN in .env');
  }

  const currentRows = dedupeRows(parseYamlBlocks(yamlContent));
  const appData = JSON.parse(jsonContent);
  const currentRowKeys = new Set(currentRows.map((row) => getMatchKey(row.name)));
  const existingByName = new Map();

  for (const record of appData) {
    existingByName.set(getMatchKey(record.name), record);
  }

  let nextId = Math.max(...appData.map((record) => record.id), 0) + 1;
  const geocodeCache = new Map();

  const nextRecords = [];

  for (const row of currentRows) {
    const matchKey = getMatchKey(row.name);
    const existingRecord = existingByName.get(matchKey);

    let coordinates = null;

    if (row.address) {
      coordinates = geocodeCache.get(row.address);

      if (!coordinates) {
        coordinates = await geocodeAddress(row.address, token);
        geocodeCache.set(row.address, coordinates);
      }
    }

    nextRecords.push({
      id: existingRecord?.id ?? nextId++,
      name: row.name,
      lat: coordinates?.lat ?? existingRecord?.lat ?? null,
      lng: coordinates?.lng ?? existingRecord?.lng ?? null,
      area: row.area || existingRecord?.area || '',
      address: row.address || existingRecord?.address || '',
      price: existingRecord?.price ?? 'Ask',
      type: existingRecord?.type ?? [],
      inventory: existingRecord?.inventory ?? [],
      mapLabel: deriveMapLabel(row.name, existingRecord),
      website: row.website || existingRecord?.website || '',
      availability: row.availability || existingRecord?.availability || '',
      op: row.op || existingRecord?.op || '',
      emails: row.emails ? splitList(row.emails) : (existingRecord?.emails ?? []),
      phones: row.phones ? splitList(row.phones) : (existingRecord?.phones ?? []),
      flags: deriveFlags(row, existingRecord),
      notes: row.notes || existingRecord?.notes || '',
    });
  }

  const preservedRecords = appData.filter((record) => !currentRowKeys.has(getMatchKey(record.name)));
  const nextData = [...nextRecords, ...preservedRecords];
  await writeFile(APP_DATA_PATH, `${JSON.stringify(nextData, null, 2)}\n`, 'utf8');

  console.log(`Synced ${nextRecords.length} real records to src/data/buildings.json`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
