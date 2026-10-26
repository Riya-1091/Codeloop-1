import { visionStages } from '@/data/mockData';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { SectionHeader } from '@/components/ui/Section';
import { Sparkles } from 'lucide-react';

const statusConfig = {
  live: { label: 'Live', badge: 'badge-success', dot: 'bg-success' },
  next: { label: 'In Progress', badge: 'badge-accent', dot: 'bg-accent-400' },
  planned: { label: 'Planned', badge: 'badge-neutral', dot: 'bg-ink-muted' },
};

export default function Vision() {
  const { ref, visible } = useScrollReveal();

  return (
    <section id="vision" className="relative py-20 sm:py-28" ref={ref}>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[300px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-500/[0.04] blur-3xl" />
      </div>
      <div className="container-page relative">
        <div className={`reveal ${visible ? 'is-visible' : ''}`}>
          <SectionHeader
            label="Vision"
            title="From solving problems to building a developer career."
            subtitle="CodeLoop starts as a DSA revision tool and grows into a personal learning operating system. Here's where it's going."
          />
        </div>

        <div className={`reveal ${visible ? 'is-visible' : ''}`} style={{ transitionDelay: '150ms' }}>
          <div className="relative">
            {/* Connecting line */}
            <div className="absolute left-4 top-0 bottom-0 w-px bg-line sm:left-6">
              <div className="h-full w-full bg-gradient-to-b from-success via-accent-400 to-ink-faint" />
            </div>

            <div className="space-y-4">
              {visionStages.map((stage) => {
                const config = statusConfig[stage.status as keyof typeof statusConfig];
                return (
                  <div
                    key={stage.stage}
                    className="relative flex items-start gap-4 pl-10 sm:pl-16"
                  >
                    {/* Node */}
                    <div className="absolute left-0 top-0 flex h-8 w-8 items-center justify-center sm:h-12 sm:w-12">
                      <div className={`flex h-3 w-3 items-center justify-center rounded-full ${config.dot} ring-4 ring-base-950 sm:h-4 sm:w-4`}>
                        {stage.status === 'live' && <div className="h-1.5 w-1.5 rounded-full bg-base-950 sm:h-2 sm:w-2" />}
                      </div>
                    </div>

                    {/* Card */}
                    <div className="card flex-1 p-4 transition-all duration-200 hover:border-line-strong sm:p-5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-2xs font-medium text-ink-muted">{stage.stage}</span>
                        <span className={`badge ${config.badge}`}>{config.label}</span>
                      </div>
                      <h3 className="mt-2 text-base font-semibold text-ink-primary sm:text-lg">{stage.title}</h3>
                      <p className="mt-1 text-sm text-ink-secondary">{stage.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Closing statement */}
        <div className={`reveal ${visible ? 'is-visible' : ''} mt-12 text-center`} style={{ transitionDelay: '300ms' }}>
          <div className="inline-flex items-center gap-2 rounded-full border border-line bg-base-850/60 px-4 py-2">
            <Sparkles className="h-4 w-4 text-accent-400" />
            <span className="text-sm font-medium text-ink-secondary">A learning OS for developers</span>
          </div>
          <p className="mx-auto mt-4 max-w-md text-lg font-semibold leading-snug text-ink-primary sm:text-xl">
            From solving problems
            <br />
            to building a developer career.
          </p>
        </div>
      </div>
    </section>
  );
}
