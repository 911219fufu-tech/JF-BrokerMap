function NotesEditor({ value, onChange }) {
  return (
    <div className="flex h-full flex-col rounded-[28px] border border-[var(--line)] bg-white/82 p-4">
      <div>
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">Personal Notes</p>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          Save reminders like concessions, guarantor rules, OP, or follow-up notes.
        </p>
      </div>

      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Example: OP available. No guarantor. Ask for current concessions next call."
        className="mt-4 min-h-[220px] flex-1 resize-none rounded-[22px] border border-[var(--line)] bg-[var(--bg-soft)] px-4 py-4 text-sm leading-6 text-[var(--text-main)] outline-none transition focus:border-[var(--line-strong)]"
      />
    </div>
  );
}

export default NotesEditor;
