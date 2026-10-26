import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  Flame,
  CheckCircle2,
  RotateCw,
  TrendingUp,
  ArrowRight,
  Plus,
  Github,
  BarChart3,
  GitBranch,
  CheckCircle,
  GraduationCap,
  Users,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { StatCard, PageHeader, DifficultyBadge, ProgressBar } from '@/components/ui/Section';
import { Modal } from '@/components/ui/Modal';
import {
  listProblems,
  getUserStats,
  listMyJoinedClasses,
  joinClassByCode,
  type DbProblem,
  type UserStats,
  type MyJoinedClass,
} from '@/lib/api';

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [joinOpen, setJoinOpen] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [problems, setProblems] = useState<DbProblem[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [classes, setClasses] = useState<MyJoinedClass[]>([]);
  const [loading, setLoading] = useState(true);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  const load = async () => {
    if (!user) return;
    setLoading(true);
    const [p, s, c] = await Promise.all([
      listProblems(user.id),
      getUserStats(user.id),
      listMyJoinedClasses(user.id),
    ]);
    setProblems(p);
    setStats(s);
    setClasses(c);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const handleJoin = async () => {
    if (!joinCode.trim()) {
      toast('Please enter an enrollment code.', 'warning');
      return;
    }
    try {
      const name = await joinClassByCode(joinCode.trim());
      toast(`Joined "${name}" successfully.`, 'success');
      setJoinOpen(false);
      setJoinCode('');
      load();
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Could not join class.', 'error');
    }
  };

  const revisionDue = problems.filter((p) => p.next_review_at && new Date(p.next_review_at) <= new Date());
  const recentProblems = problems.slice(0, 5);
  const githubSynced = problems.filter((p) => p.github_synced);

  const topicMap = new Map<string, { solved: number }>();
  problems.forEach((p) => {
    const t = topicMap.get(p.topic) || { solved: 0 };
    t.solved += 1;
    topicMap.set(p.topic, t);
  });
  const topicProgress = Array.from(topicMap.entries())
    .map(([topic, v]) => ({ topic, solved: v.solved, pct: Math.min(100, Math.round((v.solved / 15) * 100)) }))
    .sort((a, b) => b.solved - a.solved)
    .slice(0, 5);

  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const weeklyActivity = weekDays.map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - ((d.getDay() + 6) % 7) + i);
    const dayStr = d.toDateString();
    return problems.filter((p) => new Date(p.solved_at).toDateString() === dayStr).length;
  });
  const maxActivity = Math.max(1, ...weeklyActivity);

  return (
    <div>
      <PageHeader
        title={`${greeting}, ${user?.name?.split(' ')[0] || 'Developer'}`}
        subtitle="Here's what is happening with your learning loop."
        actions={
          <>
            <button onClick={() => navigate('/analytics')} className="btn-secondary">
              <BarChart3 className="h-3.5 w-3.5" />
              Analytics
            </button>
            <button onClick={() => navigate('/problems/new')} className="btn-primary">
              <Plus className="h-3.5 w-3.5" />
              Add Problem
            </button>
          </>
        }
      />

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard icon={Flame} label="Day Streak" value={loading ? '—' : stats?.current_streak ?? 0} accent />
        <StatCard icon={CheckCircle2} label="Problems Solved" value={loading ? '—' : stats?.solved_total ?? 0} />
        <StatCard icon={RotateCw} label="Revisions Due" value={loading ? '—' : revisionDue.length} />
        <StatCard icon={TrendingUp} label="Revision Success" value={loading ? '—' : `${stats?.revision_success_rate ?? 0}%`} />
      </div>

      {/* My Classes */}
      <div className="mb-6 card p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-accent-400" />
            <h3 className="text-sm font-semibold text-ink-primary">My Classes</h3>
          </div>
          <button onClick={() => setJoinOpen(true)} className="btn-secondary">
            <Plus className="h-3.5 w-3.5" />
            Join Class
          </button>
        </div>
        {classes.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {classes.map((c) => (
              <div key={c.id} className="rounded-lg border border-line bg-base-850/50 p-3.5">
                <div className="text-sm font-medium text-ink-primary">{c.name}</div>
                <div className="mt-1 text-2xs text-ink-muted">{c.instructor_name}</div>
                <div className="mt-2 text-2xs text-ink-faint">Joined {new Date(c.added_at).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Users className="h-6 w-6 text-ink-faint mb-2" />
            <p className="text-sm text-ink-muted">You haven't joined any classes yet.</p>
            <p className="text-2xs text-ink-faint mt-1">Ask your instructor for an enrollment code.</p>
          </div>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Revisions Due */}
        <div className="card p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-ink-primary">Revisions Due</h3>
            <button onClick={() => navigate('/revision')} className="text-2xs text-accent-400 hover:text-accent-300">
              View all →
            </button>
          </div>
          <div className="space-y-2">
            {revisionDue.length === 0 && <p className="text-xs text-ink-muted">Nothing due right now. Nice work.</p>}
            {revisionDue.slice(0, 3).map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-lg border border-line bg-base-850/50 p-2.5">
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-ink-primary">{item.title}</div>
                  <div className="mt-0.5 flex items-center gap-1.5 text-2xs text-ink-muted">
                    <span>{item.topic}</span>
                    <span>·</span>
                    <DifficultyBadge difficulty={item.difficulty} />
                  </div>
                </div>
                <button
                  onClick={() => navigate('/revision')}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-accent-400/10 text-accent-400 transition-colors hover:bg-accent-400/20"
                  aria-label="Start revision"
                >
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
          <button onClick={() => navigate('/revision')} className="btn-secondary mt-3 w-full justify-center">
            <RotateCw className="h-3.5 w-3.5" />
            Start Revision
          </button>
        </div>

        {/* Topic Progress */}
        <div className="card p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-ink-primary">Topic Progress</h3>
            <span className="text-2xs text-ink-muted">All time</span>
          </div>
          <div className="space-y-3">
            {topicProgress.length === 0 && <p className="text-xs text-ink-muted">Add problems to see topic breakdown.</p>}
            {topicProgress.map((t) => (
              <div key={t.topic}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="font-medium text-ink-secondary">{t.topic}</span>
                  <span className="text-ink-muted">{t.solved} solved</span>
                </div>
                <ProgressBar pct={t.pct} accent={t.pct >= 70} />
              </div>
            ))}
          </div>
        </div>

        {/* Learning Activity */}
        <div className="card p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-ink-primary">Learning Activity</h3>
            <span className="text-2xs text-ink-muted">This week</span>
          </div>
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
          <div className="mt-3 border-t border-line pt-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-ink-muted">Total this week</span>
              <span className="font-semibold text-ink-primary">{weeklyActivity.reduce((a, b) => a + b, 0)} problems</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Problems Table */}
      <div className="card mt-4 overflow-hidden">
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <h3 className="text-sm font-semibold text-ink-primary">Recent Problems</h3>
          <button onClick={() => navigate('/problems')} className="text-2xs text-accent-400 hover:text-accent-300">
            View all →
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-line text-2xs uppercase tracking-wider text-ink-faint">
                <th className="px-4 py-2.5 font-medium">Problem</th>
                <th className="px-4 py-2.5 font-medium">Platform</th>
                <th className="hidden px-4 py-2.5 font-medium sm:table-cell">Difficulty</th>
                <th className="hidden px-4 py-2.5 font-medium sm:table-cell">Topic</th>
                <th className="hidden px-4 py-2.5 font-medium md:table-cell">Solved</th>
                <th className="px-4 py-2.5 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60">
              {recentProblems.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-ink-muted">
                    No problems logged yet. Add your first one.
                  </td>
                </tr>
              )}
              {recentProblems.map((p) => (
                <tr
                  key={p.id}
                  onClick={() => navigate(`/problems/${p.id}`)}
                  className="cursor-pointer transition-colors hover:bg-base-hover"
                >
                  <td className="px-4 py-3 font-medium text-ink-primary">{p.title}</td>
                  <td className="px-4 py-3 text-ink-secondary">{p.platform}</td>
                  <td className="hidden px-4 py-3 sm:table-cell"><DifficultyBadge difficulty={p.difficulty} /></td>
                  <td className="hidden px-4 py-3 text-ink-secondary sm:table-cell">{p.topic}</td>
                  <td className="hidden px-4 py-3 text-ink-muted md:table-cell">{timeAgo(p.solved_at)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={p.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* GitHub Sync Status + Quick Actions */}
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="card p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Github className="h-4 w-4 text-ink-primary" />
              <h3 className="text-sm font-semibold text-ink-primary">GitHub Sync Status</h3>
            </div>
            <span className={`badge ${githubSynced.length > 0 ? 'badge-success' : 'badge-neutral'}`}>
              <CheckCircle className="h-2.5 w-2.5" />
              {githubSynced.length > 0 ? 'Synced problems' : 'Not connected'}
            </span>
          </div>
          <div className="mb-3 flex items-center gap-2 text-xs text-ink-muted">
            <GitBranch className="h-3.5 w-3.5" />
            <span>{githubSynced.length} of {problems.length} problems synced</span>
          </div>
          <div className="space-y-1.5">
            {githubSynced.slice(0, 3).map((sync) => (
              <div key={sync.id} className="flex items-center justify-between text-xs">
                <span className="text-ink-secondary">{sync.title}</span>
                <div className="flex items-center gap-2">
                  <span className="badge badge-success text-2xs">Synced</span>
                  <span className="text-2xs text-ink-muted">{sync.github_synced_at ? timeAgo(sync.github_synced_at) : ''}</span>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => navigate('/github')} className="btn-secondary mt-3 w-full justify-center">
            Manage GitHub
          </button>
        </div>

        <div className="card p-4">
          <h3 className="mb-3 text-sm font-semibold text-ink-primary">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-2.5">
            <button onClick={() => navigate('/problems/new')} className="flex flex-col items-start gap-2 rounded-lg border border-line bg-base-850/50 p-3 transition-colors hover:border-line-strong hover:bg-base-hover">
              <Plus className="h-5 w-5 text-accent-400" />
              <div>
                <div className="text-sm font-medium text-ink-primary">Add Problem</div>
                <div className="text-2xs text-ink-muted">Capture a solved problem</div>
              </div>
            </button>
            <button onClick={() => navigate('/revision')} className="flex flex-col items-start gap-2 rounded-lg border border-line bg-base-850/50 p-3 transition-colors hover:border-line-strong hover:bg-base-hover">
              <RotateCw className="h-5 w-5 text-warning" />
              <div>
                <div className="text-sm font-medium text-ink-primary">Start Revision</div>
                <div className="text-2xs text-ink-muted">{revisionDue.length} revisions due</div>
              </div>
            </button>
            <button onClick={() => navigate('/analytics')} className="flex flex-col items-start gap-2 rounded-lg border border-line bg-base-850/50 p-3 transition-colors hover:border-line-strong hover:bg-base-hover">
              <BarChart3 className="h-5 w-5 text-accent-400" />
              <div>
                <div className="text-sm font-medium text-ink-primary">View Analytics</div>
                <div className="text-2xs text-ink-muted">Track your progress</div>
              </div>
            </button>
            <button onClick={() => navigate('/github')} className="flex flex-col items-start gap-2 rounded-lg border border-line bg-base-850/50 p-3 transition-colors hover:border-line-strong hover:bg-base-hover">
              <Github className="h-5 w-5 text-ink-primary" />
              <div>
                <div className="text-sm font-medium text-ink-primary">Open GitHub</div>
                <div className="text-2xs text-ink-muted">Sync status & history</div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Join Class Modal */}
      <Modal
        open={joinOpen}
        onClose={() => setJoinOpen(false)}
        title="Join a Class"
        footer={
          <>
            <button onClick={() => setJoinOpen(false)} className="btn-secondary">Cancel</button>
            <button onClick={handleJoin} className="btn-primary">Join Class</button>
          </>
        }
      >
        <div className="space-y-3">
          <p className="text-sm text-ink-secondary">Enter the enrollment code provided by your instructor to join their class.</p>
          <input
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value)}
            placeholder="e.g. KRMU-DSA-26"
            className="input-field font-mono"
            onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
          />
        </div>
      </Modal>
    </div>
  );
}

function StatusBadge({ status }: { status: DbProblem['status'] }) {
  if (status === 'Synced') return <span className="badge badge-success">Synced</span>;
  if (status === 'Revision Due') return <span className="badge badge-warning">Revision Due</span>;
  if (status === 'Overdue') return <span className="badge badge-danger">Overdue</span>;
  return <span className="badge badge-neutral">Solved</span>;
}
