import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { listProblems, type DbProblem } from '@/lib/api';

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

export function CommandSearch({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [myProblems, setMyProblems] = useState<DbProblem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
      if (user) listProblems(user.id).then(setMyProblems);
    }
  }, [open, user?.id]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((prev) => Math.min(prev + 1, results.length - 1));
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((prev) => Math.max(prev - 1, 0));
      }
      if (e.key === 'Enter' && results[activeIndex]) {
        navigate(results[activeIndex].path);
        onClose();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose, query, activeIndex]);

  if (!open) return null;

  const q = query.toLowerCase().trim();
  const matchingProblems = q
    ? myProblems.filter((p) => p.title.toLowerCase().includes(q) || p.topic.toLowerCase().includes(q)).slice(0, 5)
        .map((p) => ({ label: p.title, path: `/problems/${p.id}`, category: 'Problem', sub: `${p.topic} · ${p.difficulty}` }))
    : [];
  const matchingPages = q
    ? pageSearchItems.filter((p) => p.label.toLowerCase().includes(q)).slice(0, 5)
        .map((p) => ({ label: p.label, path: p.path, category: 'Page', sub: '' }))
    : [];

  const results = [...matchingProblems, ...matchingPages];

  return (
    <div className="fixed inset-0 z-[95] flex items-start justify-center pt-[15vh] p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative w-full max-w-lg animate-fade-up rounded-xl border border-line surface shadow-float overflow-hidden" style={{ animationDuration: '0.2s' }}>
        <div className="flex items-center gap-3 border-b border-line px-4 py-3">
          <Search className="h-4 w-4 text-ink-muted" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setActiveIndex(0); }}
            placeholder="Search problems, pages, settings..."
            className="flex-1 bg-transparent text-sm text-ink-primary placeholder:text-ink-muted focus:outline-none"
          />
          <kbd className="hidden rounded border border-line px-1.5 py-0.5 text-2xs text-ink-muted sm:inline">ESC</kbd>
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {results.length === 0 ? (
            <div className="px-3 py-8 text-center">
              <p className="text-sm text-ink-muted">
                {q ? `No results for "${query}"` : 'Start typing to search...'}
              </p>
            </div>
          ) : (
            results.map((r, i) => (
              <button
                key={r.path + i}
                onClick={() => { navigate(r.path); onClose(); }}
                onMouseEnter={() => setActiveIndex(i)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors ${
                  i === activeIndex ? 'bg-base-hover' : ''
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-ink-primary">{r.label}</div>
                  {r.sub && <div className="text-2xs text-ink-muted">{r.sub}</div>}
                </div>
                <span className="badge badge-neutral">{r.category}</span>
                <ArrowRight className="h-3.5 w-3.5 text-ink-faint" />
              </button>
            ))
          )}
        </div>

        <div className="border-t border-line px-4 py-2 text-2xs text-ink-faint">
          <kbd className="rounded border border-line px-1">↑</kbd> <kbd className="rounded border border-line px-1">↓</kbd> to navigate
          <span className="mx-2">·</span>
          <kbd className="rounded border border-line px-1">↵</kbd> to select
        </div>
      </div>
    </div>
  );
}

export function SearchTrigger({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 rounded-lg border border-line bg-base-850 px-2.5 py-1.5 text-xs text-ink-muted transition-colors hover:border-line-strong hover:text-ink-secondary"
      aria-label="Open search"
    >
      <Search className="h-3.5 w-3.5" />
      <span className="hidden sm:inline">Search...</span>
      <kbd className="hidden rounded border border-line px-1 py-0.5 text-2xs sm:inline">⌘K</kbd>
    </button>
  );
}
