const CURRENCY_FORMATTER = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const DATE_FORMATTER = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

export const CLIENT_STATUS_OPTIONS = [
  { value: 'new', label: 'New lead' },
  { value: 'matching', label: 'Matching' },
  { value: 'touring', label: 'Touring' },
  { value: 'closed', label: 'Closed' },
  { value: 'paused', label: 'Paused' },
];

export const ROOMMATE_OPTIONS = [
  { value: 'yes', label: 'Yes' },
  { value: 'maybe', label: 'Maybe' },
  { value: 'no', label: 'No' },
];

export const LAYOUT_OPTIONS = [
  { value: 'studio', label: 'Studio' },
  { value: '1br', label: '1 Bedroom' },
  { value: '2br', label: '2 Bedroom' },
  { value: '3br_plus', label: '3 Bedroom+' },
];

export const GENDER_OPTIONS = [
  { value: 'female', label: 'Female' },
  { value: 'male', label: 'Male' },
  { value: 'non_binary', label: 'Non-binary' },
  { value: 'unspecified', label: 'Prefer not to say' },
];

export const ROOMMATE_GENDER_PREFERENCE_OPTIONS = [
  { value: 'any', label: 'Any' },
  { value: 'female_only', label: 'Female only' },
  { value: 'male_only', label: 'Male only' },
  { value: 'non_binary_only', label: 'Non-binary only' },
];

export const OCCUPATION_OPTIONS = [
  { value: 'student', label: 'Student' },
  { value: 'working', label: 'Working professional' },
  { value: 'remote', label: 'Remote worker' },
  { value: 'creative', label: 'Creative / freelance' },
  { value: 'other', label: 'Other' },
];

export const LIFESTYLE_OPTIONS = [
  { value: 'quiet', label: 'Quiet home' },
  { value: 'balanced', label: 'Balanced' },
  { value: 'social', label: 'Social home' },
];

export const SCHEDULE_OPTIONS = [
  { value: 'early', label: 'Early schedule' },
  { value: 'flexible', label: 'Flexible' },
  { value: 'late', label: 'Late schedule' },
];

export const SMOKING_OPTIONS = [
  { value: 'no', label: 'Non-smoker' },
  { value: 'outdoor_only', label: 'Outdoor only' },
  { value: 'yes', label: 'Smoker' },
];

export const PET_OPTIONS = [
  { value: 'no_pets', label: 'No pets' },
  { value: 'open', label: 'Open to pets' },
  { value: 'has_pet', label: 'Has pet' },
];

export const MUST_HAVE_OPTIONS = [
  { value: 'near_subway', label: 'Near subway' },
  { value: 'laundry', label: 'Laundry' },
  { value: 'dishwasher', label: 'Dishwasher' },
  { value: 'doorman', label: 'Doorman' },
  { value: 'elevator', label: 'Elevator' },
  { value: 'gym', label: 'Gym' },
  { value: 'furnished', label: 'Furnished' },
  { value: 'balcony', label: 'Balcony' },
  { value: 'natural_light', label: 'Natural light' },
];

const STATUS_LABELS = toLookup(CLIENT_STATUS_OPTIONS);
const ROOMMATE_LABELS = toLookup(ROOMMATE_OPTIONS);
const LAYOUT_LABELS = toLookup(LAYOUT_OPTIONS);
const GENDER_LABELS = toLookup(GENDER_OPTIONS);
const ROOMMATE_GENDER_LABELS = toLookup(ROOMMATE_GENDER_PREFERENCE_OPTIONS);
const OCCUPATION_LABELS = toLookup(OCCUPATION_OPTIONS);
const LIFESTYLE_LABELS = toLookup(LIFESTYLE_OPTIONS);
const SCHEDULE_LABELS = toLookup(SCHEDULE_OPTIONS);
const SMOKING_LABELS = toLookup(SMOKING_OPTIONS);
const PET_LABELS = toLookup(PET_OPTIONS);
const MUST_HAVE_LABELS = toLookup(MUST_HAVE_OPTIONS);

function toLookup(options) {
  return options.reduce((lookup, option) => {
    lookup[option.value] = option.label;
    return lookup;
  }, {});
}

