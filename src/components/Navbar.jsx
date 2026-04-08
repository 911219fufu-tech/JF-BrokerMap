import { useState } from 'react';
import { formatPrice } from '../lib/buildings';

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5v5l3.5 2" />
    </svg>
  );
}

function Navbar({ favoriteCount, recentBuildings, onSelectBuilding }) {
  const [isRecentOpen, setIsRecentOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[rgba(35,66,50,0.08)] bg-[rgba(250,248,242,0.84)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <div>
            <p className="font-serif text-3xl leading-none text-pine">JF BrokerMap</p>
            <p className="mt-1 text-xs uppercase tracking-[0.28em] text-[var(--text-muted)]">
              Personal Leasing Dashboard
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden rounded-full border border-[var(--line)] bg-white/75 px-4 py-2 text-sm text-[var(--text-muted)] sm:block">
            {favoriteCount} starred
          </div>

          <div className="relative">
            <button
              type="button"
              className="flex items-center gap-2 rounded-full border border-[var(--line)] bg-white/80 px-4 py-2 text-sm font-medium text-[var(--text-main)] transition hover:border-[var(--line-strong)] hover:bg-white"
              onClick={() => setIsRecentOpen((current) => !current)}
            >
              <ClockIcon />
              Recent Views
            </button>

            {isRecentOpen ? (
              <div className="absolute right-0 mt-2 w-72 rounded-3xl border border-[var(--line)] bg-[rgba(250,248,242,0.98)] p-3 shadow-panel">
                {recentBuildings.length > 0 ? (
                  <div className="space-y-2">
                    {recentBuildings.map((building) => (
                      <button
                        key={building.id}
                        type="button"
                        className="w-full rounded-2xl border border-transparent bg-white/80 px-3 py-3 text-left transition hover:border-[var(--line)] hover:bg-white"
                        onClick={() => {
                          onSelectBuilding(building.id);
                          setIsRecentOpen(false);
                        }}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="font-medium">{building.name}</span>
                          <span className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
                            {building.area}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-[var(--text-muted)]">
                          {formatPrice(building.price)}
                        </p>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="rounded-2xl bg-white/75 px-4 py-5 text-sm text-[var(--text-muted)]">
                    Recently opened buildings will appear here.
                  </p>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
