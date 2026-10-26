import { ArrowRight, Play } from 'lucide-react';
import { DashboardPreview } from '@/components/ProductPreview';

export default function Hero() {
  return (
    <section id="product" className="relative overflow-hidden pt-28 sm:pt-32">
      {/* Background layers */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 grid-bg opacity-40 mask-fade-b" />
        <div className="absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-accent-500/[0.06] blur-3xl" />
      </div>

      <div className="container-page relative">
        {/* Top label */}
        <div className="mb-6 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-line bg-base-850/60 px-3 py-1 text-2xs font-medium text-ink-secondary backdrop-blur-sm">
            <span className="flex h-1.5 w-1.5 rounded-full bg-success animate-pulse-soft" />
            A learning OS for developers
          </div>
        </div>

        {/* Headline */}
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight text-ink-primary sm:text-5xl md:text-6xl">
            Turn Every Coding Problem
            <br />
            <span className="text-gradient">Into Long-Term Learning.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-ink-secondary sm:text-lg">
            CodeLoop helps developers capture solved problems, revise them intelligently,
            build their GitHub portfolio, and showcase their learning journey — all in one place.
          </p>

          {/* CTAs */}
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a href="#cta" className="btn-primary w-full justify-center sm:w-auto">
              Start Building
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
            <a href="#workflow" className="btn-secondary w-full justify-center sm:w-auto">
              <Play className="h-3.5 w-3.5" />
              See How It Works
            </a>
          </div>
        </div>

        {/* Product preview */}
        <div className="relative mt-12 sm:mt-16">
          <div className="pointer-events-none absolute -inset-x-8 -top-4 bottom-0 rounded-2xl bg-gradient-to-b from-accent-500/[0.04] to-transparent blur-2xl" />
          <div
            className="relative mx-auto max-w-4xl animate-fade-up"
            style={{ animationDelay: '300ms', opacity: 0, animationFillMode: 'forwards' }}
          >
            {/* Window chrome */}
            <div className="mb-0 flex items-center gap-2 rounded-t-xl border border-b-0 border-line bg-base-850 px-4 py-2.5">
              <div className="flex gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-danger/40" />
                <div className="h-2.5 w-2.5 rounded-full bg-warning/40" />
                <div className="h-2.5 w-2.5 rounded-full bg-success/40" />
              </div>
              <div className="mx-auto flex items-center gap-1.5 rounded-md border border-line bg-base-900 px-3 py-0.5">
                <span className="text-2xs font-mono text-ink-muted">app.codeloop.dev/dashboard</span>
              </div>
            </div>
            {/* Dashboard */}
            <div className="h-[420px] overflow-hidden rounded-b-xl border border-line shadow-float sm:h-[460px]">
              <DashboardPreview />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