function uniqueValues(values) {
  return [...new Set(values.filter(Boolean))];
}

function parseBudgetValue(value) {
  if (value === '' || value === null || value === undefined) {
    return null;
  }

  const parsedValue = Number(value);
  if (!Number.isFinite(parsedValue) || parsedValue < 0) {
    return null;
  }

  return parsedValue;
}

function parseMoveInDate(value) {
  if (!value) {
    return null;
  }

  const timestamp = Date.parse(value);
  return Number.isNaN(timestamp) ? null : timestamp;
}

function diffInDays(leftDate, rightDate) {
  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  return Math.abs(Math.round((leftDate - rightDate) / millisecondsPerDay));
}

function getIntersection(leftValues, rightValues) {
  const rightSet = new Set(rightValues);
  return uniqueValues(leftValues.filter((value) => rightSet.has(value)));
}

function getBudgetCompatibility(client, candidate) {
  const clientMin = parseBudgetValue(client.budgetMin);
  const clientMax = parseBudgetValue(client.budgetMax);
  const candidateMin = parseBudgetValue(candidate.budgetMin);
  const candidateMax = parseBudgetValue(candidate.budgetMax);

  if (
    clientMin === null ||
    clientMax === null ||
    candidateMin === null ||
    candidateMax === null
  ) {
    return {
      eligible: true,
      score: 8,
      reason: 'Budget details still need confirmation.',
    };
  }

  const overlapMin = Math.max(clientMin, candidateMin);
  const overlapMax = Math.min(clientMax, candidateMax);

  if (overlapMin <= overlapMax) {
    const overlapRange = overlapMax - overlapMin;
    const fullRange =
      Math.max(clientMax, candidateMax) - Math.min(clientMin, candidateMin) || 1;
    const overlapRatio = overlapRange / fullRange;
    const score = Math.round(18 + overlapRatio * 12);

    return {
      eligible: true,
      score,
      reason: 'Budget ranges overlap.',
    };
  }

  const budgetGap = Math.max(clientMin, candidateMin) - Math.min(clientMax, candidateMax);

  if (budgetGap <= 200) {
    return {
      eligible: true,
      score: 12,
      reason: 'Budgets are close enough to bridge.',
    };
  }

  return {
    eligible: false,
    score: 0,
    reason: 'Budget ranges are too far apart.',
  };
}

function getMoveInCompatibility(client, candidate) {
  const clientDate = parseMoveInDate(client.moveInDate);
  const candidateDate = parseMoveInDate(candidate.moveInDate);

  if (!clientDate || !candidateDate) {
    return {
      eligible: true,
      score: 8,
      reason: 'Move-in timeline is still flexible.',
    };
  }

  const difference = diffInDays(clientDate, candidateDate);

  if (difference > 45) {
    return {
      eligible: false,
      score: 0,
      reason: 'Move-in dates are too far apart.',
    };
  }

  if (difference <= 7) {
    return {
      eligible: true,
      score: 20,
      reason: 'Move-in dates are within one week.',
    };
  }

  if (difference <= 14) {
    return {
      eligible: true,
      score: 16,
      reason: 'Move-in dates are within two weeks.',
    };
  }

  if (difference <= 30) {
    return {
      eligible: true,
      score: 12,
      reason: 'Move-in dates are within one month.',
    };
  }

  return {
    eligible: true,
    score: 8,
    reason: 'Move-in dates are workable with planning.',
  };
}

function matchesGenderPreference(preference, gender) {
  if (preference === 'any') {
    return true;
  }

  if (gender === 'unspecified') {
    return false;
  }

  if (preference === 'female_only') {
    return gender === 'female';
  }

  if (preference === 'male_only') {
    return gender === 'male';
  }

  if (preference === 'non_binary_only') {
    return gender === 'non_binary';
  }

  return true;
}

