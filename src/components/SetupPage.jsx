function SetupPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-[960px] items-center px-4 py-10 sm:px-6 lg:px-8">
      <section className="glass-panel w-full rounded-[36px] p-7 sm:p-10">
        <p className="text-xs uppercase tracking-[0.28em] text-[var(--text-muted)]">
          Supabase Setup Required
        </p>
        <h1 className="mt-4 text-3xl font-semibold text-[var(--text-main)] sm:text-4xl">
          Add your Supabase project keys before using broker login.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--text-muted)]">
          This app now expects Supabase Auth and a `clients` table. Add the project URL and anon
          key to a local `.env` file, then run the SQL in `supabase/clients.sql`.
        </p>

        <div className="mt-8 rounded-[28px] border border-[var(--line)] bg-white/75 p-5">
          <p className="text-sm font-semibold text-[var(--text-main)]">Required environment</p>
          <pre className="mt-3 overflow-x-auto rounded-[20px] bg-[var(--bg-soft)] px-4 py-4 text-sm text-[var(--text-main)]">
{`VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key`}
          </pre>
        </div>

        <div className="mt-6 rounded-[28px] border border-[var(--line)] bg-white/75 p-5">
          <p className="text-sm font-semibold text-[var(--text-main)]">Next step</p>
          <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">
            After adding the env vars, restart the dev server. Once the SQL schema is applied in
            Supabase, sign up with a broker email and each account will only see its own clients.
          </p>
        </div>
      </section>
    </main>
  );
}

export default SetupPage;
