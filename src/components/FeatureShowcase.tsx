import { useState } from 'react';
import { RotateCw, Github, BarChart3, ArrowRight } from 'lucide-react';
import { RevisionPreview, GitHubPreview, AnalyticsPreview, DashboardPreview, type PreviewType } from '@/components/ProductPreview';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { SectionHeader } from '@/components/ui/Section';

const features: {
  id: PreviewType;
  label: string;
  title: string;
  tagline: string;
  icon: typeof RotateCw;
  points: string[];
}[] = [
  {
    id: 'revision',
    label: 'Smart Revision',
    title: 'Never let solved problems become forgotten problems.',
    tagline: 'A spaced-repetition scheduler surfaces the right problem at the right time — before you forget the approach.',
    icon: RotateCw,
    points: ['Adaptive intervals per topic', 'Due today, tomorrow, upcoming', 'Recall accuracy tracking'],
  },
  {
    id: 'github',
    label: 'GitHub Sync',
    title: 'Turn your daily practice into a developer portfolio.',
    tagline: 'Every solved problem auto-syncs to GitHub as a clean, organized commit. Your portfolio builds itself.',
    icon: Github,
    points: ['Auto-commit with topic structure', 'README generation', 'Repository health tracking'],
  },
  {
    id: 'analytics',
    label: 'Learning Analytics',
    title: 'Understand what you actually know.',
    tagline: 'See your learning activity, revision success rate, topic mastery, and weak spots — all in one view.',
    icon: BarChart3,
    points: ['Weekly activity tracking', 'Weak topic detection', 'Revision success trends'],
  },
];

const previewComponents: Record<PreviewType, typeof RevisionPreview> = {
  dashboard: DashboardPreview,
  revision: RevisionPreview,
  github: GitHubPreview,
  analytics: AnalyticsPreview,
};

export default function FeatureShowcase() {
  const [active, setActive] = useState<PreviewType>('revision');
  const { ref, visible } = useScrollReveal();
  const feature = features.find((f) => f.id === active)!;
  const ActivePreview = previewComponents[active];

  return (
    <section id="features" className="relative py-20 sm:py-28" ref={ref}>
      <div className="container-page">
        <div className={`reveal ${visible ? 'is-visible' : ''}`}>
          <SectionHeader
            label="Product"
            title="Built like real software. Not a feature list."
            subtitle="Click through the actual interfaces. This is what CodeLoop looks like when you use it."
          />
        </div>

        {/* Tab selector */}
        <div className={`reveal ${visible ? 'is-visible' : ''}`} style={{ transitionDelay: '100ms' }}>
          <div className="mb-8 flex flex-wrap gap-2">
            {features.map((f) => (
              <button
                key={f.id}
                onClick={() => setActive(f.id)}
                className={`inline-flex items-center gap-2 rounded-lg border px-3.5 py-2 text-sm font-medium transition-all duration-200 ${
                  active === f.id
                    ? 'border-accent-400/30 bg-accent-400/10 text-accent-300'
                    : 'border-line bg-base-850 text-ink-secondary hover:border-line-strong hover:text-ink-primary'
                }`}
              >
                <f.icon className="h-4 w-4" />
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Left: description */}
          <div className={`reveal ${visible ? 'is-visible' : ''} lg:col-span-5`} style={{ transitionDelay: '150ms' }}>
            <div key={active} className="animate-fade-in">
              <h3 className="text-xl font-semibold leading-snug text-ink-primary sm:text-2xl">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-secondary sm:text-base">
                {feature.tagline}
              </p>

              <div className="mt-6 space-y-2.5">
                {feature.points.map((point) => (
                  <div key={point} className="flex items-center gap-2.5 text-sm text-ink-secondary">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-accent-400/10">
                      <div className="h-1.5 w-1.5 rounded-full bg-accent-400" />
                    </div>
                    {point}
                  </div>
                ))}
              </div>

              <a href="#cta" className="mt-7 inline-flex items-center gap-1.5 text-sm font-medium text-accent-400 transition-colors hover:text-accent-300">
                Try it in the product
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {/* Right: product preview */}
          <div className={`reveal ${visible ? 'is-visible' : ''} lg:col-span-7`} style={{ transitionDelay: '250ms' }}>
            <div key={active} className="animate-fade-in">
              <div className="h-[420px] overflow-hidden rounded-xl">
                <ActivePreview />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
