import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/ui/Section';
import { listAuditLogs, type DbAuditLog } from '@/lib/api';

export default function AdminAuditLogs() {
  const [logs, setLogs] = useState<DbAuditLog[]>([]);

  useEffect(() => {
    listAuditLogs().then(setLogs);
  }, []);

  return (
    <div>
      <PageHeader title="Audit Logs" subtitle={`${logs.length} logged actions`} />

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-line text-2xs uppercase tracking-wider text-ink-faint">
                <th className="px-4 py-3 font-medium">Action</th>
                <th className="hidden px-4 py-3 font-medium sm:table-cell">Actor</th>
                <th className="hidden px-4 py-3 font-medium md:table-cell">Target</th>
                <th className="px-4 py-3 font-medium">Severity</th>
                <th className="px-4 py-3 font-medium">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60">
              {logs.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-6 text-center text-ink-muted">No audit logs yet.</td></tr>
              )}
              {logs.map((log) => (
                <tr key={log.id} className="transition-colors hover:bg-base-hover">
                  <td className="px-4 py-3 font-medium text-ink-primary">{log.action}</td>
                  <td className="hidden px-4 py-3 font-mono text-ink-secondary sm:table-cell">{log.actor_email}</td>
                  <td className="hidden px-4 py-3 font-mono text-ink-muted md:table-cell">{log.target}</td>
                  <td className="px-4 py-3">
                    {log.severity === 'critical' ? <span className="badge badge-danger">Critical</span>
                      : log.severity === 'warning' ? <span className="badge badge-warning">Warning</span>
                      : <span className="badge badge-neutral">Info</span>}
                  </td>
                  <td className="px-4 py-3 text-ink-muted">{new Date(log.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
