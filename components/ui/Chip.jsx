/* components/ui/Chip.jsx
   ---------------------- */
   export default function Chip({ label, active, disabled, onClick }) {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        /* ✅ inline styles give us blue without Tailwind classes */
        style={
          active
            ? { background: '#2563eb', color: '#fff', borderColor: '#2563eb' } // blue-600
            : undefined
        }
        className={[
          'px-3 py-1 rounded-full text-sm transition select-none',
          'border',
          disabled && !active ? 'opacity-40 cursor-not-allowed' : '',
        ].join(' ')}
      >
        {label}
      </button>
    );
  }