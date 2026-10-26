import { useEffect, useState } from 'react';
import { PageHeader, DifficultyBadge } from '@/components/ui/Section';
import { listAllProblemsForStaff, type DbProblem } from '@/lib/api';

export default function AdminProblems() {
  const [problems, setProblems] = useState<(DbProblem & { profiles: { name: string; email: string } })[]>([]);

  useEffect(() => {
    listAllProblemsForStaff(50).then(setProblems);
  }, []);

  return (
    <div>
      <PageHeader title="Problem Management" subtitle={`${problems.length} most recent problems across all students`} />

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-line text-2xs uppercase tracking-wider text-ink-faint">
                <th className="px-4 py-3 font-medium">Problem</th>
                <th className="px-4 py-3 font-medium">Student</th>
                <th className="hidden px-4 py-3 font-medium sm:table-cell">Platform</th>
                <th className="px-4 py-3 font-medium">Difficulty</th>
                <th className="hidden px-4 py-3 font-medium md:table-cell">Topic</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60">
              {problems.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-6 text-center text-ink-muted">No problems logged yet.</td></tr>
              )}
              {problems.map((p) => (
                <tr key={p.id} className="transition-colors hover:bg-base-hover">
                  <td className="px-4 py-3 font-medium text-ink-primary">{p.title}</td>
                  <td className="px-4 py-3 text-ink-secondary">{p.profiles?.name || p.profiles?.email}</td>
                  <td className="hidden px-4 py-3 text-ink-secondary sm:table-cell">{p.platform}</td>
                  <td className="px-4 py-3"><DifficultyBadge difficulty={p.difficulty} /></td>
                  <td className="hidden px-4 py-3 text-ink-secondary md:table-cell">{p.topic}</td>
                  <td className="px-4 py-3">
                    {p.github_synced
                      ? <span className="badge badge-success">Synced</span>
                      : <span className="badge badge-neutral">Local</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
