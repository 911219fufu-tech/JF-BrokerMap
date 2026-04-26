import { supabase } from './supabase';

function mapRowToClient(row) {
  return {
    id: row.id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    name: row.name ?? '',
    contact: row.contact ?? '',
    status: row.status ?? 'new',
    budgetMin: row.budget_min === null ? '' : String(row.budget_min),
    budgetMax: row.budget_max === null ? '' : String(row.budget_max),
    areas: row.areas ?? [],
    moveInDate: row.move_in_date ?? '',
    preferredLayout: row.preferred_layout ?? '',
    livingSetup: row.living_setup ?? (
      row.roommate_interest === 'no'
        ? 'solo_only'
        : row.roommate_interest === 'yes'
          ? 'must_share'
          : 'open_to_share'
    ),
    maxOccupants: row.max_occupants === null ? '' : String(row.max_occupants),
    clientGender: row.client_gender ?? 'unspecified',
    roommateGenderPreference: row.roommate_gender_preference ?? 'any',
    occupationType: row.occupation_type ?? '',
    lifestylePreference: row.lifestyle_preference ?? 'balanced',
    schedulePreference: row.schedule_preference ?? 'flexible',
    smokingPreference: row.smoking_preference ?? 'no',
    petPreference: row.pet_preference ?? 'open',
    mustHaves: row.must_haves ?? [],
    customNeeds: row.custom_needs ?? '',
    notes: row.notes ?? '',
  };
}

function toNullableInteger(value) {
  if (value === '' || value === null || value === undefined) {
    return null;
  }

  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : null;
}

function mapClientToRow(client, userId) {
  return {
    user_id: userId,
    name: client.name,
    contact: client.contact || null,
    status: client.status,
    budget_min: toNullableInteger(client.budgetMin),
    budget_max: toNullableInteger(client.budgetMax),
    areas: client.areas,
    move_in_date: client.moveInDate || null,
    preferred_layout: client.preferredLayout || null,
    living_setup: client.livingSetup,
    max_occupants: toNullableInteger(client.maxOccupants),
    client_gender: client.clientGender,
    roommate_gender_preference: client.roommateGenderPreference,
    occupation_type: client.occupationType || null,
    lifestyle_preference: client.lifestylePreference,
    schedule_preference: client.schedulePreference,
    smoking_preference: client.smokingPreference,
    pet_preference: client.petPreference,
    must_haves: client.mustHaves,
    custom_needs: client.customNeeds || null,
    notes: client.notes || null,
  };
}

export async function fetchClients() {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []).map(mapRowToClient);
}

export async function createRemoteClient(client, userId) {
  const payload = mapClientToRow(client, userId);
  const { data, error } = await supabase
    .from('clients')
    .insert(payload)
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return mapRowToClient(data);
}

export async function updateRemoteClient(clientId, client, userId) {
  const payload = mapClientToRow(client, userId);
  const { data, error } = await supabase
    .from('clients')
    .update(payload)
    .eq('id', clientId)
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return mapRowToClient(data);
}

export async function deleteRemoteClient(clientId) {
  const { error } = await supabase.from('clients').delete().eq('id', clientId);

  if (error) {
    throw error;
  }
}
