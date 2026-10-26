import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ExternalLink,
  RotateCw,
  Github,
  Trash2,
  CheckCircle2,
  Clock,
  GitBranch,
} from 'lucide-react';
import { PageHeader, DifficultyBadge, EmptyState, ProgressBar } from '@/components/ui/Section';
import { Button } from '@/components/ui/Form';
import { ConfirmModal } from '@/components/ui/Modal';
import { useToast } from '@/contexts/ToastContext';
import { supabase } from '@/lib/supabase';
import { deleteProblem, reviewProblem, syncProblemToGithub, type DbProblem } from '@/lib/api';

export default function ProblemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [problem, setProblem] = useState<DbProblem | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const load = async () => {
    if (!id) return;
    setLoading(true);
    const { data } = await supabase.from('problems').select('*').eq('id', id).maybeSingle();
    setProblem(data as DbProblem | null);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) return null;

  if (!problem) {
    return (
      <EmptyState
        icon={ArrowLeft}
        title="Problem not found"
        description="This problem may have been deleted or the ID is invalid."
        action={<Button variant="secondary" onClick={() => navigate('/problems')}>Back to Problems</Button>}
      />
    );
  }

  const handleReview = async () => {
    await reviewProblem(problem.id, true);
    toast('Revision logged. Next review scheduled.', 'success');
    load();
  };

  const handleSync = async () => {
    if (problem.github_synced) {
      toast('Already synced to GitHub.', 'info');
      return;
    }
    setSyncing(true);
    try {
      const result = await syncProblemToGithub(problem.id);
      toast(`Synced to ${result.repo} (${result.commit}).`, 'success');
      load();
    } catch (e) {
      toast(e instanceof Error ? e.message : 'GitHub sync failed.', 'error');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div>
      <button onClick={() => navigate('/problems')} className="btn-ghost mb-4 -ml-3">
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Problems
      </button>

      <PageHeader
        title={problem.title}
        subtitle={`${problem.platform} · ${problem.topic}`}
        actions={
          <>
            <Button variant="secondary" onClick={handleReview}>
              <RotateCw className="h-3.5 w-3.5" />
              Mark Reviewed
            </Button>
            <Button variant="primary" onClick={handleSync} disabled={syncing || problem.github_synced}>
              <Github className="h-3.5 w-3.5" />
              {syncing ? 'Syncing...' : problem.github_synced ? 'Synced' : 'Sync to GitHub'}
            </Button>
            <Button variant="danger" onClick={() => setDeleteOpen(true)}>
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Main content */}
        <div className="space-y-4 lg:col-span-2">
          {/* Problem info */}
          <div className="card p-5">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <DifficultyBadge difficulty={problem.difficulty} />
              <span className="badge badge-neutral">{problem.platform}</span>
              <span className="badge badge-neutral">{problem.topic}</span>
              <span className="badge badge-neutral font-mono">{problem.language}</span>
            </div>

            {problem.url && (
              <a
                href={problem.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-accent-400 hover:text-accent-300"
              >
                View original problem
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}

            {problem.notes && (
              <div className="mt-4">
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">Notes</h3>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink-secondary">{problem.notes}</p>
              </div>
            )}
          </div>

          {/* Solution */}
          {problem.solution && (
            <div className="card overflow-hidden">
              <div className="flex items-center justify-between border-b border-line px-4 py-3">
                <h3 className="text-sm font-semibold text-ink-primary">Solution</h3>
                <span className="text-2xs text-ink-muted font-mono">{problem.language}</span>
              </div>
              <pre className="overflow-auto bg-base-950/60 p-4 font-mono text-xs leading-relaxed text-ink-secondary">
{problem.solution}
              </pre>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Revision info */}
          <div className="card p-4">
            <h3 className="mb-3 text-sm font-semibold text-ink-primary">Revision</h3>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-ink-muted">Status</span>
                <span className={problem.status === 'Revision Due' ? 'text-warning' : 'text-ink-secondary'}>
                  {problem.status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-ink-muted">Revisions completed</span>
                <span className="text-ink-primary">{problem.revision_count}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-ink-muted">Last solved</span>
                <span className="text-ink-secondary">{new Date(problem.solved_at).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-ink-muted">Next revision</span>
                <span className="text-accent-400">
                  {problem.next_review_at ? new Date(problem.next_review_at).toLocaleDateString() : '—'}
                </span>
              </div>
            </div>
            <div className="mt-3 border-t border-line pt-3">
              <div className="mb-1 flex items-center justify-between text-2xs">
                <span className="text-ink-muted">Revision progress</span>
                <span className="text-ink-secondary">{Math.min(problem.revision_count * 25, 100)}%</span>
              </div>
              <ProgressBar pct={Math.min(problem.revision_count * 25, 100)} accent />
            </div>
          </div>

          {/* GitHub sync */}
          <div className="card p-4">
            <h3 className="mb-3 text-sm font-semibold text-ink-primary">GitHub Sync</h3>
            <div className="flex items-center gap-2">
              {problem.github_synced ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <span className="text-xs text-ink-secondary">Synced</span>
                </>
              ) : (
                <>
                  <GitBranch className="h-4 w-4 text-ink-muted" />
                  <span className="text-xs text-ink-muted">Not synced yet</span>
                </>
              )}
            </div>
            {problem.github_synced && problem.github_file && (
              <div className="mt-2 flex items-center gap-2 text-2xs text-ink-muted">
                <GitBranch className="h-3 w-3" />
                <span className="font-mono">{problem.github_file}</span>
              </div>
            )}
          </div>

          {/* Timeline */}
          <div className="card p-4">
            <h3 className="mb-3 text-sm font-semibold text-ink-primary">Revision History</h3>
            <div className="space-y-2">
              {problem.revision_count > 0 ? (
                Array.from({ length: problem.revision_count }).map((_, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-accent-400/10">
                      <CheckCircle2 className="h-3 w-3 text-accent-400" />
                    </div>
                    <span className="text-ink-secondary">Revision #{i + 1}</span>
                  </div>
                ))
              ) : (
                <div className="flex items-center gap-2 text-xs">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-base-800">
                    <Clock className="h-3 w-3 text-ink-muted" />
                  </div>
                  <span className="text-ink-muted">No revisions yet</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={async () => {
          await deleteProblem(problem.id);
          toast('Problem deleted.', 'info');
          navigate('/problems');
        }}
        title="Delete Problem?"
        message={`Are you sure you want to delete "${problem.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        danger
      />
    </div>
  );
}
