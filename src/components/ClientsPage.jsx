import { useEffect, useMemo, useState } from 'react';
import {
  CLIENT_STATUS_OPTIONS,
  GENDER_OPTIONS,
  LAYOUT_OPTIONS,
  LIFESTYLE_OPTIONS,
  MUST_HAVE_OPTIONS,
  OCCUPATION_OPTIONS,
  PET_OPTIONS,
  ROOMMATE_GENDER_PREFERENCE_OPTIONS,
  ROOMMATE_OPTIONS,
  SCHEDULE_OPTIONS,
  SMOKING_OPTIONS,
  buildClientAreaOptions,
  createClientRecord,
  createEmptyClient,
  formatBudgetRange,
  formatMoveInDate,
  getClientMatchSuggestions,
  getClientMeta,
  getClientStatusLabel,
  getMustHaveLabel,
} from '../lib/clients';
import { loadClients, saveClients } from '../lib/storage';

function SummaryCard({ label, value, detail }) {
  return (
    <div className="glass-panel rounded-[28px] p-5">
      <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-muted)]">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-[var(--text-main)]">{value}</p>
      <p className="mt-2 text-sm text-[var(--text-muted)]">{detail}</p>
    </div>
  );
}

function FieldLabel({ children }) {
  return (
    <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
      {children}
    </label>
  );
}

function SelectField({ label, value, onChange, options, placeholder = 'Select one' }) {
  return (
    <div className="space-y-2">
      <FieldLabel>{label}</FieldLabel>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-[var(--line)] bg-white/80 px-4 py-3 text-sm text-[var(--text-main)] outline-none transition focus:border-[var(--line-strong)] focus:bg-white"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function TextField({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <div className="space-y-2">
      <FieldLabel>{label}</FieldLabel>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-[var(--line)] bg-white/80 px-4 py-3 text-sm text-[var(--text-main)] outline-none transition focus:border-[var(--line-strong)] focus:bg-white"
      />
    </div>
  );
}

function TextAreaField({ label, value, onChange, placeholder, rows = 4 }) {
  return (
    <div className="space-y-2">
      <FieldLabel>{label}</FieldLabel>
      <textarea
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-[var(--line)] bg-white/80 px-4 py-3 text-sm text-[var(--text-main)] outline-none transition focus:border-[var(--line-strong)] focus:bg-white"
      />
    </div>
  );
}

