export default function SectionToggle({
    question, open, setOpen, children, note, setNote,
  }) {
    return (
      <div className="border rounded p-4 space-y-3">
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={open}
            onChange={e => setOpen(e.target.checked)}
          />
          <span className="font-medium">{question}</span>
        </label>
  
        {open && (
          <>
            <div className="flex flex-wrap gap-2">{children}</div>
            {note !== undefined && (
              <textarea
                rows={2}
                className="w-full rounded border p-2 text-sm mt-2"
                placeholder="Add note (optional)"
                value={note}
                onChange={e => setNote(e.target.value)}
              />
            )}
          </>
        )}
      </div>
    );
  }