function getLifestyleCompatibility(client, candidate) {
  let score = 0;
  const reasons = [];

  if (client.preferredLayout && client.preferredLayout === candidate.preferredLayout) {
    score += 8;
    reasons.push('Both want the same layout.');
  }

  if (client.lifestylePreference && client.lifestylePreference === candidate.lifestylePreference) {
    score += 8;
    reasons.push('Home vibe preferences line up.');
  }

  if (client.schedulePreference && client.schedulePreference === candidate.schedulePreference) {
    score += 7;
    reasons.push('Daily schedules feel compatible.');
  }

  if (client.occupationType && client.occupationType === candidate.occupationType) {
    score += 5;
    reasons.push('Work or study rhythm is similar.');
  }

  return { score, reasons };
}

function getMustHaveCompatibility(client, candidate) {
  const sharedNeeds = getIntersection(client.mustHaves, candidate.mustHaves);

  if (sharedNeeds.length === 0) {
    return {
      score: 0,
      reasons: [],
    };
  }

  const trimmedNeeds = sharedNeeds.slice(0, 2).map((value) => MUST_HAVE_LABELS[value] ?? value);

  return {
    score: Math.min(10, 4 + sharedNeeds.length * 2),
    reasons: [`Shared apartment priorities: ${trimmedNeeds.join(', ')}.`],
  };
}

function hasSmokingConflict(client, candidate) {
  return (
    (client.smokingPreference === 'no' && candidate.smokingPreference === 'yes') ||
    (candidate.smokingPreference === 'no' && client.smokingPreference === 'yes')
  );
}

function hasPetConflict(client, candidate) {
  return (
    (client.petPreference === 'no_pets' && candidate.petPreference === 'has_pet') ||
    (candidate.petPreference === 'no_pets' && client.petPreference === 'has_pet')
  );
}

export function createEmptyClient() {
  return {
    name: '',
    contact: '',
    status: 'new',
    budgetMin: '',
    budgetMax: '',
    areas: [],
    moveInDate: '',
    preferredLayout: '',
    roommateInterest: 'maybe',
    clientGender: 'unspecified',
    roommateGenderPreference: 'any',
    occupationType: '',
    lifestylePreference: 'balanced',
    schedulePreference: 'flexible',
    smokingPreference: 'no',
    petPreference: 'open',
    mustHaves: [],
    customNeeds: '',
    notes: '',
  };
}

export function createClientRecord(formState, existingClient) {
  const timestamp = new Date().toISOString();
  const trimmedName = formState.name.trim();
  const trimmedContact = formState.contact.trim();
  const trimmedCustomNeeds = formState.customNeeds.trim();
  const trimmedNotes = formState.notes.trim();

  return {
    id: existingClient?.id ?? `client-${Date.now()}`,
    createdAt: existingClient?.createdAt ?? timestamp,
    updatedAt: timestamp,
    name: trimmedName,
    contact: trimmedContact,
    status: formState.status || 'new',
    budgetMin: formState.budgetMin === '' ? '' : String(formState.budgetMin),
    budgetMax: formState.budgetMax === '' ? '' : String(formState.budgetMax),
    areas: uniqueValues(formState.areas ?? []),
    moveInDate: formState.moveInDate || '',
    preferredLayout: formState.preferredLayout || '',
    roommateInterest: formState.roommateInterest || 'maybe',
    clientGender: formState.clientGender || 'unspecified',
    roommateGenderPreference: formState.roommateGenderPreference || 'any',
    occupationType: formState.occupationType || '',
    lifestylePreference: formState.lifestylePreference || 'balanced',
    schedulePreference: formState.schedulePreference || 'flexible',
    smokingPreference: formState.smokingPreference || 'no',
    petPreference: formState.petPreference || 'open',
    mustHaves: uniqueValues(formState.mustHaves ?? []),
    customNeeds: trimmedCustomNeeds,
    notes: trimmedNotes,
  };
}

export function buildClientAreaOptions(buildings) {
  return [...new Set(buildings.map((building) => building.area))].sort((leftArea, rightArea) =>
    leftArea.localeCompare(rightArea),
  );
}

