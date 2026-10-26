import { useScrollReveal } from '@/hooks/useScrollReveal';
import { ArrowRight, RotateCw, Repeat } from 'lucide-react';

export default function ProblemSection() {
  const { ref, visible } = useScrollReveal();

  return (
    <section id="problem" className="relative py-20 sm:py-28" ref={ref}>
      <div className="container-page">
        <div className={`reveal ${visible ? 'is-visible' : ''}`}>
          <span className="section-label">The Problem</span>
          <h2 className="max-w-2xl text-2xl font-semibold tracking-tight text-ink-primary sm:text-3xl md:text-4xl">
            You solved it.
            <br />
            But will you remember it?
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-secondary sm:text-lg">
            Developers solve hundreds of problems, but many disappear into old submissions,
            unused GitHub repositories, and forgotten notes. The effort stays — the learning doesn't.
          </p>
        </div>

        {/* Visual transformation */}
        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {/* Before: SOLVE → FORGET → REPEAT */}
          <div className={`reveal ${visible ? 'is-visible' : ''}`} style={{ transitionDelay: '150ms' }}>
            <div className="mb-4 flex items-center gap-2">
              <Repeat className="h-4 w-4 text-ink-muted" />
              <span className="text-xs font-mono uppercase tracking-widest text-ink-muted">The loop nobody wants</span>
            </div>
            <div className="card p-6">
              <div className="space-y-1">
                {['Solve', 'Forget', 'Repeat'].map((step, i) => (
                  <div key={step}>
                    <div className="flex items-center gap-3 rounded-lg border border-line bg-base-850/60 px-4 py-3">
                      <span className="font-mono text-2xs text-ink-faint">0{i + 1}</span>
                      <span className="text-sm font-medium text-ink-secondary">{step}</span>
                      <span className="ml-auto text-2xs text-ink-faint">
                        {i === 0 && 'Hours of effort'}
                        {i === 1 && 'Gone in weeks'}
                        {i === 2 && 'Start over'}
                      </span>
                    </div>
                    {i < 2 && (
                      <div className="flex justify-center py-1">
                        <div className="h-3 w-px bg-line-strong" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Arrow */}
          <div className="hidden items-center justify-center lg:absolute lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-base-900">
              <ArrowRight className="h-4 w-4 text-accent-400" />
            </div>
          </div>

          {/* After: the real loop */}
          <div className={`reveal ${visible ? 'is-visible' : ''}`} style={{ transitionDelay: '300ms' }}>
            <div className="mb-4 flex items-center gap-2">
              <RotateCw className="h-4 w-4 text-accent-400" />
              <span className="text-xs font-mono uppercase tracking-widest text-accent-400">The CodeLoop</span>
            </div>
            <div className="card border-accent-400/20 p-6">
              <div className="space-y-1">
                {['Solve', 'Save', 'Revise', 'Build', 'Showcase'].map((step, i) => (
                  <div key={step}>
                    <div className="flex items-center gap-3 rounded-lg border border-line bg-base-850/60 px-4 py-3 transition-colors hover:border-accent-400/30 hover:bg-accent-400/[0.03]">
                      <span className="font-mono text-2xs text-accent-400">0{i + 1}</span>
                      <span className="text-sm font-medium text-ink-primary">{step}</span>
                      <span className="ml-auto text-2xs text-ink-muted">
                        {i === 0 && 'Anywhere'}
                        {i === 1 && 'One click'}
                        {i === 2 && 'Spaced repetition'}
                        {i === 3 && 'Auto-sync'}
                        {i === 4 && 'Public profile'}
                      </span>
                    </div>
                    {i < 4 && (
                      <div className="flex justify-center py-1">
                        <div className="h-3 w-px bg-accent-400/30" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
