/* components/ui/Chip.jsx */
export default function Chip({ label, active, disabled, onClick, className = '' }) {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        style={
          active
            ? { background: '#2563eb', color: '#fff', borderColor: '#2563eb' }
            : undefined
        }
        className={[
        'inline-flex px-3 py-1 text-sm rounded border text-left transition',
          disabled && !active ? 'opacity-40 cursor-not-allowed' : '',
          className
        ].join(' ')}
      >
        {label}
      </button>
    );
  }