import { useEffect, useState } from 'react';
import { Users, Code2, RotateCw, TrendingUp, Activity } from 'lucide-react';
import { StatCard, PageHeader, ProgressBar } from '@/components/ui/Section';
import { getAdminOverview, listAllUsers, type AdminOverview, type StaffProfile } from '@/lib/api';

export default function AdminAnalytics() {
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [users, setUsers] = useState<StaffProfile[]>([]);

  useEffect(() => {
    getAdminOverview().then(setOverview);
    listAllUsers().then((u) => setUsers(u.filter((x) => x.role === 'student')));
  }, []);

  const growthData = Array.from({ length: 8 }, (_, i) => {
    const weeksAgo = 7 - i;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - weeksAgo * 7);
    return users.filter((u) => new Date(u.created_at) <= cutoff).length;
  });
  const maxGrowth = Math.max(1, ...growthData);

  const totalUsers = overview?.totalUsers ?? 0;
  const avgProblems = totalUsers > 0 ? ((overview?.problemsSolved ?? 0) / totalUsers).toFixed(1) : '0';
  const avgRevisions = totalUsers > 0 ? ((overview?.revisionsCompleted ?? 0) / totalUsers).toFixed(1) : '0';
  const activePct = totalUsers > 0 ? Math.round(((overview?.activeUsers ?? 0) / totalUsers) * 100) : 0;

  return (
    <div>
      <PageHeader title="Platform Analytics" subtitle="Aggregate metrics across all users." />

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard icon={Users} label="Total Users" value={totalUsers.toLocaleString()} accent />
        <StatCard icon={Activity} label="Active Users" value={overview?.activeUsers ?? 0} />
        <StatCard icon={Code2} label="Problems Solved" value={(overview?.problemsSolved ?? 0).toLocaleString()} />
        <StatCard icon={RotateCw} label="Revisions Done" value={(overview?.revisionsCompleted ?? 0).toLocaleString()} />
      </div>

      <div className="card mb-4 p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-ink-primary">User Growth</h3>
          <span className="badge badge-success">
            <TrendingUp className="h-2.5 w-2.5" />
            +{overview?.newUsersThisWeek ?? 0} this week
          </span>
        </div>
        <div className="flex h-40 items-end gap-2">
          {growthData.map((val, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
              <span className="text-2xs font-medium text-ink-secondary">{val}</span>
              <div
                className="w-full rounded-sm bg-gradient-to-t from-accent-600 to-accent-400 transition-all duration-700"
                style={{ height: `${(val / maxGrowth) * 100}%` }}
              />
              <span className="text-2xs text-ink-faint">W{i + 1}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card p-5">
          <h3 className="mb-4 text-sm font-semibold text-ink-primary">User Status</h3>
          <div className="space-y-3">
            <div>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="text-ink-secondary">Active</span>
                <span className="text-ink-muted">{overview?.activeUsers ?? 0}</span>
              </div>
              <ProgressBar pct={activePct} accent />
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="text-ink-secondary">Suspended</span>
                <span className="text-ink-muted">{totalUsers - (overview?.activeUsers ?? 0)}</span>
              </div>
              <ProgressBar pct={100 - activePct} />
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="text-ink-secondary">New this week</span>
                <span className="text-ink-muted">{overview?.newUsersThisWeek ?? 0}</span>
              </div>
              <ProgressBar pct={totalUsers > 0 ? Math.round(((overview?.newUsersThisWeek ?? 0) / totalUsers) * 100) : 0} />
            </div>
          </div>
        </div>

        <div className="card p-5">
          <h3 className="mb-4 text-sm font-semibold text-ink-primary">Engagement Metrics</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-ink-secondary">Avg problems per user</span>
              <span className="font-semibold text-ink-primary">{avgProblems}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-ink-secondary">Avg revisions per user</span>
              <span className="font-semibold text-ink-primary">{avgRevisions}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
