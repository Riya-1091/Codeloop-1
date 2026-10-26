import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Trophy, AlertTriangle } from 'lucide-react';
import { getClass, getClassLeaderboard, type DbClass } from '@/lib/api';
import { PageHeader, Avatar, EmptyState } from '@/components/ui/Section';

interface Row {
  id: string;
  name: string;
  email: string;
  stats: { solved_total: number; revision_success_rate: number; current_streak: number } | null;
}

export default function ClassLeaderboard() {
  const { classId } = useParams<{ classId: string }>();
  const [cls, setCls] = useState<DbClass | null>(null);
  const [leaderboard, setLeaderboard] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!classId) return;
    Promise.all([getClass(classId), getClassLeaderboard(classId)])
      .then(([c, l]) => { setCls(c); setLeaderboard(l as Row[]); })
      .catch(() => setCls(null))
      .finally(() => setLoading(false));
  }, [classId]);

  if (loading) return null;

  if (!cls) {
    return <EmptyState icon={AlertTriangle} title="Class not found" description="This class may have been removed." />;
  }

  if (leaderboard.length === 0) {
    return (
      <div>
        <PageHeader title="Leaderboard" subtitle={cls.name} />
        <EmptyState icon={Trophy} title="No students yet" description="The leaderboard will appear once students enroll and start solving problems." />
      </div>
    );
  }

  const rankStyles = [
    'flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 text-2xs font-bold text-base-950',
    'flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-slate-300 to-slate-500 text-2xs font-bold text-base-950',
    'flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-2xs font-bold text-base-950',
  ];

  return (
    <div>
      <PageHeader
        title="Class Leaderboard"
        subtitle={`${cls.name} · Ranking based on problems solved + streak`}
      />

      <div className="mb-4 rounded-lg border border-line bg-base-850/50 p-3 text-2xs text-ink-muted">
        Score = Problems Solved + (Current Streak × 2). Live, computed from real submissions.
      </div>

      <div className="card hidden overflow-hidden sm:block">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-line text-2xs uppercase tracking-wider text-ink-faint">
              <th className="px-4 py-3 font-medium">Rank</th>
              <th className="px-4 py-3 font-medium">Student</th>
              <th className="px-4 py-3 font-medium">Solved</th>
              <th className="px-4 py-3 font-medium">Revision Success</th>
              <th className="px-4 py-3 font-medium">Streak</th>
              <th className="px-4 py-3 font-medium">Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line/60">
            {leaderboard.map((s, i) => {
              const solved = s.stats?.solved_total ?? 0;
              const streak = s.stats?.current_streak ?? 0;
              const score = solved + streak * 2;
              return (
                <tr key={s.id} className="transition-colors hover:bg-base-hover">
                  <td className="px-4 py-3">
                    {i < 3 ? <div className={rankStyles[i]}>{i + 1}</div> : <span className="text-sm font-medium text-ink-muted">{i + 1}</span>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={s.name || s.email} size={28} />
                      <div>
                        <div className="font-medium text-ink-primary">{s.name || '—'}</div>
                        <div className="text-2xs text-ink-muted">{s.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-ink-primary">{solved}</td>
                  <td className="px-4 py-3 text-ink-secondary">{s.stats?.revision_success_rate ?? 0}%</td>
                  <td className="px-4 py-3 text-ink-secondary">{streak}d</td>
                  <td className="px-4 py-3 font-semibold text-accent-400">{score}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="space-y-2 sm:hidden">
        {leaderboard.map((s, i) => {
          const solved = s.stats?.solved_total ?? 0;
          const streak = s.stats?.current_streak ?? 0;
          const score = solved + streak * 2;
          return (
            <div key={s.id} className="card flex items-center gap-3 p-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center">
                {i < 3 ? <div className={rankStyles[i]}>{i + 1}</div> : <span className="text-sm font-medium text-ink-muted">{i + 1}</span>}
              </div>
              <Avatar name={s.name || s.email} size={32} />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-ink-primary">{s.name || s.email}</div>
                <div className="text-2xs text-ink-muted">{solved} solved · {streak}d streak</div>
              </div>
              <span className="font-semibold text-accent-400">{score}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
