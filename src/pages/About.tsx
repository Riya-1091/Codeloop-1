import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Brain, Briefcase, ArrowRight } from 'lucide-react';
import { PageHeader } from '@/components/ui/Section';
import { workflowSteps, visionStages } from '@/data/mockData';
import { team, aboutUs, type TeamMember } from '@/data/team';

export default function About() {
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="About CodeLoop" subtitle="Why CodeLoop exists and where it's going." />

      {/* The problem */}
      <div className="card mb-4 p-5">
        <h2 className="mb-3 text-sm font-semibold text-ink-primary">The Problem</h2>
        <p className="text-sm leading-relaxed text-ink-secondary">
          Developers solve hundreds of coding problems on platforms like LeetCode and GeeksforGeeks,
          but many disappear into old submissions, unused GitHub repositories, and forgotten notes.
          The effort stays — the learning doesn't.
        </p>
      </div>

      {/* The mission */}
      <div className="card mb-4 p-5">
        <h2 className="mb-3 text-sm font-semibold text-ink-primary">Our Mission</h2>
        <p className="text-sm leading-relaxed text-ink-secondary">
          Turn coding practice into long-term learning. CodeLoop captures solved problems,
          revises them intelligently, builds your GitHub portfolio, and showcases your learning journey —
          all in one place.
        </p>
      </div>

      {/* About us / team */}
      <div className="card mb-4 p-5">
        <h2 className="mb-3 text-sm font-semibold text-ink-primary">About Us</h2>
        <p className="text-sm leading-relaxed text-ink-secondary">{aboutUs}</p>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {team.map((m) => (
            <TeamCard key={m.name} member={m} />
          ))}
        </div>
      </div>

      {/* Workflow */}
      <div className="card mb-4 p-5">
        <h2 className="mb-4 text-sm font-semibold text-ink-primary">The Learning Loop</h2>
        <div className="space-y-2">
          {workflowSteps.map((step) => (
            <div key={step.id} className="flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-400/10">
                <span className="font-mono text-xs font-semibold text-accent-400">{step.num}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-ink-primary">{step.title}</span>
                <span className="ml-2 text-xs text-ink-muted">{step.detail}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Vision */}
      <div className="card mb-4 p-5">
        <h2 className="mb-4 text-sm font-semibold text-ink-primary">Where We're Going</h2>
        <div className="space-y-3">
          {visionStages.map((stage) => {
            return (
              <div key={stage.stage} className="flex items-start gap-3">
                <div className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${
                  stage.status === 'live' ? 'bg-success/10' : stage.status === 'next' ? 'bg-accent-400/10' : 'bg-base-800'
                }`}>
                  {stage.status === 'live' && <CheckCircle className="h-3.5 w-3.5 text-success" />}
                  {stage.status === 'next' && <Brain className="h-3.5 w-3.5 text-accent-400" />}
                  {stage.status === 'planned' && <Briefcase className="h-3.5 w-3.5 text-ink-muted" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-2xs text-ink-faint">{stage.stage}</span>
                    <span className="text-sm font-medium text-ink-primary">{stage.title}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-ink-secondary">{stage.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <div className="card p-5 text-center">
        <p className="text-sm font-medium text-ink-primary">Ready to start your learning loop?</p>
        <Link to="/signup" className="btn-primary mt-3">
          Get Started
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}

function CheckCircle({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
      <path d="M22 4L12 14.01l-3-3" />
    </svg>
  );
}

function TeamCard({ member }: { member: TeamMember }) {
  const [failed, setFailed] = useState(false);
  const initials = member.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
  return (
    <div className="rounded-xl border border-line bg-base-900 p-4 text-center">
      <div className="mx-auto aspect-[4/5] w-40 max-w-full overflow-hidden rounded-2xl border border-line bg-base-800">
        {failed ? (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-accent-400 to-accent-600 text-4xl font-semibold text-base-950">
            {initials}
          </div>
        ) : (
          <img
            src={member.photo}
            alt={member.name}
            className="h-full w-full object-cover"
            style={{ objectPosition: member.position || 'center top' }}
            loading="lazy"
            onError={() => setFailed(true)}
          />
        )}
      </div>
      <p className="mt-3 text-sm font-semibold text-ink-primary">{member.name}</p>
      <p className="mt-0.5 text-xs text-ink-muted">{member.detail}</p>
    </div>
  );
}
