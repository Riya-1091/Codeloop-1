import { useEffect, useState } from 'react';
import { RotateCw, CheckCircle2, AlertTriangle, Clock, ArrowRight, Brain } from 'lucide-react';
import { PageHeader, DifficultyBadge } from '@/components/ui/Section';
import { useToast } from '@/contexts/ToastContext';
import { useAuth } from '@/contexts/AuthContext';
import { listProblems, reviewProblem, type DbProblem } from '@/lib/api';

const intervals = ['+3 days', '+7 days', '+14 days', '+30 days'];

export default function Revision() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [problems, setProblems] = useState<DbProblem[]>([]);
  const [activeItem, setActiveItem] = useState<DbProblem | null>(null);
  const [recorded, setRecorded] = useState<DbProblem | null>(null);

  const load = async () => {
    if (!user) return;
    const all = await listProblems(user.id);
    setProblems(all.filter((p) => p.next_review_at));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const now = new Date();
  const today = problems.filter((p) => {
    const d = new Date(p.next_review_at!);
    return d.toDateString() === now.toDateString();
  });
  const overdue = problems.filter((p) => new Date(p.next_review_at!) < now && new Date(p.next_review_at!).toDateString() !== now.toDateString());
  const upcoming = problems.filter((p) => new Date(p.next_review_at!) > now);

  const handleRecall = async (quality: 'easy' | 'help' | 'forgot') => {
    if (!activeItem) return;
    await reviewProblem(activeItem.id, quality !== 'forgot');
    setRecorded(activeItem);
    setActiveItem(null);
    toast(`Revision recorded. Next revision scheduled ${quality === 'easy' ? '+7 days' : quality === 'help' ? '+3 days' : 'in 3 days'}.`);
    load();
    setTimeout(() => setRecorded(null), 3000);
  };

  const sectionConfig = {
    today: { label: 'Due Today', icon: Clock, color: 'text-accent-400', items: today },
    overdue: { label: 'Overdue', icon: AlertTriangle, color: 'text-danger', items: overdue },
    upcoming: { label: 'Upcoming', icon: RotateCw, color: 'text-ink-muted', items: upcoming },
  };

  return (
    <div>
      <PageHeader
        title="Revision Center"
        subtitle="Spaced repetition surfaces the right problem at the right time."
      />

      {/* Summary stats */}
      <div className="mb-6 grid grid-cols-3 gap-3">
        <div className="card p-3 text-center">
          <div className="text-2xl font-semibold text-accent-400">{today.length}</div>
          <div className="mt-0.5 text-2xs text-ink-muted">Due Today</div>
        </div>
        <div className="card p-3 text-center">
          <div className="text-2xl font-semibold text-danger">{overdue.length}</div>
          <div className="mt-0.5 text-2xs text-ink-muted">Overdue</div>
        </div>
        <div className="card p-3 text-center">
          <div className="text-2xl font-semibold text-ink-secondary">{upcoming.length}</div>
          <div className="mt-0.5 text-2xs text-ink-muted">Upcoming</div>
        </div>
      </div>

      {/* Revision groups */}
      <div className="space-y-6">
        {problems.length === 0 && (
          <div className="card p-6 text-center text-sm text-ink-muted">
            No revisions scheduled. Mark a problem "Save & Schedule Revision" when adding it.
          </div>
        )}
        {(['today', 'overdue', 'upcoming'] as const).map((key) => {
          const config = sectionConfig[key];
          const items = config.items;
          if (items.length === 0) return null;
          return (
            <div key={key}>
              <div className="mb-3 flex items-center gap-2">
                <config.icon className={`h-4 w-4 ${config.color}`} />
                <h2 className="text-sm font-semibold text-ink-primary">{config.label}</h2>
                <span className="badge badge-neutral">{items.length}</span>
              </div>
              <div className="space-y-2">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="card flex items-center justify-between p-3.5 transition-colors hover:border-line-strong"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${key === 'overdue' ? 'bg-danger/10' : key === 'today' ? 'bg-accent-400/10' : 'bg-base-800'}`}>
                        <RotateCw className={`h-4 w-4 ${key === 'overdue' ? 'text-danger' : key === 'today' ? 'text-accent-400' : 'text-ink-muted'}`} />
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium text-ink-primary">{item.title}</div>
                        <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-2xs text-ink-muted">
                          <span>{item.topic}</span>
                          <span>·</span>
                          <DifficultyBadge difficulty={item.difficulty} />
                          <span>·</span>
                          <span>Rev #{item.revision_count}</span>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => setActiveItem(item)} className="btn-primary shrink-0">
                      Start Revision
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Revision schedule info */}
      <div className="card mt-6 p-4">
        <div className="mb-3 flex items-center gap-2">
          <Brain className="h-4 w-4 text-accent-400" />
          <h3 className="text-sm font-semibold text-ink-primary">How Spaced Repetition Works</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {intervals.map((interval, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 rounded-lg border border-line bg-base-850/50 px-3 py-1.5">
                <span className="font-mono text-2xs text-ink-faint">#{i + 1}</span>
                <span className="text-xs text-ink-secondary">{interval}</span>
              </div>
              {i < intervals.length - 1 && <span className="text-ink-faint">→</span>}
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-ink-muted">
          Intervals adapt based on your recall accuracy. "Easy" extends the interval; "Forgot" resets it.
        </p>
      </div>

      {/* Active revision modal */}
      {activeItem && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={() => setActiveItem(null)} />
          <div className="relative w-full max-w-md animate-fade-up rounded-xl border border-line surface shadow-float" style={{ animationDuration: '0.2s' }}>
            <div className="border-b border-line px-5 py-3.5">
              <h2 className="text-sm font-semibold text-ink-primary">Revision: {activeItem.title}</h2>
            </div>
            <div className="px-5 py-4">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <DifficultyBadge difficulty={activeItem.difficulty} />
                <span className="badge badge-neutral">{activeItem.topic}</span>
                <span className="badge badge-neutral">{activeItem.platform}</span>
              </div>
              <div className="mb-4 rounded-lg border border-line bg-base-850/50 p-3 text-xs text-ink-muted">
                Try to recall the approach before re-reading your solution. Rate how well you remembered it.
              </div>
              <p className="mb-3 text-sm font-medium text-ink-primary">How well did you remember this?</p>
              <div className="grid grid-cols-3 gap-2">
                <button onClick={() => handleRecall('easy')} className="flex flex-col items-center gap-1.5 rounded-lg border border-success/20 bg-success/5 p-3 transition-colors hover:bg-success/10">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  <span className="text-xs font-medium text-success">Easy</span>
                  <span className="text-2xs text-ink-muted">+7 days</span>
                </button>
                <button onClick={() => handleRecall('help')} className="flex flex-col items-center gap-1.5 rounded-lg border border-warning/20 bg-warning/5 p-3 transition-colors hover:bg-warning/10">
                  <Brain className="h-5 w-5 text-warning" />
                  <span className="text-xs font-medium text-warning">Needed Help</span>
                  <span className="text-2xs text-ink-muted">+3 days</span>
                </button>
                <button onClick={() => handleRecall('forgot')} className="flex flex-col items-center gap-1.5 rounded-lg border border-danger/20 bg-danger/5 p-3 transition-colors hover:bg-danger/10">
                  <RotateCw className="h-5 w-5 text-danger" />
                  <span className="text-xs font-medium text-danger">Forgot</span>
                  <span className="text-2xs text-ink-muted">Tomorrow</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {recorded && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[80] animate-fade-up rounded-lg border border-success/20 bg-success/10 surface px-4 py-3 shadow-float" style={{ animationDuration: '0.3s' }}>
          <div className="flex items-center gap-2 text-sm text-success">
            <CheckCircle2 className="h-4 w-4" />
            Revision recorded for "{recorded.title}"
          </div>
        </div>
      )}
    </div>
  );
}
