import { useEffect, useState } from 'react';
import { Flame, CheckCircle2, TrendingUp, Layers, Award } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getUserStats, listProblems, type UserStats, type DbProblem } from '@/lib/api';
import { PageHeader, StatCard, ProgressBar } from '@/components/ui/Section';
import { PremiumOverlay } from '@/components/ui/PremiumOverlay';

export default function Analytics() {
  const { user, isPremium } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [problems, setProblems] = useState<DbProblem[]>([]);

  useEffect(() => {
    if (!user) return;
    getUserStats(user.id).then(setStats);
    listProblems(user.id).then(setProblems);
  }, [user?.id]);

  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const weeklyActivity = weekDays.map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - ((d.getDay() + 6) % 7) + i);
    return problems.filter((p) => new Date(p.solved_at).toDateString() === d.toDateString()).length;
  });
  const maxWeekly = Math.max(1, ...weeklyActivity);

  // Last 12 weeks bucketed
  const monthlyActivity = Array.from({ length: 12 }, (_, i) => {
    const weeksAgo = 11 - i;
    const start = new Date();
    start.setDate(start.getDate() - weeksAgo * 7 - 7);
    const end = new Date();
    end.setDate(end.getDate() - weeksAgo * 7);
    return problems.filter((p) => {
      const d = new Date(p.solved_at);
      return d > start && d <= end;
    }).length;
  });
  const maxMonthly = Math.max(1, ...monthlyActivity);

  const totalDiff = Math.max(1, (stats?.solved_easy ?? 0) + (stats?.solved_medium ?? 0) + (stats?.solved_hard ?? 0));

  const topicMap = new Map<string, number>();
  problems.forEach((p) => topicMap.set(p.topic, (topicMap.get(p.topic) || 0) + 1));
  const topicList = Array.from(topicMap.entries()).map(([topic, solved]) => ({ topic, solved }));
  const maxTopicSolved = Math.max(1, ...topicList.map((t) => t.solved));
  const topicPerformance = [...topicList].sort((a, b) => b.solved - a.solved).slice(0, 6);
  const leastPracticed = [...topicList].sort((a, b) => a.solved - b.solved).slice(0, 4);

  // Revisions completed per week, last 7 weeks
  const revisionTrend = Array.from({ length: 7 }, (_, i) => {
    const weeksAgo = 6 - i;
    const start = new Date();
    start.setDate(start.getDate() - weeksAgo * 7 - 7);
    const end = new Date();
    end.setDate(end.getDate() - weeksAgo * 7);
    return problems.filter((p) => p.last_reviewed_at && new Date(p.last_reviewed_at) > start && new Date(p.last_reviewed_at) <= end).length;
  });
  const maxRevisionTrend = Math.max(1, ...revisionTrend);

  return (
    <div>
      <PageHeader title="Analytics" subtitle="Understand what you actually know." />

      {/* Top stats */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard icon={CheckCircle2} label="Problems Solved" value={stats?.solved_total ?? 0} />
        <StatCard icon={TrendingUp} label="Revision Success" value={`${stats?.revision_success_rate ?? 0}%`} accent />
        <StatCard icon={Flame} label="Current Streak" value={`${stats?.current_streak ?? 0}d`} />
        <StatCard icon={Award} label="Longest Streak" value={`${stats?.longest_streak ?? 0}d`} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Weekly activity */}
        <div className="card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-ink-primary">Weekly Activity</h3>
            <span className="text-2xs text-ink-muted">This week</span>
          </div>
          <div className="flex h-40 items-end gap-2">
            {weeklyActivity.map((val, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-2xs font-medium text-ink-secondary">{val}</span>
                <div
                  className="w-full rounded-sm bg-gradient-to-t from-accent-600 to-accent-400 transition-all duration-700"
                  style={{ height: `${(val / maxWeekly) * 100}%` }}
                />
                <span className="text-2xs text-ink-faint">{weekDays[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly activity */}
        <div className="card relative overflow-hidden p-5">
          {!isPremium && <PremiumOverlay label="Full analytics is Premium" />}
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-ink-primary">Monthly Activity</h3>
            <span className="text-2xs text-ink-muted">Last 12 weeks</span>
          </div>
          <div className="flex h-40 items-end gap-1">
            {monthlyActivity.map((val, i) => (
              <div key={i} className="flex flex-1 flex-col items-center">
                <div
                  className="w-full rounded-sm bg-ink-muted/40 transition-all duration-700 hover:bg-accent-400/60"
                  style={{ height: `${(val / maxMonthly) * 100}%` }}
                  title={`${val} problems`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        {/* Difficulty distribution */}
        <div className="card p-5">
          <h3 className="mb-4 text-sm font-semibold text-ink-primary">Difficulty Distribution</h3>
          <div className="space-y-3">
            {([
              { label: 'Easy', count: stats?.solved_easy ?? 0, color: 'bg-success' },
              { label: 'Medium', count: stats?.solved_medium ?? 0, color: 'bg-warning' },
              { label: 'Hard', count: stats?.solved_hard ?? 0, color: 'bg-danger' },
            ]).map((d) => (
              <div key={d.label}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="font-medium text-ink-secondary">{d.label}</span>
                  <span className="text-ink-muted">{d.count} ({Math.round((d.count / totalDiff) * 100)}%)</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-base-700">
                  <div className={`h-full rounded-full ${d.color}`} style={{ width: `${(d.count / totalDiff) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Topic performance */}
        <div className="card relative overflow-hidden p-5">
          {!isPremium && <PremiumOverlay label="Full analytics is Premium" />}
          <h3 className="mb-4 text-sm font-semibold text-ink-primary">Topic Performance</h3>
          {topicPerformance.length === 0 && <p className="text-xs text-ink-muted">No problems logged yet.</p>}
          <div className="space-y-2.5">
            {topicPerformance.map((t) => (
              <div key={t.topic}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="font-medium text-ink-secondary">{t.topic}</span>
                  <span className="text-ink-muted">{t.solved} solved</span>
                </div>
                <ProgressBar pct={Math.round((t.solved / maxTopicSolved) * 100)} accent={t.solved / maxTopicSolved >= 0.7} />
              </div>
            ))}
          </div>
        </div>

        {/* Least practiced topics */}
        <div className="card relative overflow-hidden p-5">
          {!isPremium && <PremiumOverlay label="Full analytics is Premium" />}
          <div className="mb-4 flex items-center gap-2">
            <Layers className="h-4 w-4 text-warning" />
            <h3 className="text-sm font-semibold text-ink-primary">Least Practiced</h3>
          </div>
          {leastPracticed.length === 0 && <p className="text-xs text-ink-muted">No problems logged yet.</p>}
          <div className="space-y-3">
            {leastPracticed.map((t) => (
              <div key={t.topic} className="flex items-center justify-between">
                <span className="text-xs font-medium text-ink-secondary">{t.topic}</span>
                <span className="text-2xs text-warning">{t.solved} solved</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revision retention */}
      <div className="card relative mt-4 overflow-hidden p-5">
        {!isPremium && <PremiumOverlay label="Full analytics is Premium" />}
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-ink-primary">Revisions Completed</h3>
          <span className="text-2xs text-ink-muted">Last 7 weeks</span>
        </div>
        <div className="flex h-32 items-end gap-2">
          {revisionTrend.map((val, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
              <span className="text-2xs font-medium text-ink-secondary">{val}</span>
              <div
                className="w-full rounded-sm bg-accent-400/60 transition-all duration-700"
                style={{ height: `${(val / maxRevisionTrend) * 100}%` }}
              />
              <span className="text-2xs text-ink-faint">W{i + 1}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
