import {
  LayoutDashboard,
  Code2,
  Plus,
  RotateCw,
  Github,
  BarChart3,
  Globe,
  Settings,
  Search,
  Bell,
  Flame,
  CheckCircle2,
  Circle,
  ArrowRight,
  GitBranch,
  Activity,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';
import {
  stats,
  topicProgress,
  recentProblems,
  revisionQueue,
  gitHubSyncs,
  analyticsData,
  type Problem,
} from '@/data/mockData';
import { DifficultyBadge, ProgressBar } from '@/components/ui/Section';

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', active: true },
  { icon: Code2, label: 'Problems' },
  { icon: Plus, label: 'Add Problem' },
  { icon: RotateCw, label: 'Revision' },
  { icon: Github, label: 'GitHub' },
  { icon: BarChart3, label: 'Analytics' },
  { icon: Globe, label: 'Showcase' },
  { icon: Settings, label: 'Settings' },
];

function Sidebar() {
  return (
    <aside className="flex w-14 flex-col items-center gap-1 border-r border-line bg-base-900 py-3 sm:w-44 sm:items-stretch sm:px-3">
      <div className="mb-3 hidden items-center gap-2 px-2 sm:flex">
        <div className="flex h-6 w-6 items-center justify-center">
          <svg viewBox="0 0 28 28" className="h-6 w-6" fill="none">
            <rect x="2" y="2" width="24" height="24" rx="7" stroke="#2dd4bf" strokeWidth="1.5" />
            <path d="M9 10c-2 0-3.5 1.5-3.5 4s1.5 4 3.5 4" stroke="#2dd4bf" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M19 10c2 0 3.5 1.5 3.5 4s-1.5 4-3.5 4" stroke="#2dd4bf" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="14" cy="14" r="2" fill="#2dd4bf" />
          </svg>
        </div>
        <span className="text-sm font-semibold text-ink-primary">CodeLoop</span>
      </div>
      <div className="mb-1 flex h-6 w-6 items-center justify-center sm:hidden">
        <svg viewBox="0 0 28 28" className="h-6 w-6" fill="none">
          <rect x="2" y="2" width="24" height="24" rx="7" stroke="#2dd4bf" strokeWidth="1.5" />
          <circle cx="14" cy="14" r="2" fill="#2dd4bf" />
        </svg>
      </div>
      {sidebarItems.map((item) => (
        <div
          key={item.label}
          className={`flex h-9 items-center justify-center gap-2.5 rounded-lg px-0 text-2xs font-medium transition-colors sm:justify-start sm:px-2.5 sm:text-xs ${
            item.active
              ? 'bg-accent-400/10 text-accent-300'
              : 'text-ink-muted hover:bg-base-800 hover:text-ink-secondary'
          }`}
        >
          <item.icon className="h-4 w-4 shrink-0" />
          <span className="hidden sm:inline">{item.label}</span>
        </div>
      ))}
    </aside>
  );
}

function TopBar({ title }: { title: string }) {
  return (
    <div className="flex h-11 items-center justify-between border-b border-line px-4">
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-semibold text-ink-primary">{title}</h3>
      </div>
      <div className="flex items-center gap-2">
        <div className="hidden items-center gap-1.5 rounded-md border border-line bg-base-800 px-2.5 py-1 text-2xs text-ink-muted sm:flex">
          <Search className="h-3 w-3" />
          <span>Search...</span>
        </div>
        <button className="flex h-7 w-7 items-center justify-center rounded-md text-ink-muted hover:text-ink-secondary" aria-label="Notifications">
          <Bell className="h-3.5 w-3.5" />
        </button>
        <div className="h-6 w-6 rounded-full bg-gradient-to-br from-accent-400 to-accent-600" aria-label="Profile" />
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  suffix,
  accent,
}: {
  icon: typeof Flame;
  label: string;
  value: string | number;
  suffix?: string;
  accent?: boolean;
}) {
  return (
    <div className="card p-3">
      <div className="mb-2 flex items-center gap-2">
        <Icon className={`h-3.5 w-3.5 ${accent ? 'text-accent-400' : 'text-ink-muted'}`} />
        <span className="text-2xs font-medium text-ink-muted">{label}</span>
      </div>
      <div className="flex items-baseline gap-0.5">
        <span className="text-lg font-semibold text-ink-primary">{value}</span>
        {suffix && <span className="text-2xs text-ink-muted">{suffix}</span>}
      </div>
    </div>
  );
}

