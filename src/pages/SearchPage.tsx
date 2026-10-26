import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, ArrowRight, Inbox } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { listProblems, type DbProblem } from '@/lib/api';
import { PageHeader, EmptyState, DifficultyBadge } from '@/components/ui/Section';

const pageSearchItems = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Problems', path: '/problems' },
  { label: 'Add Problem', path: '/problems/new' },
  { label: 'Revision Center', path: '/revision' },
  { label: 'GitHub', path: '/github' },
  { label: 'Showcase', path: '/showcase' },
  { label: 'Analytics', path: '/analytics' },
  { label: 'Profile', path: '/profile' },
  { label: 'Settings', path: '/settings' },
  { label: 'Help', path: '/help' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
];

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const { user } = useAuth();
  const [allProblems, setAllProblems] = useState<DbProblem[]>([]);

  useEffect(() => {
    if (user) listProblems(user.id).then(setAllProblems);
  }, [user?.id]);

  const q = query.toLowerCase().trim();
  const matchingProblems = q ? allProblems.filter((p) => p.title.toLowerCase().includes(q) || p.topic.toLowerCase().includes(q)) : [];
  const matchingPages = q ? pageSearchItems.filter((p) => p.label.toLowerCase().includes(q)) : [];

  return (
    <div>
      <PageHeader title="Search" subtitle="Search across problems, pages, and settings." />

      <div className="relative mb-6">
        <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search problems, pages..."
          className="input-field pl-9"
          autoFocus
        />
      </div>

      {!q && (
        <EmptyState
          icon={SearchIcon}
          title="Start searching"
          description="Search for problems by name or topic, or find pages and settings."
        />
      )}

      {q && matchingProblems.length === 0 && matchingPages.length === 0 && (
        <EmptyState
          icon={Inbox}
          title="No results found"
          description={`No results for "${query}". Try a different search term.`}
        />
      )}

      {matchingProblems.length > 0 && (
        <div className="mb-6">
          <h2 className="mb-3 text-2xs font-semibold uppercase tracking-wider text-ink-faint">Problems ({matchingProblems.length})</h2>
          <div className="space-y-2">
            {matchingProblems.map((p) => (
              <button
                key={p.id}
                onClick={() => navigate(`/problems/${p.id}`)}
                className="card flex w-full items-center justify-between p-3.5 text-left transition-colors hover:border-line-strong"
              >
                <div className="flex items-center gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-ink-primary">{p.title}</div>
                    <div className="mt-0.5 flex items-center gap-1.5 text-2xs text-ink-muted">
                      <span>{p.topic}</span>
                      <span>·</span>
                      <DifficultyBadge difficulty={p.difficulty} />
                      <span>·</span>
                      <span>{p.platform}</span>
                    </div>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-ink-faint" />
              </button>
            ))}
          </div>
        </div>
      )}

      {matchingPages.length > 0 && (
        <div>
          <h2 className="mb-3 text-2xs font-semibold uppercase tracking-wider text-ink-faint">Pages ({matchingPages.length})</h2>
          <div className="space-y-2">
            {matchingPages.map((p) => (
              <button
                key={p.path}
                onClick={() => navigate(p.path)}
                className="card flex w-full items-center justify-between p-3.5 text-left transition-colors hover:border-line-strong"
              >
                <span className="text-sm font-medium text-ink-primary">{p.label}</span>
                <div className="flex items-center gap-2">
                  <span className="badge badge-neutral">Page</span>
                  <ArrowRight className="h-4 w-4 text-ink-faint" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
