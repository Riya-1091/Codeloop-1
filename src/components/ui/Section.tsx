import { type ReactNode } from 'react';

export function Section({
  id,
  children,
  className = '',
}: {
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`relative py-20 sm:py-28 ${className}`}>
      {children}
    </section>
  );
}

export function SectionHeader({
  label,
  title,
  subtitle,
  center = false,
}: {
  label?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  center?: boolean;
}) {
  return (
    <div className={`mb-12 ${center ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}`}>
      {label && <span className="section-label">{label}</span>}
      <h2 className="text-2xl font-semibold tracking-tight text-ink-primary sm:text-3xl md:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base leading-relaxed text-ink-secondary sm:text-lg">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export function DifficultyBadge({ difficulty }: { difficulty: 'Easy' | 'Medium' | 'Hard' }) {
  if (difficulty === 'Easy')
    return <span className="badge badge-success">Easy</span>;
  if (difficulty === 'Medium')
    return <span className="badge badge-warning">Medium</span>;
  return <span className="badge badge-danger">Hard</span>;
}

export function ProgressBar({ pct, accent = false }: { pct: number; accent?: boolean }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-base-700">
      <div
        className={`h-full rounded-full transition-all duration-700 ease-out ${
          accent ? 'bg-accent-400' : 'bg-ink-muted'
        }`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export function Logo({ className = '', showText = true }: { className?: string; showText?: boolean }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative flex h-7 w-7 items-center justify-center">
        <svg viewBox="0 0 28 28" className="h-7 w-7" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="2" width="24" height="24" rx="7" stroke="#2dd4bf" strokeWidth="1.5" />
          <path d="M9 10c-2 0-3.5 1.5-3.5 4s1.5 4 3.5 4" stroke="#2dd4bf" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M19 10c2 0 3.5 1.5 3.5 4s-1.5 4-3.5 4" stroke="#2dd4bf" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="14" cy="14" r="2" fill="#2dd4bf" />
        </svg>
      </div>
      {showText && <span className="font-semibold tracking-tight text-ink-primary">CodeLoop</span>}
    </div>
  );
}

export function LogoLink({ to = '/' }: { to?: string }) {
  return (
    <a href={to} className="flex items-center" aria-label="CodeLoop home">
      <Logo />
    </a>
  );
}

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-ink-primary sm:text-2xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-ink-secondary">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function StatCard({
  icon: Icon,
  label,
  value,
  suffix,
  accent = false,
}: {
  icon: typeof import('lucide-react').Flame;
  label: string;
  value: string | number;
  suffix?: string;
  accent?: boolean;
}) {
  return (
    <div className="card p-4">
      <div className="mb-2 flex items-center gap-2">
        <Icon className={`h-4 w-4 ${accent ? 'text-accent-400' : 'text-ink-muted'}`} />
        <span className="text-2xs font-medium text-ink-muted">{label}</span>
      </div>
      <div className="flex items-baseline gap-0.5">
        <span className="text-2xl font-semibold text-ink-primary">{value}</span>
        {suffix && <span className="text-xs text-ink-muted">{suffix}</span>}
      </div>
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: typeof import('lucide-react').Inbox;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-line py-16 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-base-800">
        <Icon className="h-6 w-6 text-ink-muted" />
      </div>
      <h3 className="text-sm font-semibold text-ink-primary">{title}</h3>
      <p className="mt-1 max-w-xs text-sm text-ink-secondary">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'An unexpected error occurred. Please try again.',
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-danger/30 py-16 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-danger/10">
        <svg viewBox="0 0 24 24" className="h-6 w-6 text-danger" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        </svg>
      </div>
      <h3 className="text-sm font-semibold text-ink-primary">{title}</h3>
      <p className="mt-1 max-w-xs text-sm text-ink-secondary">{description}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-secondary mt-4">
          Retry
        </button>
      )}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="card animate-pulse p-4">
      <div className="mb-3 h-4 w-24 rounded bg-base-700" />
      <div className="h-8 w-16 rounded bg-base-700" />
    </div>
  );
}

export function Avatar({ name, size = 32 }: { name: string; size?: number }) {
  const initials = name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent-400 to-accent-600 font-semibold text-base-950"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
      aria-label={name}
    >
      {initials}
    </div>
  );
}