export function formatBudgetRange(client) {
  const min = parseBudgetValue(client.budgetMin);
  const max = parseBudgetValue(client.budgetMax);

  if (min !== null && max !== null) {
    return `${CURRENCY_FORMATTER.format(min)} - ${CURRENCY_FORMATTER.format(max)}`;
  }

  if (min !== null) {
    return `From ${CURRENCY_FORMATTER.format(min)}`;
  }

  if (max !== null) {
    return `Up to ${CURRENCY_FORMATTER.format(max)}`;
  }

  return 'Budget pending';
}

export function formatMoveInDate(value) {
  const parsedDate = parseMoveInDate(value);
  return parsedDate ? DATE_FORMATTER.format(parsedDate) : 'Flexible';
}

export function getClientStatusLabel(status) {
  return STATUS_LABELS[status] ?? 'Unknown';
}

export function getOptionLabel(optionsMap, value) {
  return optionsMap[value] ?? value;
}

export function getClientMeta(client) {
  return {
    statusLabel: getClientStatusLabel(client.status),
    roommateLabel: ROOMMATE_LABELS[client.roommateInterest] ?? 'Unknown',
    layoutLabel: client.preferredLayout ? LAYOUT_LABELS[client.preferredLayout] : 'Flexible',
    genderLabel: GENDER_LABELS[client.clientGender] ?? 'Unknown',
    roommateGenderLabel:
      ROOMMATE_GENDER_LABELS[client.roommateGenderPreference] ?? 'Unknown',
    occupationLabel: client.occupationType
      ? OCCUPATION_LABELS[client.occupationType] ?? client.occupationType
      : 'Not specified',
    lifestyleLabel: LIFESTYLE_LABELS[client.lifestylePreference] ?? 'Unknown',
    scheduleLabel: SCHEDULE_LABELS[client.schedulePreference] ?? 'Unknown',
    smokingLabel: SMOKING_LABELS[client.smokingPreference] ?? 'Unknown',
    petLabel: PET_LABELS[client.petPreference] ?? 'Unknown',
  };
}

export function getMustHaveLabel(value) {
  return MUST_HAVE_LABELS[value] ?? value;
}

export function getClientMatchSuggestions(client, clients) {
  if (!client || client.roommateInterest === 'no') {
    return [];
  }

  return clients
    .filter((candidate) => candidate.id !== client.id)
    .filter((candidate) => candidate.roommateInterest !== 'no')
    .map((candidate) => {
      const sharedAreas = getIntersection(client.areas, candidate.areas);
      if (sharedAreas.length === 0) {
        return null;
      }

      if (
        !matchesGenderPreference(client.roommateGenderPreference, candidate.clientGender) ||
        !matchesGenderPreference(candidate.roommateGenderPreference, client.clientGender)
      ) {
        return null;
      }

      if (hasSmokingConflict(client, candidate) || hasPetConflict(client, candidate)) {
        return null;
      }

      const budgetCompatibility = getBudgetCompatibility(client, candidate);
      const moveInCompatibility = getMoveInCompatibility(client, candidate);

      if (!budgetCompatibility.eligible || !moveInCompatibility.eligible) {
        return null;
      }

      const sharedAreaScore = Math.min(20, 12 + sharedAreas.length * 4);
      const roommateReadinessScore =
        client.roommateInterest === 'yes' && candidate.roommateInterest === 'yes' ? 8 : 5;
      const lifestyleCompatibility = getLifestyleCompatibility(client, candidate);
      const mustHaveCompatibility = getMustHaveCompatibility(client, candidate);

      const score =
        sharedAreaScore +
        roommateReadinessScore +
        budgetCompatibility.score +
        moveInCompatibility.score +
        lifestyleCompatibility.score +
        mustHaveCompatibility.score;

      const reasons = [
        `Shared target areas: ${sharedAreas.join(', ')}.`,
        budgetCompatibility.reason,
        moveInCompatibility.reason,
        ...lifestyleCompatibility.reasons,
        ...mustHaveCompatibility.reasons,
      ]
        .filter(Boolean)
        .slice(0, 4);

      return {
        client: candidate,
        score: Math.min(99, score),
        sharedAreas,
        reasons,
      };
    })
    .filter(Boolean)
    .sort((leftMatch, rightMatch) => rightMatch.score - leftMatch.score)
    .slice(0, 6);
}
