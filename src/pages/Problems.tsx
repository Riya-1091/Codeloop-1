import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, ChevronLeft, ChevronRight, Filter, Inbox } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { FREE_PROBLEM_LIMIT } from '@/lib/site';
import { listProblems, type DbProblem } from '@/lib/api';
import { PageHeader, DifficultyBadge, EmptyState } from '@/components/ui/Section';

const platforms = ['All', 'LeetCode', 'GeeksforGeeks', 'Codeforces', 'HackerRank'];
const difficulties = ['All', 'Easy', 'Medium', 'Hard'];
export default function Problems() {
  const navigate = useNavigate();
  const { user, isPremium } = useAuth();
  const [allProblems, setAllProblems] = useState<DbProblem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [platform, setPlatform] = useState('All');
  const [difficulty, setDifficulty] = useState('All');
  const [page, setPage] = useState(1);
  const perPage = 8;

  useEffect(() => {
    if (!user) return;
    listProblems(user.id).then((p) => { setAllProblems(p); setLoading(false); });
  }, [user?.id]);

  const filtered = useMemo(() => {
    return allProblems.filter((p) => {
      if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (platform !== 'All' && p.platform !== platform) return false;
      if (difficulty !== 'All' && p.difficulty !== difficulty) return false;
      return true;
    });
  }, [allProblems, search, platform, difficulty]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const pageItems = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div>
      <PageHeader
        title="Problems"
        subtitle={isPremium ? `${filtered.length} problems tracked` : `${allProblems.length} of ${FREE_PROBLEM_LIMIT} free problems used`}
        actions={
          <button onClick={() => navigate('/problems/new')} className="btn-primary">
            <Plus className="h-3.5 w-3.5" />
            Add Problem
          </button>
        }
      />

      {/* Filters */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search problems..."
            className="input-field pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-ink-muted" />
          <select value={platform} onChange={(e) => { setPlatform(e.target.value); setPage(1); }} className="input-field w-auto py-1.5 text-xs">
            {platforms.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <select value={difficulty} onChange={(e) => { setDifficulty(e.target.value); setPage(1); }} className="input-field w-auto py-1.5 text-xs">
            {difficulties.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      {!loading && pageItems.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="No problems found"
          description="Try adjusting your filters or add a new problem to get started."
          action={<button onClick={() => navigate('/problems/new')} className="btn-primary"><Plus className="h-3.5 w-3.5" /> Add Problem</button>}
        />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-line text-2xs uppercase tracking-wider text-ink-faint">
                  <th className="px-4 py-3 font-medium">Problem</th>
                  <th className="hidden px-4 py-3 font-medium sm:table-cell">Platform</th>
                  <th className="px-4 py-3 font-medium">Difficulty</th>
                  <th className="hidden px-4 py-3 font-medium md:table-cell">Topic</th>
                  <th className="hidden px-4 py-3 font-medium lg:table-cell">Language</th>
                  <th className="hidden px-4 py-3 font-medium lg:table-cell">Solved</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/60">
                {pageItems.map((p) => (
                  <tr
                    key={p.id}
                    onClick={() => navigate(`/problems/${p.id}`)}
                    className="cursor-pointer transition-colors hover:bg-base-hover"
                  >
                    <td className="px-4 py-3 font-medium text-ink-primary">{p.title}</td>
                    <td className="hidden px-4 py-3 text-ink-secondary sm:table-cell">{p.platform}</td>
                    <td className="px-4 py-3"><DifficultyBadge difficulty={p.difficulty} /></td>
                    <td className="hidden px-4 py-3 text-ink-secondary md:table-cell">{p.topic}</td>
                    <td className="hidden px-4 py-3 text-ink-muted lg:table-cell font-mono">{p.language}</td>
                    <td className="hidden px-4 py-3 text-ink-muted lg:table-cell">{new Date(p.solved_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-line px-4 py-3">
              <span className="text-2xs text-ink-muted">
                Page {page} of {totalPages} · {filtered.length} problems
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="flex h-7 w-7 items-center justify-center rounded-md border border-line text-ink-secondary disabled:opacity-30 hover:bg-base-hover"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="flex h-7 w-7 items-center justify-center rounded-md border border-line text-ink-secondary disabled:opacity-30 hover:bg-base-hover"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: DbProblem['status'] }) {
  if (status === 'Synced') return <span className="badge badge-success">Synced</span>;
  if (status === 'Revision Due') return <span className="badge badge-warning">Revision Due</span>;
  if (status === 'Overdue') return <span className="badge badge-danger">Overdue</span>;
  return <span className="badge badge-neutral">Solved</span>;
}
