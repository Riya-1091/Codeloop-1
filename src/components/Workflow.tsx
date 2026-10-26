import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { workflowSteps } from '@/data/mockData';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { SectionHeader } from '@/components/ui/Section';

export default function Workflow() {
  const [active, setActive] = useState(0);
  const { ref, visible } = useScrollReveal();
  const step = workflowSteps[active];

  return (
    <section id="workflow" className="relative py-20 sm:py-28" ref={ref}>
      <div className="pointer-events-none absolute inset-0 dot-bg opacity-20" />
      <div className="container-page relative">
        <div className={`reveal ${visible ? 'is-visible' : ''}`}>
          <SectionHeader
            label="How It Works"
            title={
              <>
                From one solved problem
                <br />
                to a complete learning loop.
              </>
            }
          />
        </div>

        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Timeline */}
          <div className={`reveal min-w-0 lg:col-span-5 ${visible ? 'is-visible' : ''}`} style={{ transitionDelay: '100ms' }}>
            <div className="relative">
              {/* Vertical progress line */}
              <div className="absolute left-[15px] top-2 bottom-2 w-px bg-line sm:left-[19px]">
                <div
                  className="w-full bg-gradient-to-b from-accent-400 to-accent-600 transition-all duration-700 ease-smooth"
                  style={{ height: `${(active / (workflowSteps.length - 1)) * 100}%` }}
                />
              </div>

              <div className="space-y-1">
                {workflowSteps.map((s, i) => (
                  <button
                    key={s.id}
                    onClick={() => setActive(i)}
                    className="group relative flex w-full items-start gap-3 rounded-lg p-2 text-left transition-colors sm:gap-4 sm:p-3"
                    aria-label={`Step ${s.num}: ${s.title}`}
                  >
                    <div
                      className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300 sm:h-10 sm:w-10 ${
                        i <= active
                          ? 'border-accent-400 bg-accent-400/10'
                          : 'border-line bg-base-900'
                      }`}
                    >
                      <span
                        className={`font-mono text-xs font-semibold transition-colors ${
                          i <= active ? 'text-accent-300' : 'text-ink-faint'
                        }`}
                      >
                        {s.num}
                      </span>
                    </div>
                    <div className="flex-1 pt-1">
                      <div
                        className={`text-sm font-semibold transition-colors sm:text-base ${
                          i === active ? 'text-ink-primary' : i < active ? 'text-ink-secondary' : 'text-ink-muted'
                        }`}
                      >
                        {s.title}
                      </div>
                      <div
                        className={`mt-0.5 text-2xs transition-all sm:text-xs ${
                          i === active ? 'text-ink-secondary opacity-100' : 'text-ink-faint opacity-0 sm:opacity-60'
                        }`}
                      >
                        {i === active ? s.desc : s.title}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Product preview panel */}
          <div className={`reveal min-w-0 lg:col-span-7 ${visible ? 'is-visible' : ''}`} style={{ transitionDelay: '200ms' }}>
            <div className="card relative min-h-[320px] overflow-hidden p-5 sm:p-6">
              <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-accent-500/[0.05] blur-2xl" />

              {/* Step indicator */}
              <div className="mb-4 flex items-center gap-2">
                <span className="font-mono text-xs font-medium text-accent-400">{step.num}</span>
                <div className="h-px flex-1 bg-line" />
                <span className="text-2xs text-ink-muted">{active + 1} / {workflowSteps.length}</span>
              </div>

              {/* Animated content */}
              <div key={active} className="animate-fade-in">
                <h3 className="text-lg font-semibold text-ink-primary sm:text-xl">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-secondary">{step.detail}</p>

                {/* Mock UI for this step */}
                <div className="mt-5 rounded-lg border border-line bg-base-900 p-3.5">
                  <div className="mb-2 flex items-center gap-2 border-b border-line pb-2">
                    <div className="flex gap-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-danger/40" />
                      <div className="h-1.5 w-1.5 rounded-full bg-warning/40" />
                      <div className="h-1.5 w-1.5 rounded-full bg-success/40" />
                    </div>
                    <span className="font-mono text-2xs text-ink-muted">codeloop — {step.title.toLowerCase()}</span>
                  </div>
                  <div className="space-y-2 font-mono text-2xs leading-relaxed">
                    {active === 0 && (
                      <>
                        <div className="text-ink-muted">$ leetcode solve two-sum</div>
                        <div className="text-success">✓ Accepted — Runtime: 0ms, beats 100%</div>
                        <div className="text-ink-secondary">→ Problem detected on LeetCode</div>
                        <div className="text-accent-400">→ Ready to save in CodeLoop</div>
                      </>
                    )}
                    {active === 1 && (
                      <>
                        <div className="text-ink-muted">Capturing problem...</div>
                        <div className="text-ink-secondary">title: "Two Sum"</div>
                        <div className="text-ink-secondary">topic: Hashing · difficulty: Easy</div>
                        <div className="text-ink-secondary">approach: Hash map O(n)</div>
                        <div className="text-success">✓ Saved to CodeLoop</div>
                      </>
                    )}
                    {active === 2 && (
                      <>
                        <div className="text-ink-muted">Scheduling revision...</div>
                        <div className="text-ink-secondary">Recall accuracy: 80%</div>
                        <div className="text-warning">→ Next revision: in 4 days</div>
                        <div className="text-ink-secondary">→ Interval: 1d → 4d → 9d</div>
                        <div className="text-success">✓ Added to revision queue</div>
                      </>
                    )}
                    {active === 3 && (
                      <>
                        <div className="text-ink-muted">Syncing to GitHub...</div>
                        <div className="text-ink-secondary">repo: codeloop-dsa</div>
                        <div className="text-accent-400">commit: "feat: add two_sum.py"</div>
                        <div className="text-ink-secondary">path: /hashing/two_sum.py</div>
                        <div className="text-success">✓ Pushed to main</div>
                      </>
                    )}
                    {active === 4 && (
                      <>
                        <div className="text-ink-muted">Updating public profile...</div>
                        <div className="text-ink-secondary">problems: 124 · streak: 27</div>
                        <div className="text-ink-secondary">topics: Arrays, Hashing, Trees...</div>
                        <div className="text-success">✓ Profile live at /u/dev</div>
                        <div className="text-accent-400">→ Ready to share</div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Next button */}
              <div className="mt-5 flex items-center justify-between">
                <button
                  onClick={() => setActive(Math.max(0, active - 1))}
                  disabled={active === 0}
                  className="btn-ghost disabled:opacity-30"
                >
                  Previous
                </button>
                <button
                  onClick={() => setActive(Math.min(workflowSteps.length - 1, active + 1))}
                  disabled={active === workflowSteps.length - 1}
                  className="btn-primary disabled:opacity-30"
                >
                  Next Step
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
