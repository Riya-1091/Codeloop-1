import { ArrowRight } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export default function CTA() {
  const { ref, visible } = useScrollReveal();

  return (
    <section id="cta" className="relative py-20 sm:py-28" ref={ref}>
      <div className="container-page">
        <div className={`reveal ${visible ? 'is-visible' : ''}`}>
          <div className="relative overflow-hidden rounded-2xl border border-line bg-base-900 p-10 text-center sm:p-16">
            {/* Background */}
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute inset-0 grid-bg opacity-30" />
              <div className="absolute left-1/2 top-1/2 h-[200px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-500/[0.08] blur-3xl" />
            </div>

            <div className="relative">
              <h2 className="text-3xl font-semibold tracking-tight text-ink-primary sm:text-4xl md:text-5xl">
                Don't just solve it.
                <br />
                <span className="text-gradient">Remember it.</span>
              </h2>
              <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-ink-secondary sm:text-lg">
                Turn daily coding practice into long-term learning
                and a stronger developer profile.
              </p>
              <div className="mt-8 flex justify-center">
                <a href="#" className="btn-primary px-6 py-2.5 text-base">
                  Start Building
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
              <p className="mt-4 text-2xs text-ink-muted">Free to start · No card required</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