function ToggleChip({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-2 text-sm transition ${
        active
          ? 'border-[var(--accent)] bg-[var(--accent)] text-white'
          : 'border-[var(--line)] bg-white/80 text-[var(--text-main)] hover:border-[var(--line-strong)] hover:bg-white'
      }`}
    >
      {label}
    </button>
  );
}

function MultiSelectField({ label, options, selectedValues, onToggle }) {
  return (
    <div className="space-y-3">
      <FieldLabel>{label}</FieldLabel>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <ToggleChip
            key={option.value ?? option}
            label={option.label ?? option}
            active={selectedValues.includes(option.value ?? option)}
            onClick={() => onToggle(option.value ?? option)}
          />
        ))}
      </div>
    </div>
  );
}

function DetailTag({ children }) {
  return (
    <span className="rounded-full border border-[var(--line)] bg-white/80 px-3 py-1.5 text-sm text-[var(--text-main)]">
      {children}
    </span>
  );
}

function getStatusTone(status) {
  if (status === 'closed') {
    return 'bg-[rgba(35,66,50,0.1)] text-[var(--text-main)]';
  }

  if (status === 'paused') {
    return 'bg-[rgba(104,116,105,0.14)] text-[var(--text-main)]';
  }

  if (status === 'touring') {
    return 'bg-[rgba(182,148,74,0.16)] text-[var(--text-main)]';
  }

  return 'bg-[rgba(35,66,50,0.14)] text-[var(--accent)]';
}

function ClientsPage({ buildings }) {
  const [clients, setClients] = useState(() => loadClients());
  const [selectedClientId, setSelectedClientId] = useState(() => loadClients()[0]?.id ?? null);
  const [editingClientId, setEditingClientId] = useState(null);
  const [formState, setFormState] = useState(() => createEmptyClient());
  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roommateOnlyFilter, setRoommateOnlyFilter] = useState(false);

  const areaOptions = useMemo(() => buildClientAreaOptions(buildings), [buildings]);

  useEffect(() => {
    saveClients(clients);
  }, [clients]);

  useEffect(() => {
    if (clients.length === 0) {
      setSelectedClientId(null);
      if (!editingClientId) {
        setFormState(createEmptyClient());
      }
      return;
    }

    const selectedStillExists = clients.some((client) => client.id === selectedClientId);
    if (!selectedStillExists) {
      setSelectedClientId(clients[0].id);
    }

    if (editingClientId && !clients.some((client) => client.id === editingClientId)) {
      setEditingClientId(null);
      setFormState(createEmptyClient());
    }
  }, [clients, selectedClientId, editingClientId]);

  const sortedClients = useMemo(
    () =>
      [...clients].sort((leftClient, rightClient) => {
        return new Date(rightClient.updatedAt).getTime() - new Date(leftClient.updatedAt).getTime();
      }),
    [clients],
  );

  const selectedClient = useMemo(
    () => sortedClients.find((client) => client.id === selectedClientId) ?? null,
    [sortedClients, selectedClientId],
  );

  const visibleClients = useMemo(() => {
    const searchTerm = searchValue.trim().toLowerCase();

    return sortedClients.filter((client) => {
      const matchesSearch =
        !searchTerm ||
        client.name.toLowerCase().includes(searchTerm) ||
        client.contact.toLowerCase().includes(searchTerm) ||
        client.areas.some((area) => area.toLowerCase().includes(searchTerm));

      const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
      const matchesRoommate =
        !roommateOnlyFilter ||
        client.roommateInterest === 'yes' ||
        client.roommateInterest === 'maybe';

      return matchesSearch && matchesStatus && matchesRoommate;
    });
  }, [sortedClients, searchValue, statusFilter, roommateOnlyFilter]);

  const matchSuggestions = useMemo(
    () => (selectedClient ? getClientMatchSuggestions(selectedClient, sortedClients) : []),
    [selectedClient, sortedClients],
  );

  const totalClients = clients.length;
  const roommateReadyCount = clients.filter((client) => client.roommateInterest !== 'no').length;
  const activeClientCount = clients.filter(
    (client) => client.status !== 'closed' && client.status !== 'paused',
  ).length;

  const updateFormField = (field, value) => {
    setFormState((currentState) => ({
      ...currentState,
      [field]: value,
    }));
  };

  const toggleArrayField = (field, value) => {
    setFormState((currentState) => ({
      ...currentState,
      [field]: currentState[field].includes(value)
        ? currentState[field].filter((item) => item !== value)
        : [...currentState[field], value],
    }));
  };

  const startNewClient = () => {
    setEditingClientId(null);
    setFormState(createEmptyClient());
  };

  const startEditClient = (client) => {
    setEditingClientId(client.id);
    setSelectedClientId(client.id);
    setFormState({
      ...createEmptyClient(),
      ...client,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!formState.name.trim()) {
      window.alert('Please add the client name.');
      return;
    }

    if (formState.areas.length === 0) {
      window.alert('Please choose at least one target area.');
      return;
    }

    const existingClient = clients.find((client) => client.id === editingClientId) ?? null;
    const nextClient = createClientRecord(formState, existingClient);

    setClients((currentClients) => {
      if (existingClient) {
        return currentClients.map((client) =>
          client.id === existingClient.id ? nextClient : client,
        );
      }

      return [nextClient, ...currentClients];
    });

    setEditingClientId(nextClient.id);
    setSelectedClientId(nextClient.id);
    setFormState({
      ...createEmptyClient(),
      ...nextClient,
    });
  };

  const handleDelete = () => {
    if (!editingClientId) {
      return;
    }

    const clientToDelete = clients.find((client) => client.id === editingClientId);
    if (!clientToDelete) {
      return;
    }

    const confirmed = window.confirm(`Delete ${clientToDelete.name} from this client list?`);
    if (!confirmed) {
      return;
    }

    setClients((currentClients) =>
      currentClients.filter((client) => client.id !== clientToDelete.id),
    );
    setEditingClientId(null);
    setFormState(createEmptyClient());
  };

  return (
    <main className="mx-auto flex max-w-[1600px] flex-col gap-4 px-4 pb-8 pt-3 sm:px-6 lg:px-8">
      <section className="grid gap-4 lg:grid-cols-3">
        <SummaryCard
          label="Clients"
          value={totalClients}
          detail="Saved locally in this browser for quick follow-up."
        />
        <SummaryCard
          label="Roommate Ready"
          value={roommateReadyCount}
          detail="Clients who are open to sharing and can be screened for pairings."
        />
        <SummaryCard
          label="Active Search"
          value={activeClientCount}
          detail="Open leads still moving through matching or touring."
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[420px_minmax(0,1fr)]">
        <form className="glass-panel rounded-[32px] p-5 sm:p-6" onSubmit={handleSubmit}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-muted)]">
                Client Brief
              </p>
              <h1 className="mt-2 text-2xl font-semibold text-[var(--text-main)]">
                {editingClientId ? 'Update client profile' : 'Add a new client'}
              </h1>
              <p className="mt-2 text-sm text-[var(--text-muted)]">
                Capture budget, neighborhoods, timing, and roommate fit in one place.
              </p>
            </div>

            <button
              type="button"
              onClick={startNewClient}
              className="rounded-full border border-[var(--line)] bg-white/80 px-4 py-2 text-sm font-medium text-[var(--text-main)] transition hover:border-[var(--line-strong)] hover:bg-white"
            >
              New form
            </button>
          </div>

          <div className="mt-6 space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                label="Client name"
                value={formState.name}
                onChange={(value) => updateFormField('name', value)}
                placeholder="Jane Chen"
              />
              <TextField
                label="Contact"
                value={formState.contact}
                onChange={(value) => updateFormField('contact', value)}
                placeholder="Phone, WeChat, email"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <SelectField
                label="Status"
                value={formState.status}
                onChange={(value) => updateFormField('status', value)}
                options={CLIENT_STATUS_OPTIONS}
              />
              <SelectField
                label="Roommate interest"
                value={formState.roommateInterest}
                onChange={(value) => updateFormField('roommateInterest', value)}
                options={ROOMMATE_OPTIONS}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                label="Budget minimum"
                value={formState.budgetMin}
                onChange={(value) => updateFormField('budgetMin', value)}
                placeholder="1200"
                type="number"
              />
              <TextField
                label="Budget maximum"
                value={formState.budgetMax}
                onChange={(value) => updateFormField('budgetMax', value)}
                placeholder="1700"
                type="number"
              />
            </div>

            <MultiSelectField
              label="Target areas"
              options={areaOptions}
              selectedValues={formState.areas}
              onToggle={(value) => toggleArrayField('areas', value)}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                label="Move-in date"
                value={formState.moveInDate}
                onChange={(value) => updateFormField('moveInDate', value)}
                type="date"
              />
              <SelectField
                label="Preferred layout"
                value={formState.preferredLayout}
                onChange={(value) => updateFormField('preferredLayout', value)}
                options={LAYOUT_OPTIONS}
                placeholder="Flexible"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <SelectField
                label="Client gender"
                value={formState.clientGender}
                onChange={(value) => updateFormField('clientGender', value)}
                options={GENDER_OPTIONS}
              />
              <SelectField
                label="Roommate gender pref"
                value={formState.roommateGenderPreference}
                onChange={(value) => updateFormField('roommateGenderPreference', value)}
                options={ROOMMATE_GENDER_PREFERENCE_OPTIONS}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <SelectField
                label="Occupation"
                value={formState.occupationType}
                onChange={(value) => updateFormField('occupationType', value)}
                options={OCCUPATION_OPTIONS}
                placeholder="Not specified"
              />
              <SelectField
                label="Lifestyle"
                value={formState.lifestylePreference}
                onChange={(value) => updateFormField('lifestylePreference', value)}
                options={LIFESTYLE_OPTIONS}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <SelectField
                label="Schedule"
                value={formState.schedulePreference}
                onChange={(value) => updateFormField('schedulePreference', value)}
                options={SCHEDULE_OPTIONS}
              />
              <SelectField
                label="Smoking"
                value={formState.smokingPreference}
                onChange={(value) => updateFormField('smokingPreference', value)}
                options={SMOKING_OPTIONS}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <SelectField
                label="Pets"
                value={formState.petPreference}
                onChange={(value) => updateFormField('petPreference', value)}
                options={PET_OPTIONS}
              />
            </div>

            <MultiSelectField
              label="Must-have features"
              options={MUST_HAVE_OPTIONS}
              selectedValues={formState.mustHaves}
              onToggle={(value) => toggleArrayField('mustHaves', value)}
            />

            <TextAreaField
              label="Special needs"
              value={formState.customNeeds}
              onChange={(value) => updateFormField('customNeeds', value)}
              placeholder="Near a specific train, flexible guarantor, wants in-unit W/D, etc."
            />

            <TextAreaField
              label="Notes"
              value={formState.notes}
              onChange={(value) => updateFormField('notes', value)}
              placeholder="Broker follow-up notes and soft context."
              rows={5}
            />
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="submit"
              className="rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
            >
              {editingClientId ? 'Save changes' : 'Create client'}
            </button>

            {editingClientId ? (
              <button
                type="button"
                onClick={handleDelete}
                className="rounded-full border border-[var(--line)] bg-white/80 px-5 py-2.5 text-sm font-medium text-[var(--text-main)] transition hover:border-[var(--line-strong)] hover:bg-white"
              >
                Delete client
              </button>
            ) : null}
          </div>
        </form>

        <div className="flex flex-col gap-4">
          <section className="glass-panel rounded-[32px] p-5 sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-muted)]">
                  Client Pipeline
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-[var(--text-main)]">
                  Search and review clients
                </h2>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  value={searchValue}
                  onChange={(event) => setSearchValue(event.target.value)}
                  placeholder="Search name, contact, or area"
                  className="w-full rounded-2xl border border-[var(--line)] bg-white/80 px-4 py-3 text-sm text-[var(--text-main)] outline-none transition focus:border-[var(--line-strong)] focus:bg-white sm:w-64"
                />

                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className="rounded-2xl border border-[var(--line)] bg-white/80 px-4 py-3 text-sm text-[var(--text-main)] outline-none transition focus:border-[var(--line-strong)] focus:bg-white"
                >
                  <option value="all">All statuses</option>
                  {CLIENT_STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <ToggleChip
                label="Show roommate-ready only"
                active={roommateOnlyFilter}
                onClick={() => setRoommateOnlyFilter((currentValue) => !currentValue)}
              />
            </div>

            <div className="mt-5 grid gap-4 2xl:grid-cols-[minmax(340px,380px)_minmax(0,1fr)]">
              <div className="max-h-[780px] space-y-3 overflow-y-auto pr-1 soft-scrollbar">
                {visibleClients.length > 0 ? (
                  visibleClients.map((client) => {
                    const isSelected = client.id === selectedClientId;
                    return (
                      <button
                        key={client.id}
                        type="button"
                        onClick={() => setSelectedClientId(client.id)}
                        className={`w-full rounded-[28px] border p-4 text-left transition ${
                          isSelected
                            ? 'border-[var(--accent)] bg-[rgba(220,227,210,0.5)] shadow-panel'
                            : 'border-[var(--line)] bg-white/75 hover:border-[var(--line-strong)] hover:bg-white'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="text-lg font-semibold text-[var(--text-main)]">
                              {client.name}
                            </h3>
                            <p className="mt-1 text-sm text-[var(--text-muted)]">
                              {client.contact || 'No contact added yet'}
                            </p>
                          </div>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${getStatusTone(client.status)}`}
                          >
                            {getClientStatusLabel(client.status)}
                          </span>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                          <DetailTag>{formatBudgetRange(client)}</DetailTag>
                          <DetailTag>{formatMoveInDate(client.moveInDate)}</DetailTag>
                          <DetailTag>
                            {client.roommateInterest === 'no' ? 'Solo search' : 'Open to match'}
                          </DetailTag>
                        </div>

                        <p className="mt-4 text-sm text-[var(--text-muted)]">
                          {client.areas.join(', ')}
                        </p>
                      </button>
                    );
                  })
                ) : (
                  <div className="rounded-[28px] border border-dashed border-[var(--line)] bg-white/60 px-5 py-8 text-sm text-[var(--text-muted)]">
                    No clients match the current filters.
                  </div>
                )}
              </div>

              <div className="glass-panel min-h-[420px] rounded-[28px] p-5">
                {selectedClient ? (
                  <>
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-muted)]">
                          Selected client
                        </p>
                        <h3 className="mt-2 text-2xl font-semibold text-[var(--text-main)]">
                          {selectedClient.name}
                        </h3>
                        <p className="mt-2 text-sm text-[var(--text-muted)]">
                          {selectedClient.contact || 'No contact details added'}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => startEditClient(selectedClient)}
                        className="rounded-full border border-[var(--line)] bg-white/80 px-4 py-2 text-sm font-medium text-[var(--text-main)] transition hover:border-[var(--line-strong)] hover:bg-white"
                      >
                        Edit in form
                      </button>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                      <DetailTag>{formatBudgetRange(selectedClient)}</DetailTag>
                      <DetailTag>{formatMoveInDate(selectedClient.moveInDate)}</DetailTag>
                      <DetailTag>{selectedClient.areas.join(', ')}</DetailTag>
                    </div>

                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                      {(() => {
                        const meta = getClientMeta(selectedClient);
                        return (
                          <>
                            <DetailTag>Roommate: {meta.roommateLabel}</DetailTag>
                            <DetailTag>Layout: {meta.layoutLabel}</DetailTag>
                            <DetailTag>Gender: {meta.genderLabel}</DetailTag>
                            <DetailTag>Prefers: {meta.roommateGenderLabel}</DetailTag>
                            <DetailTag>Occupation: {meta.occupationLabel}</DetailTag>
                            <DetailTag>Lifestyle: {meta.lifestyleLabel}</DetailTag>
                            <DetailTag>Schedule: {meta.scheduleLabel}</DetailTag>
                            <DetailTag>Smoking: {meta.smokingLabel}</DetailTag>
                            <DetailTag>Pets: {meta.petLabel}</DetailTag>
                          </>
                        );
                      })()}
                    </div>

                    {selectedClient.mustHaves.length > 0 ? (
                      <div className="mt-6">
                        <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
                          Must-haves
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {selectedClient.mustHaves.map((need) => (
                            <DetailTag key={need}>{getMustHaveLabel(need)}</DetailTag>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    {selectedClient.customNeeds ? (
                      <div className="mt-6 rounded-[24px] border border-[var(--line)] bg-white/70 p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
                          Special needs
                        </p>
                        <p className="mt-2 text-sm leading-6 text-[var(--text-main)]">
                          {selectedClient.customNeeds}
                        </p>
                      </div>
                    ) : null}

                    {selectedClient.notes ? (
                      <div className="mt-4 rounded-[24px] border border-[var(--line)] bg-white/70 p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
                          Notes
                        </p>
                        <p className="mt-2 text-sm leading-6 text-[var(--text-main)]">
                          {selectedClient.notes}
                        </p>
                      </div>
                    ) : null}

                    <div className="mt-6 border-t border-[var(--line)] pt-6">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-muted)]">
                            Roommate suggestions
                          </p>
                          <h4 className="mt-2 text-xl font-semibold text-[var(--text-main)]">
                            Auto-ranked matches
                          </h4>
                        </div>
                      </div>

                      {selectedClient.roommateInterest === 'no' ? (
                        <div className="mt-4 rounded-[24px] border border-dashed border-[var(--line)] bg-white/60 px-4 py-5 text-sm text-[var(--text-muted)]">
                          This client is marked as solo only, so roommate suggestions are hidden.
                        </div>
                      ) : matchSuggestions.length > 0 ? (
                        <div className="mt-4 space-y-3">
                          {matchSuggestions.map((match) => (
                            <div
                              key={match.client.id}
                              className="rounded-[24px] border border-[var(--line)] bg-white/80 p-4"
                            >
                              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                <div>
                                  <div className="flex items-center gap-3">
                                    <h5 className="text-lg font-semibold text-[var(--text-main)]">
                                      {match.client.name}
                                    </h5>
                                    <span className="rounded-full bg-[rgba(35,66,50,0.12)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--accent)]">
                                      {match.score} match
                                    </span>
                                  </div>
                                  <p className="mt-1 text-sm text-[var(--text-muted)]">
                                    {match.client.contact || 'No contact details added'}
                                  </p>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => setSelectedClientId(match.client.id)}
                                  className="rounded-full border border-[var(--line)] bg-white px-4 py-2 text-sm font-medium text-[var(--text-main)] transition hover:border-[var(--line-strong)]"
                                >
                                  View client
                                </button>
                              </div>

                              <div className="mt-3 flex flex-wrap gap-2">
                                <DetailTag>{formatBudgetRange(match.client)}</DetailTag>
                                <DetailTag>{formatMoveInDate(match.client.moveInDate)}</DetailTag>
                                <DetailTag>{match.sharedAreas.join(', ')}</DetailTag>
                              </div>

                              <ul className="mt-4 space-y-2 text-sm leading-6 text-[var(--text-muted)]">
                                {match.reasons.map((reason) => (
                                  <li key={reason}>• {reason}</li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="mt-4 rounded-[24px] border border-dashed border-[var(--line)] bg-white/60 px-4 py-5 text-sm text-[var(--text-muted)]">
                          No strong roommate matches yet. Add more clients or widen budget, area,
                          or timing filters.
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="flex h-full min-h-[360px] items-center justify-center rounded-[24px] border border-dashed border-[var(--line)] bg-white/60 px-6 text-center text-sm text-[var(--text-muted)]">
                    Select a client from the list to review preferences and roommate matches.
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

export default ClientsPage;
