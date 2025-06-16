/* components/ui/Chip.jsx */
export default function Chip({
  label,
  active,
  disabled,
  onClick,
  className = '',
}) {
  const handleClick = () => {
    // ① remember where the user is
    const y = window.scrollY;

    // ② run the parent’s handler (toggling state etc.)
    onClick?.();

    // ③ on the very next paint, jump back to the same spot
    //    – keeps the viewport absolutely steady
    requestAnimationFrame(() => window.scrollTo({ top: y }));
  };

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={handleClick}
      style={
        active
          ? { background: '#2563eb', color: '#fff', borderColor: '#2563eb' }
          : undefined
      }
      className={[
        'inline-flex px-3 py-1 text-sm rounded border transition',
        disabled && !active ? 'opacity-40 cursor-not-allowed' : '',
        className,
      ].join(' ')}
    >
      {label}
    </button>
  );
}