export function DashboardPreview() {
  return (
    <div className="flex h-full overflow-hidden rounded-xl border border-line bg-base-900 shadow-float">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar title="Dashboard" />
        <div className="flex-1 overflow-auto p-3 sm:p-4">
          {/* Stats row */}
          <div className="mb-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            <StatCard icon={Flame} label="Day Streak" value={stats.streak} accent />
            <StatCard icon={CheckCircle2} label="Problems Solved" value={stats.solved} />
            <StatCard icon={RotateCw} label="Revisions Due" value={stats.revisionsDue} />
            <StatCard icon={TrendingUp} label="Revision Success" value={stats.revisionSuccess} suffix="%" />
          </div>

          <div className="grid gap-3 lg:grid-cols-5">
            {/* Today's revision */}
            <div className="card p-3.5 lg:col-span-2">
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-xs font-semibold text-ink-primary">Today's Revision</h4>
                <span className="badge badge-warning">3 due</span>
              </div>
              <div className="space-y-2.5">
                {revisionQueue.today.slice(0, 2).map((item) => (
                  <div key={item.id} className="flex items-center justify-between rounded-lg border border-line bg-base-800/50 p-2.5">
                    <div className="min-w-0">
                      <div className="truncate text-xs font-medium text-ink-primary">{item.title}</div>
                      <div className="mt-0.5 flex items-center gap-1.5 text-2xs text-ink-muted">
                        <span>{item.topic}</span>
                        <span>·</span>
                        <DifficultyBadge difficulty={item.difficulty} />
                      </div>
                    </div>
                    <button className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-accent-400/10 text-accent-300 transition-colors hover:bg-accent-400/20">
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Topic progress */}
            <div className="card p-3.5 lg:col-span-3">
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-xs font-semibold text-ink-primary">Topic Progress</h4>
                <span className="text-2xs text-ink-muted">Last 30 days</span>
              </div>
              <div className="space-y-2.5">
                {topicProgress.slice(0, 4).map((t) => (
                  <div key={t.topic}>
                    <div className="mb-1 flex items-center justify-between text-2xs">
                      <span className="font-medium text-ink-secondary">{t.topic}</span>
                      <span className="text-ink-muted">{t.solved}/{t.total}</span>
                    </div>
                    <ProgressBar pct={t.pct} accent={t.pct >= 70} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent problems */}
          <div className="card mt-3 overflow-hidden">
            <div className="flex items-center justify-between border-b border-line px-3.5 py-2.5">
              <h4 className="text-xs font-semibold text-ink-primary">Recent Problems</h4>
              <span className="text-2xs text-accent-400">View all</span>
            </div>
            <div className="divide-y divide-line/60">
              {recentProblems.slice(0, 3).map((p) => (
                <ProblemRow key={p.id} problem={p} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProblemRow({ problem }: { problem: Problem }) {
  return (
    <div className="flex items-center justify-between px-3.5 py-2.5 transition-colors hover:bg-base-800/40">
      <div className="flex min-w-0 items-center gap-2.5">
        {problem.status === 'Synced' ? (
          <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-success" />
        ) : problem.status === 'Revision Due' ? (
          <RotateCw className="h-3.5 w-3.5 shrink-0 text-warning" />
        ) : (
          <Circle className="h-3.5 w-3.5 shrink-0 text-ink-muted" />
        )}
        <div className="min-w-0">
          <div className="truncate text-xs font-medium text-ink-primary">{problem.title}</div>
          <div className="text-2xs text-ink-muted">{problem.platform} · {problem.topic}</div>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <DifficultyBadge difficulty={problem.difficulty} />
        <span className="hidden text-2xs text-ink-muted sm:inline">{problem.lastSolved}</span>
      </div>
    </div>
  );
}

export function RevisionPreview() {
  return (
    <div className="flex h-full overflow-hidden rounded-xl border border-line bg-base-900 shadow-float">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar title="Revision Center" />
        <div className="flex-1 overflow-auto p-3 sm:p-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-ink-primary">Spaced Repetition Queue</h4>
              <p className="mt-0.5 text-2xs text-ink-muted">Problems surfaced at optimal intervals</p>
            </div>
            <span className="badge badge-accent">SR-Algorithm v2</span>
          </div>

          <RevisionGroup label="Due Today" count={revisionQueue.today.length} items={revisionQueue.today} highlight />
          <RevisionGroup label="Overdue" count={revisionQueue.overdue.length} items={revisionQueue.overdue} />
          <RevisionGroup label="Upcoming" count={revisionQueue.upcoming.length} items={revisionQueue.upcoming} />
        </div>
      </div>
    </div>
  );
}

function RevisionGroup({
  label,
  count,
  items,
  highlight = false,
}: {
  label: string;
  count: number;
  items: typeof revisionQueue.today | typeof revisionQueue.upcoming | typeof revisionQueue.overdue;
  highlight?: boolean;
}) {
  return (
    <div className="mb-4">
      <div className="mb-2 flex items-center gap-2">
        <span className={`text-2xs font-semibold uppercase tracking-wider ${highlight ? 'text-accent-400' : 'text-ink-muted'}`}>
          {label}
        </span>
        <span className="badge badge-neutral">{count}</span>
      </div>
      <div className="space-y-1.5">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-lg border border-line bg-base-850/60 p-2.5 transition-all hover:border-line-strong hover:bg-base-800"
          >
            <div className="flex min-w-0 items-center gap-2.5">
              <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${highlight ? 'bg-accent-400/10 text-accent-300' : 'bg-base-800 text-ink-muted'}`}>
                <RotateCw className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0">
                <div className="truncate text-xs font-medium text-ink-primary">{item.title}</div>
                <div className="flex items-center gap-1.5 text-2xs text-ink-muted">
                  <span>{item.topic}</span>
                  <span>·</span>
                  <DifficultyBadge difficulty={item.difficulty} />
                  <span>·</span>
                  <span>Rev #{item.revisionNumber}</span>
                </div>
              </div>
            </div>
            <button className="shrink-0 rounded-md bg-accent-400/10 px-2.5 py-1 text-2xs font-medium text-accent-300 transition-colors hover:bg-accent-400/20">
              Start
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function GitHubPreview() {
  return (
    <div className="flex h-full overflow-hidden rounded-xl border border-line bg-base-900 shadow-float">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar title="GitHub Sync" />
        <div className="flex-1 overflow-auto p-3 sm:p-4">
          {/* Connection status */}
          <div className="card mb-3 p-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-base-800">
                  <Github className="h-4 w-4 text-ink-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-ink-primary">GitHub Connected</span>
                    <span className="badge badge-success">
                      <CheckCircle2 className="h-2.5 w-2.5" />
                      Active
                    </span>
                  </div>
                  <div className="mt-0.5 flex items-center gap-1.5 text-2xs text-ink-muted">
                    <GitBranch className="h-3 w-3" />
                    <span className="font-mono">codeloop-dsa</span>
                  </div>
                </div>
              </div>
              <button className="rounded-md border border-line bg-base-800 px-2.5 py-1 text-2xs font-medium text-ink-secondary transition-colors hover:bg-base-750">
                Configure
              </button>
            </div>
          </div>

          {/* Sync activity */}
          <div className="card overflow-hidden">
            <div className="flex items-center justify-between border-b border-line px-3.5 py-2.5">
              <h4 className="text-xs font-semibold text-ink-primary">Recent Syncs</h4>
              <span className="text-2xs text-ink-muted">Auto-commit enabled</span>
            </div>
            <div className="divide-y divide-line/60">
              {gitHubSyncs.map((sync) => (
                <div key={sync.title} className="flex items-center justify-between px-3.5 py-2.5 transition-colors hover:bg-base-800/40">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <GitBranch className="h-3.5 w-3.5 shrink-0 text-ink-muted" />
                    <div className="min-w-0">
                      <div className="truncate text-xs font-medium text-ink-primary">{sync.title}</div>
                      <div className="truncate font-mono text-2xs text-ink-muted">{sync.file}</div>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {sync.status === 'Synced' ? (
                      <span className="badge badge-success">
                        <CheckCircle2 className="h-2.5 w-2.5" />
                        Synced
                      </span>
                    ) : (
                      <span className="badge badge-accent">
                        <Activity className="h-2.5 w-2.5 animate-pulse-soft" />
                        Syncing
                      </span>
                    )}
                    <span className="text-2xs text-ink-muted">{sync.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card mt-3 p-3.5">
            <div className="mb-2 flex items-center gap-2">
              <GitBranch className="h-3.5 w-3.5 text-accent-400" />
              <span className="text-xs font-semibold text-ink-primary">Repository Structure</span>
            </div>
            <pre className="overflow-auto rounded-lg bg-base-950/60 p-2.5 font-mono text-2xs leading-relaxed text-ink-muted">
{`codeloop-dsa/
├── arrays/
│   ├── two_sum.py
│   └── majority_element.py
├── hashing/
│   └── valid_parentheses.py
├── design/
│   └── lru_cache.py
└── README.md`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AnalyticsPreview() {
  const maxActivity = Math.max(...analyticsData.weeklyActivity);
  return (
    <div className="flex h-full overflow-hidden rounded-xl border border-line bg-base-900 shadow-float">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar title="Analytics" />
        <div className="flex-1 overflow-auto p-3 sm:p-4">
          {/* Activity chart */}
          <div className="card mb-3 p-3.5">
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-xs font-semibold text-ink-primary">Learning Activity</h4>
              <span className="text-2xs text-ink-muted">This week</span>
            </div>
            <div className="flex h-24 items-end gap-1.5">
              {analyticsData.weeklyActivity.map((val, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-1">
                  <div
                    className="w-full rounded-sm bg-gradient-to-t from-accent-600 to-accent-400 transition-all duration-700 ease-out"
                    style={{ height: `${(val / maxActivity) * 100}%` }}
                  />
                  <span className="text-2xs text-ink-faint">
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {/* Revision success trend */}
            <div className="card p-3.5">
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-xs font-semibold text-ink-primary">Revision Success</h4>
                <span className="badge badge-success">+13%</span>
              </div>
              <div className="flex items-end gap-1.5">
                {analyticsData.revisionTrend.map((val, i) => (
                  <div key={i} className="flex-1">
                    <div
                      className="rounded-sm bg-ink-muted/40 transition-all duration-700"
                      style={{ height: `${val * 0.5}px` }}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-lg font-semibold text-ink-primary">73%</span>
                <span className="text-2xs text-success">↑ from 60%</span>
              </div>
            </div>

            {/* Weak topics */}
            <div className="card p-3.5">
              <div className="mb-3 flex items-center gap-2">
                <AlertTriangle className="h-3.5 w-3.5 text-warning" />
                <h4 className="text-xs font-semibold text-ink-primary">Weak Topics</h4>
              </div>
              <div className="space-y-2.5">
                {analyticsData.weakTopics.map((t) => (
                  <div key={t.topic}>
                    <div className="mb-1 flex items-center justify-between text-2xs">
                      <span className="font-medium text-ink-secondary">{t.topic}</span>
                      <span className="text-warning">{t.accuracy}%</span>
                    </div>
                    <ProgressBar pct={t.accuracy} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export type PreviewType = 'dashboard' | 'revision' | 'github' | 'analytics';

export const previewMap = {
  dashboard: DashboardPreview,
  revision: RevisionPreview,
  github: GitHubPreview,
  analytics: AnalyticsPreview,
};
