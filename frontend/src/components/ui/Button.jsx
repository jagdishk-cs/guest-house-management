export default function Button({
  children,
  variant = 'primary',
  className = '',
  ...props
}) {
  const variants = {
    primary: 'btn-primary',
    secondary:
      'rounded-xl border border-slate-200 bg-white px-4 py-2.5 font-medium transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700',
    danger: 'rounded-xl bg-red-500 px-4 py-2.5 font-medium text-white hover:bg-red-600',
    ghost: 'rounded-xl px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800',
  };
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
