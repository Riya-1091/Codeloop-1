import { useEffect, useState } from 'react';
import { Users, CheckCircle2, TrendingUp, Flame } from 'lucide-react';
import { getProblemsForClasses, type StaffProblemRow } from '@/lib/api';
import { StatCard, ProgressBar, EmptyState, Avatar } from '@/components/ui/Section';

type Students = Awaited<ReturnType<typeof getProblemsForClasses>>['students'];

export function AnalyticsView({ classIds }: { classIds: string[] }) {
  const [problems, setProblems] = useState<StaffProblemRow[]>([]);
  const [students, setStudents] = useState<Students>([]);
  const [loading, setLoading] = useState(true);
  const key = classIds.join(',');

  useEffect(() => {
    setLoading(true);
    getProblemsForClasses(classIds)
      .then((r) => { setProblems(r.problems); setStudents(r.students); })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  if (loading) return null;
  if (students.length === 0) {
    return <EmptyState icon={Users} title="No student data yet" description="Analytics appear once students join a class and start solving problems." />;
  }

  const total = problems.length;
  const easy = problems.filter((p) => p.difficulty === 'Easy').length;
  const medium = problems.filter((p) => p.difficulty === 'Medium').length;
  const hard = problems.filter((p) => p.difficulty === 'Hard').length;
  const diffTotal = Math.max(1, easy + medium + hard);
  const avgRevision = Math.round(students.reduce((s, x) => s + (x.stats?.revision_success_rate ?? 0), 0) / students.length);
  const activeStreaks = students.filter((s) => (s.stats?.current_streak ?? 0) > 0).length;

  const topicMap = new Map<string, number>();
  problems.forEach((p) => topicMap.set(p.topic, (topicMap.get(p.topic) || 0) + 1));
  const topics = Array.from(topicMap.entries()).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const maxTopic = Math.max(1, ...topics.map((t) => t[1]));

  const weekly = Array.from({ length: 8 }, (_, i) => {
    const weeksAgo = 7 - i;
    const end = new Date(); end.setDate(end.getDate() - weeksAgo * 7);
    const start = new Date(end); start.setDate(start.getDate() - 7);
    return problems.filter((p) => { const d = new Date(p.solved_at); return d > start && d <= end; }).length;
  });
  const maxWeekly = Math.max(1, ...weekly);

  const needHelp = students
    .filter((s) => (s.stats?.current_streak ?? 0) === 0)
    .sort((a, b) => (a.stats?.solved_total ?? 0) - (b.stats?.solved_total ?? 0))
    .slice(0, 5);

  return (
    <div>
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard icon={Users} label="Students" value={students.length} accent />
        <StatCard icon={CheckCircle2} label="Problems Solved" value={total} />
        <StatCard icon={TrendingUp} label="Avg Revision Success" value={`${avgRevision}%`} />
        <StatCard icon={Flame} label="Active Streaks" value={activeStreaks} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card p-5">
          <h3 className="mb-4 text-sm font-semibold text-ink-primary">Weekly Activity (last 8 weeks)</h3>
          <div className="flex h-36 items-end gap-2">
            {weekly.map((v, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
                <span className="text-2xs text-ink-secondary">{v}</span>
                <div className="w-full rounded-sm bg-gradient-to-t from-accent-600 to-accent-400" style={{ height: `${(v / maxWeekly) * 100}%` }} />
                <span className="text-2xs text-ink-faint">W{i + 1}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <h3 className="mb-4 text-sm font-semibold text-ink-primary">Difficulty Distribution</h3>
          <div className="space-y-3">
            {[{ l: 'Easy', c: easy, col: 'bg-success' }, { l: 'Medium', c: medium, col: 'bg-warning' }, { l: 'Hard', c: hard, col: 'bg-danger' }].map((d) => (
              <div key={d.l}>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="text-ink-secondary">{d.l}</span>
                  <span className="text-ink-muted">{d.c} ({Math.round((d.c / diffTotal) * 100)}%)</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-base-700">
                  <div className={`h-full rounded-full ${d.col}`} style={{ width: `${(d.c / diffTotal) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <h3 className="mb-4 text-sm font-semibold text-ink-primary">Topic Coverage</h3>
          {topics.length === 0 && <p className="text-xs text-ink-muted">No problems yet.</p>}
          <div className="space-y-2.5">
            {topics.map(([t, c]) => (
              <div key={t}>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="text-ink-secondary">{t}</span>
                  <span className="text-ink-muted">{c}</span>
                </div>
                <ProgressBar pct={Math.round((c / maxTopic) * 100)} accent />
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <h3 className="mb-4 text-sm font-semibold text-ink-primary">Needs Attention (no active streak)</h3>
          {needHelp.length === 0 && <p className="text-xs text-ink-muted">Everyone has an active streak. 🎉</p>}
          <div className="space-y-2">
            {needHelp.map((s) => (
              <div key={s.id} className="flex items-center justify-between rounded-lg border border-line bg-base-850/50 p-2.5">
                <div className="flex items-center gap-2.5">
                  <Avatar name={s.name || s.email} size={26} />
                  <span className="text-xs font-medium text-ink-primary">{s.name || s.email}</span>
                </div>
                <span className="text-2xs text-ink-muted">{s.stats?.solved_total ?? 0} solved</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
