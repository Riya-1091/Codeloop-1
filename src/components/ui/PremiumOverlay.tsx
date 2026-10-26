import { Link } from 'react-router-dom';
import { Crown } from 'lucide-react';

// Drop inside a `relative overflow-hidden` card to blur it for free users.
export function PremiumOverlay({ label = 'Premium feature' }: { label?: string }) {
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-base-950/70 backdrop-blur-sm">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-400/15">
        <Crown className="h-4 w-4 text-accent-400" />
      </div>
      <div className="text-xs font-medium text-ink-primary">{label}</div>
      <Link to="/upgrade" className="btn-primary px-3 py-1.5 text-xs">Upgrade</Link>
    </div>
  );
}

// Full-page lock for features that are entirely Premium.
export function PremiumPage({ title, description }: { title: string; description: string }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center py-16 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent-400/10">
        <Crown className="h-6 w-6 text-accent-400" />
      </div>
      <h1 className="text-lg font-semibold text-ink-primary">{title}</h1>
      <p className="mt-2 text-sm text-ink-secondary">{description}</p>
      <Link to="/upgrade" className="btn-primary mt-5">See Premium</Link>
    </div>
  );
}
