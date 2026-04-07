import { formatPrice } from '../lib/buildings';
import NotesEditor from './NotesEditor';

function StarIcon({ active }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill={active ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <path d="m12 3.6 2.6 5.28 5.82.85-4.21 4.11.99 5.8L12 16.9l-5.2 2.74.99-5.8L3.58 9.73l5.82-.85L12 3.6Z" />
    </svg>
  );
}

function ContactSection({ building }) {
  const emails = building.emails ?? [];
  const phones = building.phones ?? [];

  if (emails.length === 0 && phones.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 rounded-[28px] border border-[var(--line)] bg-white/82 p-4">
      <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">Leasing Contact</p>

      {emails.length > 0 ? (
        <div className="mt-3 space-y-2">
          {emails.map((email) => (
            <a
              key={email}
              href={`mailto:${email}`}
              className="block rounded-2xl bg-[var(--bg-soft)] px-3 py-3 text-sm text-pine transition hover:bg-sage"
            >
              {email}
            </a>
          ))}
        </div>
      ) : null}

      {phones.length > 0 ? (
        <div className="mt-3 space-y-2">
          {phones.map((phone) => (
            <a
              key={phone}
              href={`tel:${phone}`}
              className="block rounded-2xl bg-[var(--bg-soft)] px-3 py-3 text-sm text-pine transition hover:bg-sage"
            >
              {phone}
            </a>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function DetailPanel({
  building,
  isFavorite,
  noteValue,
  onClose,
  onOpenWebsite,
  onCopyLink,
  onToggleFavorite,
  onNoteChange,
}) {
  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-[rgba(29,36,31,0.18)] backdrop-blur-[2px] transition-opacity duration-300 lg:hidden ${
          building ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed inset-x-0 bottom-0 z-50 max-h-[82vh] rounded-t-[28px] border-x border-t border-[var(--line)] bg-[rgba(250,248,242,0.97)] p-5 shadow-[0_-24px_60px_rgba(29,36,31,0.14)] backdrop-blur-xl transition-transform duration-300 lg:absolute lg:inset-y-0 lg:right-0 lg:left-auto lg:max-h-none lg:w-full lg:max-w-[380px] lg:rounded-none lg:rounded-l-[30px] lg:border-x-0 lg:border-y-0 lg:border-l lg:shadow-[0_24px_60px_rgba(29,36,31,0.14)] ${
          building
            ? 'translate-y-0 lg:translate-x-0'
            : 'translate-y-full lg:translate-y-0 lg:translate-x-full'
        }`}
      >
        {building ? (
          <div className="flex max-h-[calc(82vh-2.5rem)] flex-col overflow-y-auto pr-1 soft-scrollbar lg:max-h-full lg:h-full lg:overflow-visible lg:pr-0">
            <div className="mx-auto mb-4 h-1.5 w-14 rounded-full bg-[rgba(35,66,50,0.18)] lg:hidden" />
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-muted)]">Building Detail</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--text-main)] lg:text-3xl">
                {building.name}
              </h2>
            </div>

            <button
              type="button"
              className="min-h-11 rounded-full border border-[var(--line)] bg-white/80 px-3 py-2 text-sm text-[var(--text-muted)] transition hover:border-[var(--line-strong)] hover:bg-white"
              onClick={onClose}
            >
              Close
            </button>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-[24px] border border-[var(--line)] bg-white/80 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Area</p>
              <p className="mt-2 text-lg font-semibold">{building.area}</p>
            </div>
            <div className="rounded-[24px] border border-[var(--line)] bg-white/80 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Price</p>
              <p className="mt-2 text-lg font-semibold">{formatPrice(building.price)}</p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {building.op ? (
              <span className="rounded-full border border-[rgba(35,66,50,0.08)] bg-[rgba(220,227,210,0.72)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-pine">
                {building.op}
              </span>
            ) : null}
            {building.type.length > 0 ? (
              building.type.map((unitType) => (
                <span
                  key={unitType}
                  className="rounded-full border border-[var(--line)] bg-[var(--bg-soft)] px-3 py-1 text-xs font-medium text-[var(--text-muted)]"
                >
                  {unitType}
                </span>
              ))
            ) : (
              <span className="rounded-full border border-dashed border-[var(--line)] bg-[var(--bg-soft)] px-3 py-1 text-xs font-medium text-[var(--text-muted)]">
                Type info pending
              </span>
            )}
            {building.flags?.map((flag) => (
              <span
                key={flag}
                className="rounded-full border border-[rgba(35,66,50,0.08)] bg-[rgba(245,241,232,0.96)] px-3 py-1 text-xs font-medium text-[var(--text-main)]"
              >
                {flag}
              </span>
            ))}
          </div>

          <div className="mt-6 grid gap-3">
            <button
              type="button"
              className={`min-h-11 rounded-full px-4 py-3 text-sm font-semibold transition ${
                building.website
                  ? 'bg-pine text-white hover:bg-moss'
                  : 'cursor-not-allowed bg-[var(--bg-soft)] text-[var(--text-muted)]'
              }`}
              onClick={() => onOpenWebsite(building.website)}
              disabled={!building.website}
            >
              {building.website ? 'Open Official Website' : 'Official Website Pending'}
            </button>
            <button
              type="button"
              className={`min-h-11 rounded-full border px-4 py-3 text-sm font-semibold transition ${
                building.website
                  ? 'border-[var(--line)] bg-white text-[var(--text-main)] hover:border-[var(--line-strong)]'
                  : 'cursor-not-allowed border-[var(--line)] bg-[var(--bg-soft)] text-[var(--text-muted)]'
              }`}
              onClick={() => onCopyLink(building.website)}
              disabled={!building.website}
            >
              Copy Link
            </button>
            <button
              type="button"
              className={`min-h-11 flex items-center justify-center gap-2 rounded-full border px-4 py-3 text-sm font-semibold transition ${
                isFavorite
                  ? 'border-pine bg-pine text-white'
                  : 'border-[var(--line)] bg-white text-[var(--text-main)] hover:border-[var(--line-strong)]'
              }`}
              onClick={() => onToggleFavorite(building.id)}
            >
              <StarIcon active={isFavorite} />
              {isFavorite ? 'Favorited' : 'Favorite'}
            </button>
          </div>

          <ContactSection building={building} />

          <div className="mt-6 flex-1">
            <NotesEditor
              value={noteValue}
              onChange={(nextValue) => onNoteChange(building.id, nextValue)}
            />
          </div>
          </div>
        ) : (
          <div className="hidden h-full items-center justify-center lg:flex">
            <div className="max-w-xs text-center">
              <p className="font-serif text-4xl leading-none text-pine">Map Notes</p>
              <p className="mt-4 text-sm leading-6 text-[var(--text-muted)]">
                Select a building marker or card to open details, copy the site link, and save your
                leasing notes.
              </p>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}

export default DetailPanel;
