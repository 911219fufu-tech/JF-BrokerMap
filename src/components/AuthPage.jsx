import { useState } from 'react';
import { supabase } from '../lib/supabase';

function AuthTab({ active, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-medium transition ${
        active
          ? 'bg-[var(--accent)] text-white'
          : 'border border-[var(--line)] bg-white/80 text-[var(--text-main)] hover:border-[var(--line-strong)] hover:bg-white'
      }`}
    >
      {label}
    </button>
  );
}

function AuthPage() {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setStatusMessage('');

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Email and password are required.');
      return;
    }

    if (mode === 'signup' && password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          throw error;
        }

        setStatusMessage('Logged in.');
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: window.location.origin,
          },
        });

        if (error) {
          throw error;
        }

        if (data.session) {
          setStatusMessage('Account created and logged in.');
        } else {
          setStatusMessage('Account created. Check your email to confirm the account, then log in.');
        }
      }
    } catch (error) {
      setErrorMessage(error.message || 'Authentication failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-[1200px] items-center px-4 py-10 sm:px-6 lg:px-8">
      <section className="grid w-full gap-4 lg:grid-cols-[minmax(0,1.2fr)_420px]">
        <div className="glass-panel rounded-[36px] p-7 sm:p-10">
          <p className="text-xs uppercase tracking-[0.28em] text-[var(--text-muted)]">
            Broker Workspace
          </p>
          <h1 className="mt-4 max-w-2xl text-4xl font-semibold leading-tight text-[var(--text-main)] sm:text-5xl">
            Secure client matching, with every broker seeing only their own leads.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-[var(--text-muted)]">
            Sign in to access the leasing dashboard and your client requirement page. Client
            records are stored in Supabase and scoped per account, so brokers cannot see each
            other&apos;s pipeline.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-[24px] border border-[var(--line)] bg-white/75 p-4">
              <p className="text-sm font-semibold text-[var(--text-main)]">Cloud sync</p>
              <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                Client records follow your login across devices.
              </p>
            </div>
            <div className="rounded-[24px] border border-[var(--line)] bg-white/75 p-4">
              <p className="text-sm font-semibold text-[var(--text-main)]">Private data</p>
              <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                Each broker can only query and update their own clients.
              </p>
            </div>
            <div className="rounded-[24px] border border-[var(--line)] bg-white/75 p-4">
              <p className="text-sm font-semibold text-[var(--text-main)]">Match ready</p>
              <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                Roommate suggestions are ranked from your own lead pool.
              </p>
            </div>
          </div>
        </div>

        <form className="glass-panel rounded-[36px] p-6 sm:p-8" onSubmit={handleSubmit}>
          <div className="flex items-center gap-2">
            <AuthTab active={mode === 'login'} label="Login" onClick={() => setMode('login')} />
            <AuthTab active={mode === 'signup'} label="Sign up" onClick={() => setMode('signup')} />
          </div>

          <h2 className="mt-6 text-2xl font-semibold text-[var(--text-main)]">
            {mode === 'login' ? 'Welcome back' : 'Create broker access'}
          </h2>
          <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
            {mode === 'login'
              ? 'Log in to open your portfolio and client workspace.'
              : 'Create a private broker account backed by Supabase Auth.'}
          </p>

          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                Email
              </label>
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-2xl border border-[var(--line)] bg-white/80 px-4 py-3 text-sm text-[var(--text-main)] outline-none transition focus:border-[var(--line-strong)] focus:bg-white"
                placeholder="broker@example.com"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                Password
              </label>
              <input
                type="password"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-2xl border border-[var(--line)] bg-white/80 px-4 py-3 text-sm text-[var(--text-main)] outline-none transition focus:border-[var(--line-strong)] focus:bg-white"
                placeholder="At least 6 characters"
              />
            </div>

            {mode === 'signup' ? (
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                  Confirm password
                </label>
                <input
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="w-full rounded-2xl border border-[var(--line)] bg-white/80 px-4 py-3 text-sm text-[var(--text-main)] outline-none transition focus:border-[var(--line-strong)] focus:bg-white"
                  placeholder="Re-enter password"
                />
              </div>
            ) : null}
          </div>

          {errorMessage ? (
            <div className="mt-5 rounded-[24px] border border-[rgba(164,78,54,0.2)] bg-[rgba(164,78,54,0.08)] px-4 py-3 text-sm text-[var(--text-main)]">
              {errorMessage}
            </div>
          ) : null}

          {statusMessage ? (
            <div className="mt-5 rounded-[24px] border border-[var(--line)] bg-[rgba(35,66,50,0.08)] px-4 py-3 text-sm text-[var(--text-main)]">
              {statusMessage}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 w-full rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-65"
          >
            {isSubmitting
              ? 'Working...'
              : mode === 'login'
                ? 'Log in'
                : 'Create account'}
          </button>
        </form>
      </section>
    </main>
  );
}

export default AuthPage;
