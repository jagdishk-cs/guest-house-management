export default function Input({ label, className = '', ...props }) {
  return (
    <div className={className}>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-slate-600 dark:text-slate-400">
          {label}
        </label>
      )}
      <input className="input-field" {...props} />
    </div>
  );
}
