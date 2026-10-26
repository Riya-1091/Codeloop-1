import { useEffect, useState } from 'react';
import { Activity, CheckCircle2, RotateCw, Github } from 'lucide-react';
import { getProblemsForClasses, type StaffProblemRow } from '@/lib/api';
import { EmptyState, DifficultyBadge } from '@/components/ui/Section';

interface Event { id: string; when: string; kind: 'solved' | 'revised' | 'synced'; who: string; title: string; problem: StaffProblemRow }

function timeAgo(iso: string) {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 60) return `${Math.max(mins, 0)}m ago`;
  const h = Math.floor(mins / 60);
  return h < 24 ? `${h}h ago` : `${Math.floor(h / 24)}d ago`;
}

export function ActivityView({ classIds }: { classIds: string[] }) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const key = classIds.join(',');

  useEffect(() => {
    setLoading(true);
    getProblemsForClasses(classIds)
      .then(({ problems }) => {
        const ev: Event[] = [];
        problems.forEach((p) => {
          ev.push({ id: `s-${p.id}`, when: p.solved_at, kind: 'solved', who: p.student_name, title: p.title, problem: p });
          if (p.last_reviewed_at) ev.push({ id: `r-${p.id}`, when: p.last_reviewed_at, kind: 'revised', who: p.student_name, title: p.title, problem: p });
          if (p.github_synced_at) ev.push({ id: `g-${p.id}`, when: p.github_synced_at, kind: 'synced', who: p.student_name, title: p.title, problem: p });
        });
        ev.sort((a, b) => b.when.localeCompare(a.when));
        setEvents(ev.slice(0, 50));
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  if (loading) return null;
  if (events.length === 0) {
    return <EmptyState icon={Activity} title="No activity yet" description="Student activity shows up here as soon as they solve or revise problems." />;
  }

  const icon = { solved: CheckCircle2, revised: RotateCw, synced: Github };
  const verb = { solved: 'solved', revised: 'revised', synced: 'synced to GitHub' };

  return (
    <div className="card divide-y divide-line/60">
      {events.map((e) => {
        const Icon = icon[e.kind];
        return (
          <div key={e.id} className="flex items-start gap-3 p-3.5">
            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent-400/10">
              <Icon className="h-3.5 w-3.5 text-accent-400" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm text-ink-primary">
                <span className="font-medium">{e.who}</span> <span className="text-ink-secondary">{verb[e.kind]}</span> <span className="font-medium">{e.title}</span>
              </div>
              <div className="mt-1 flex items-center gap-2 text-2xs text-ink-muted">
                <DifficultyBadge difficulty={e.problem.difficulty} />
                <span>{e.problem.topic}</span>
                <span>·</span>
                <span>{timeAgo(e.when)}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
