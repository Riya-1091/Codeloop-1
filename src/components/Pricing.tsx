import { Check, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { SectionHeader } from '@/components/ui/Section';
import { ALL_FEATURES_FREE, FREE_PROBLEM_LIMIT, PREMIUM_PRICE_INR, PREMIUM_PRICE_USD } from '@/lib/site';

const free = [
  `Track up to ${FREE_PROBLEM_LIMIT} problems`,
  'Daily streak and basic analytics',
  'Spaced-repetition revision (standard schedule)',
  'Join your instructor\'s classes',
  'GitHub sync (manual, auto-push and push from the Chrome extension)',
  'Chrome extension',
];
const premium = [
  'Unlimited problems',
  'Custom revision schedules',
  'Full analytics: monthly, topics, revision trend',
  'Showcase post generator',
];

export default function Pricing() {
  const { ref, visible } = useScrollReveal();

  return (
    <section id="pricing" className="relative py-20 sm:py-28" ref={ref}>
      <div className="container-page">
        <div className={`reveal ${visible ? 'is-visible' : ''}`}>
          <SectionHeader label="Pricing" title="Start free. Upgrade when you're ready." subtitle="No credit card needed to begin." center />
          {ALL_FEATURES_FREE && (
            <p className="mx-auto mt-4 w-fit rounded-full border border-accent-400/30 bg-accent-400/10 px-4 py-1.5 text-xs font-medium text-accent-400">
              Launch offer: every Premium feature is free for now
            </p>
          )}
        </div>

        <div className={`reveal ${visible ? 'is-visible' : ''} mx-auto mt-12 grid max-w-3xl gap-4 sm:grid-cols-2`} style={{ transitionDelay: '150ms' }}>
          <div className="card flex flex-col p-6">
            <h3 className="text-base font-semibold text-ink-primary">Free</h3>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-3xl font-semibold text-ink-primary">₹0</span>
              <span className="text-sm text-ink-muted">forever</span>
            </div>
            <ul className="mb-6 mt-5 flex-1 space-y-2.5">
              {free.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-ink-secondary">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-ink-muted" />
                  {f}
                </li>
              ))}
            </ul>
            <Link to="/signup" className="btn-secondary w-full justify-center">Get Started</Link>
          </div>

          <div className="card relative flex flex-col border-accent-400/40 p-6 shadow-glow">
            <span className="absolute -top-2.5 left-5 rounded-full bg-accent-400 px-2.5 py-0.5 text-2xs font-semibold text-base-950">Premium</span>
            <h3 className="text-base font-semibold text-ink-primary">Premium</h3>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-3xl font-semibold text-ink-primary">₹{PREMIUM_PRICE_INR}</span>
              <span className="text-sm text-ink-muted">/ month</span>
            </div>
            <p className="mt-1 text-xs text-ink-muted">or ${PREMIUM_PRICE_USD} / month outside India</p>
            <ul className="mb-6 mt-5 flex-1 space-y-2.5">
              {premium.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-ink-secondary">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" />
                  {f}
                </li>
              ))}
            </ul>
            <Link to="/signup" className="btn-primary w-full justify-center">
              {ALL_FEATURES_FREE ? 'Get it free for now' : 'Get Started'}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
