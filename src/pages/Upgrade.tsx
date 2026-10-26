import { Check, Minus, Crown, Mail } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { PageHeader } from '@/components/ui/Section';
import { ALL_FEATURES_FREE, CONTACT_EMAIL, FREE_PROBLEM_LIMIT, PREMIUM_PRICE_INR, PREMIUM_PRICE_USD } from '@/lib/site';

const rows: { feature: string; free: string | boolean; premium: string | boolean }[] = [
  { feature: 'Problems you can track', free: `Up to ${FREE_PROBLEM_LIMIT}`, premium: 'Unlimited' },
  { feature: 'Streaks and basic analytics', free: true, premium: true },
  { feature: 'Standard revision schedule', free: true, premium: true },
  { feature: 'Join classes', free: true, premium: true },
  { feature: 'Chrome extension', free: true, premium: true },
  { feature: 'GitHub sync (manual, auto-push and extension push)', free: true, premium: true },
  { feature: 'Custom revision schedules', free: false, premium: true },
  { feature: 'Full analytics (monthly, topics, revision trend)', free: false, premium: true },
  { feature: 'Showcase post generator', free: false, premium: true },
];

function Cell({ v }: { v: string | boolean }) {
  if (v === true) return <Check className="mx-auto h-4 w-4 text-accent-400" />;
  if (v === false) return <Minus className="mx-auto h-4 w-4 text-ink-faint" />;
  return <span className="text-xs text-ink-secondary">{v}</span>;
}

export default function Upgrade() {
  const { user, isPremium } = useAuth();
  const expires = user?.planExpiresAt ? new Date(user.planExpiresAt).toLocaleDateString() : null;
  const subject = encodeURIComponent('Upgrade to CodeLoop Premium');
  const body = encodeURIComponent(`Hi, I'd like to upgrade to Premium.\nMy account email: ${user?.email}\nI'll pay in: INR (₹${PREMIUM_PRICE_INR}/month) or USD ($${PREMIUM_PRICE_USD}/month) — delete one.`);

  return (
    <div>
      <PageHeader title="Plans" subtitle="Start free. Upgrade when you outgrow it." />

      {ALL_FEATURES_FREE && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-accent-400/30 bg-accent-400/5 p-3 text-sm text-ink-primary">
          <Crown className="h-4 w-4 text-accent-400" />
          Launch offer: every Premium feature is unlocked for everyone, free, for now.
        </div>
      )}

      {!ALL_FEATURES_FREE && isPremium && user?.role === 'student' && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-accent-400/30 bg-accent-400/5 p-3 text-sm text-ink-primary">
          <Crown className="h-4 w-4 text-accent-400" />
          You're on Premium{expires ? ` until ${expires}` : ''}. Thank you!
        </div>
      )}

      <div className="card overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-line text-2xs uppercase tracking-wider text-ink-faint">
              <th className="px-4 py-3 font-medium">Feature</th>
              <th className="px-4 py-3 text-center font-medium">Free</th>
              <th className="px-4 py-3 text-center font-medium text-accent-400">Premium</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line/60">
            {rows.map((r) => (
              <tr key={r.feature}>
                <td className="px-4 py-3 text-ink-secondary">{r.feature}</td>
                <td className="px-4 py-3 text-center"><Cell v={r.free} /></td>
                <td className="px-4 py-3 text-center"><Cell v={r.premium} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!isPremium && !ALL_FEATURES_FREE && (
        <div className="card mt-4 flex flex-col items-start gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-semibold text-ink-primary">₹{PREMIUM_PRICE_INR}</span>
              <span className="text-sm text-ink-muted">/ month</span>
            </div>
            <p className="mt-1 text-xs text-ink-muted">
              or ${PREMIUM_PRICE_USD} / month if you're paying from outside India.
            </p>
            <p className="mt-1 text-xs text-ink-muted">
              Online payment is being set up. For now, email us and we'll activate Premium on your account.
            </p>
          </div>
          <a href={`mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`} className="btn-primary">
            <Mail className="h-3.5 w-3.5" />
            Request Premium
          </a>
        </div>
      )}
    </div>
  );
}
