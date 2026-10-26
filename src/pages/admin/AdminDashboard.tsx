import { useEffect, useState } from 'react';
import { Users, CheckCircle2, Code2, RotateCw, UserPlus, TrendingUp } from 'lucide-react';
import { StatCard, PageHeader } from '@/components/ui/Section';
import { getAdminOverview, listAuditLogs, type AdminOverview, type DbAuditLog } from '@/lib/api';

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function AdminDashboard() {
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [logs, setLogs] = useState<DbAuditLog[]>([]);

  useEffect(() => {
    getAdminOverview().then(setOverview);
    listAuditLogs().then(setLogs);
  }, []);

  return (
    <div>
      <PageHeader title="Admin Overview" subtitle="Platform health and activity at a glance." />

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard icon={Users} label="Total Users" value={(overview?.totalUsers ?? 0).toLocaleString()} />
        <StatCard icon={CheckCircle2} label="Active Users" value={(overview?.activeUsers ?? 0).toLocaleString()} accent />
        <StatCard icon={Code2} label="Problems Solved" value={(overview?.problemsSolved ?? 0).toLocaleString()} />
        <StatCard icon={RotateCw} label="Revisions" value={(overview?.revisionsCompleted ?? 0).toLocaleString()} />
        <StatCard icon={UserPlus} label="New This Week" value={overview?.newUsersThisWeek ?? 0} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-ink-primary">Platform Snapshot</h3>
            <span className="badge badge-success">
              <TrendingUp className="h-2.5 w-2.5" />
              Live data
            </span>
          </div>
          <p className="text-xs text-ink-secondary">
            {overview?.totalUsers ?? 0} students have logged {overview?.problemsSolved ?? 0} solved problems and completed{' '}
            {overview?.revisionsCompleted ?? 0} revisions on the platform so far.
          </p>
          <p className="mt-2 text-xs text-ink-muted">
            {overview?.newUsersThisWeek ?? 0} new student{overview?.newUsersThisWeek === 1 ? '' : 's'} joined in the last 7 days.
          </p>
        </div>

        {/* Recent activity */}
        <div className="card p-5">
          <h3 className="mb-4 text-sm font-semibold text-ink-primary">Recent Activity</h3>
          <div className="space-y-3">
            {logs.length === 0 && <p className="text-xs text-ink-muted">No activity logged yet.</p>}
            {logs.slice(0, 6).map((log) => (
              <div key={log.id} className="flex items-start gap-2.5">
                <div className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${
                  log.severity === 'critical' ? 'bg-danger' : log.severity === 'warning' ? 'bg-warning' : 'bg-success'
                }`} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-xs font-medium text-ink-primary">{log.action}</div>
                  <div className="truncate text-2xs text-ink-muted">{log.target} · {timeAgo(log.created_at)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
