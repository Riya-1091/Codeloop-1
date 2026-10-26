import { type ReactNode, type ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-accent-400 text-base-950 hover:bg-accent-300 hover:shadow-glow',
  secondary: 'border border-line-strong hover:bg-base-hover',
  ghost: 'hover:bg-base-hover',
  danger: 'bg-danger text-white hover:bg-danger/80',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2 text-sm gap-1.5',
  lg: 'px-5 py-2.5 text-sm gap-2',
};

export function Button({
  variant = 'secondary',
  size = 'md',
  children,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 ease-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400/40 disabled:opacity-40 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function Input({
  label,
  error,
  ...props
}: {
  label?: string;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      {label && <label className="mb-1.5 block text-sm font-medium text-ink-secondary">{label}</label>}
      <input className="input-field" {...props} />
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}

export function Textarea({
  label,
  error,
  ...props
}: {
  label?: string;
  error?: string;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div>
      {label && <label className="mb-1.5 block text-sm font-medium text-ink-secondary">{label}</label>}
      <textarea className="input-field min-h-[100px] resize-y font-mono text-xs" {...props} />
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}

export function Select({
  label,
  children,
  ...props
}: {
  label?: string;
  children: ReactNode;
} & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div>
      {label && <label className="mb-1.5 block text-sm font-medium text-ink-secondary">{label}</label>}
      <select className="input-field cursor-pointer" {...props}>
        {children}
      </select>
    </div>
  );
}

export function Tabs({
  tabs,
  active,
  onChange,
}: {
  tabs: { id: string; label: string }[];
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="flex gap-1 border-b border-line">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`relative px-3 py-2 text-sm font-medium transition-colors ${
            active === tab.id ? 'text-ink-primary' : 'text-ink-muted hover:text-ink-secondary'
          }`}
        >
          {tab.label}
          {active === tab.id && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-accent-400" />
          )}
        </button>
      ))}
    </div>
  );
}
