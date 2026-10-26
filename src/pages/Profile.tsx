import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, CheckCircle2, RotateCw, Github, Edit3, Code2, TrendingUp, Award, Flame as Flame2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, ProgressBar } from '@/components/ui/Section';
import { getUserStats, listProblems, type UserStats, type DbProblem } from '@/lib/api';

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [problems, setProblems] = useState<DbProblem[]>([]);

  useEffect(() => {
    if (!user) return;
    getUserStats(user.id).then(setStats);
    listProblems(user.id).then(setProblems);
  }, [user?.id]);

  const topicMap = new Map<string, number>();
  problems.forEach((p) => topicMap.set(p.topic, (topicMap.get(p.topic) || 0) + 1));
  const topTopics = Array.from(topicMap.entries())
    .map(([topic, count]) => ({ topic, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);
  const maxTopic = Math.max(1, ...topTopics.map((t) => t.count));

  const achievements = [
    { title: '7-Day Streak', desc: 'Solved problems 7 days in a row', icon: Flame2, unlocked: (stats?.current_streak ?? 0) >= 7 || (stats?.longest_streak ?? 0) >= 7 },
    { title: '100 Problems', desc: 'Solved 100 problems total', icon: CheckCircle2, unlocked: (stats?.solved_total ?? 0) >= 100 },
    { title: 'Revision Master', desc: 'Completed 50 revisions', icon: RotateCw, unlocked: (stats?.revision_total ?? 0) >= 50 },
    { title: 'GitHub Connected', desc: 'Synced a solution to GitHub', icon: Github, unlocked: (stats?.github_syncs ?? 0) > 0 },
  ];

  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const weeklyActivity = weekDays.map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - ((d.getDay() + 6) % 7) + i);
    return problems.filter((p) => new Date(p.solved_at).toDateString() === d.toDateString()).length;
  });
  const maxActivity = Math.max(1, ...weeklyActivity);

  return (
    <div>
      {/* Profile header */}
      <div className="card mb-4 p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar name={user?.name || 'U'} size={64} />
            <div>
              <h1 className="text-lg font-semibold text-ink-primary">{user?.name}</h1>
              <p className="text-sm text-ink-muted">@{user?.username}</p>
              <p className="mt-1 text-xs text-ink-faint">{user?.email}</p>
            </div>
          </div>
          <button onClick={() => navigate('/settings')} className="btn-secondary">
            <Edit3 className="h-3.5 w-3.5" />
            Edit Profile
          </button>
        </div>
        {user?.bio && (
          <div className="mt-4 border-t border-line pt-4">
            <p className="text-sm text-ink-secondary">{user.bio}</p>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="card p-4">
          <div className="mb-2 flex items-center gap-2">
            <Code2 className="h-4 w-4 text-ink-muted" />
            <span className="text-2xs font-medium text-ink-muted">Problems Solved</span>
          </div>
          <span className="text-2xl font-semibold text-ink-primary">{stats?.solved_total ?? 0}</span>
        </div>
        <div className="card p-4">
          <div className="mb-2 flex items-center gap-2">
            <Flame className="h-4 w-4 text-accent-400" />
            <span className="text-2xs font-medium text-ink-muted">Current Streak</span>
          </div>
          <span className="text-2xl font-semibold text-ink-primary">{stats?.current_streak ?? 0}</span>
        </div>
        <div className="card p-4">
          <div className="mb-2 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-ink-muted" />
            <span className="text-2xs font-medium text-ink-muted">Revision Success</span>
          </div>
          <span className="text-2xl font-semibold text-ink-primary">{stats?.revision_success_rate ?? 0}%</span>
        </div>
        <div className="card p-4">
          <div className="mb-2 flex items-center gap-2">
            <Github className="h-4 w-4 text-ink-muted" />
            <span className="text-2xs font-medium text-ink-muted">GitHub Syncs</span>
          </div>
          <span className="text-2xl font-semibold text-ink-primary">{stats?.github_syncs ?? 0}</span>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Top topics */}
        <div className="card p-5">
          <h3 className="mb-4 text-sm font-semibold text-ink-primary">Top Topics</h3>
          {topTopics.length === 0 && <p className="text-xs text-ink-muted">Solve a few problems to see your top topics.</p>}
          <div className="space-y-3">
            {topTopics.map((t) => (
              <div key={t.topic}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="font-medium text-ink-secondary">{t.topic}</span>
                  <span className="text-ink-muted">{t.count} problems</span>
                </div>
                <ProgressBar pct={Math.min((t.count / maxTopic) * 100, 100)} accent />
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="card p-5">
          <h3 className="mb-4 text-sm font-semibold text-ink-primary">Achievements</h3>
          <div className="grid grid-cols-2 gap-3">
            {achievements.map((a) => {
              const Icon = a.icon || Award;
              return (
                <div key={a.title} className={`rounded-lg border p-3 ${a.unlocked ? 'border-line bg-base-850/50' : 'border-line-soft opacity-40'}`}>
                  <div className={`mb-2 flex h-8 w-8 items-center justify-center rounded-lg ${a.unlocked ? 'bg-accent-400/10' : 'bg-base-800'}`}>
                    <Icon className={`h-4 w-4 ${a.unlocked ? 'text-accent-400' : 'text-ink-muted'}`} />
                  </div>
                  <div className="text-xs font-semibold text-ink-primary">{a.title}</div>
                  <div className="mt-0.5 text-2xs text-ink-muted">{a.desc}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Learning activity */}
      <div className="card mt-4 p-5">
        <h3 className="mb-4 text-sm font-semibold text-ink-primary">Learning Activity</h3>
        <div className="flex h-32 items-end gap-2">
          {weeklyActivity.map((val, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
              <div
                className="w-full rounded-sm bg-gradient-to-t from-accent-600 to-accent-400 transition-all duration-700"
                style={{ height: `${(val / maxActivity) * 100}%` }}
              />
              <span className="text-2xs text-ink-faint">{weekDays[i]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
