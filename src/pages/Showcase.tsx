import { useState, useEffect } from 'react';
import { Edit3, Copy, RefreshCw, CheckCircle2, Flame, RotateCw, Github, Code2, TrendingUp, Share2, Linkedin } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { PremiumPage } from '@/components/ui/PremiumOverlay';
import { getUserStats, listProblems, type UserStats, type DbProblem } from '@/lib/api';
import { PageHeader, ProgressBar } from '@/components/ui/Section';
import { useToast } from '@/contexts/ToastContext';

function ShowcaseInner() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [problems, setProblems] = useState<DbProblem[]>([]);
  const [post, setPost] = useState('');

  const buildPost = (st: UserStats, ps: DbProblem[]) => {
    const weekAgo = Date.now() - 7 * 86400000;
    const week = ps.filter((p) => new Date(p.solved_at).getTime() > weekAgo);
    const revised = ps.filter((p) => p.last_reviewed_at && new Date(p.last_reviewed_at).getTime() > weekAgo).length;
    const topics = new Map<string, number>();
    ps.forEach((p) => topics.set(p.topic, (topics.get(p.topic) || 0) + 1));
    const top = Array.from(topics.entries()).sort((a, b) => b[1] - a[1])[0]?.[0];
    const latest = week.slice(0, 2).map((p) => p.title).join(' and ');
    return `This week I solved ${week.length} problem${week.length === 1 ? '' : 's'} and completed ${revised} revision${revised === 1 ? '' : 's'}.` +
      (latest ? ` Recently worked on ${latest}.` : '') +
      ` My revision success rate is ${st.revision_success_rate}%.` +
      (top ? ` Most practiced topic: ${top}.` : '') +
      ` Streak: ${st.current_streak} day${st.current_streak === 1 ? '' : 's'} and counting. #CodeLoop`;
  };

  useEffect(() => {
    if (!user) return;
    Promise.all([getUserStats(user.id), listProblems(user.id)]).then(([st, ps]) => {
      setStats(st); setProblems(ps); setPost(buildPost(st, ps));
    });
  }, [user?.id]);

  const topicMap = new Map<string, number>();
  problems.forEach((p) => topicMap.set(p.topic, (topicMap.get(p.topic) || 0) + 1));
  const topicProgress = Array.from(topicMap.entries())
    .map(([topic, solved]) => ({ topic, solved, pct: Math.min(100, Math.round((solved / 15) * 100)) }))
    .sort((a, b) => b.solved - a.solved);
  const [editing, setEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(post);
    setCopied(true);
    toast('Copied to clipboard.');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerate = () => {
    if (stats) setPost(buildPost(stats, problems));
    toast('Post regenerated from your latest activity.', 'info');
  };

  return (
    <div>
      <PageHeader
        title="Showcase"
        subtitle="Turn your coding activity into professional developer updates."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Left: Learning summary */}
        <div className="space-y-4">
          <div className="card p-4">
            <h3 className="mb-3 text-sm font-semibold text-ink-primary">Learning Summary</h3>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-ink-secondary"><Code2 className="h-3.5 w-3.5" /> Problems solved</span>
                <span className="font-semibold text-ink-primary">{stats?.solved_total ?? 0}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-ink-secondary"><Flame className="h-3.5 w-3.5" /> Current streak</span>
                <span className="font-semibold text-ink-primary">{stats?.current_streak ?? 0} days</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-ink-secondary"><RotateCw className="h-3.5 w-3.5" /> Revisions done</span>
                <span className="font-semibold text-ink-primary">{stats?.revision_total ?? 0}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-ink-secondary"><TrendingUp className="h-3.5 w-3.5" /> Revision success</span>
                <span className="font-semibold text-ink-primary">{stats?.revision_success_rate ?? 0}%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-ink-secondary"><Github className="h-3.5 w-3.5" /> GitHub syncs</span>
                <span className="font-semibold text-ink-primary">{stats?.github_syncs ?? 0}</span>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <h3 className="mb-3 text-sm font-semibold text-ink-primary">Top Topics</h3>
            <div className="space-y-2.5">
              {topicProgress.slice(0, 4).map((t) => (
                <div key={t.topic}>
                  <div className="mb-1 flex items-center justify-between text-2xs">
                    <span className="font-medium text-ink-secondary">{t.topic}</span>
                    <span className="text-ink-muted">{t.solved}</span>
                  </div>
                  <ProgressBar pct={t.pct} accent={t.pct >= 70} />
                </div>
              ))}
            </div>
          </div>

          <div className="card p-4">
            <h3 className="mb-3 text-sm font-semibold text-ink-primary">Achievements</h3>
            <div className="space-y-2">
              {[
                { title: '7-Day Streak', icon: Flame, on: (stats?.longest_streak ?? 0) >= 7 },
                { title: '100 Problems', icon: CheckCircle2, on: (stats?.solved_total ?? 0) >= 100 },
                { title: 'Revision Master', icon: RotateCw, on: (stats?.revision_total ?? 0) >= 50 },
                { title: 'GitHub Connected', icon: Github, on: (stats?.github_syncs ?? 0) > 0 },
              ].map((a) => (
                <div key={a.title} className={`flex items-center gap-2.5 rounded-lg border border-line bg-base-850/50 p-2.5 ${a.on ? '' : 'opacity-40'}`}>
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent-400/10">
                    <a.icon className="h-3.5 w-3.5 text-accent-400" />
                  </div>
                  <span className="text-xs font-medium text-ink-primary">{a.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Generated post */}
        <div className="lg:col-span-2">
          <div className="card p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-ink-primary">Learning Post</h3>
              <div className="flex items-center gap-1.5">
                <button onClick={() => setEditing(!editing)} className="btn-ghost p-1.5">
                  <Edit3 className="h-3.5 w-3.5" />
                </button>
                <button onClick={handleCopy} className="btn-ghost p-1.5">
                  {copied ? <CheckCircle2 className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
                <button onClick={handleRegenerate} className="btn-ghost p-1.5">
                  <RefreshCw className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {editing ? (
              <textarea
                value={post}
                onChange={(e) => setPost(e.target.value)}
                onBlur={() => setEditing(false)}
                autoFocus
                className="input-field min-h-[180px] resize-y font-sans text-sm"
              />
            ) : (
              <div className="rounded-lg border border-line bg-base-850/40 p-4">
                <p className="text-sm leading-relaxed text-ink-secondary">{post}</p>
              </div>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-4">
              <span className="text-2xs text-ink-muted">Share to:</span>
              <button
                onClick={() => toast('LinkedIn integration is planned for a future release.', 'info')}
                className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-base-850 px-3 py-1.5 text-xs font-medium text-ink-secondary transition-colors hover:bg-base-hover"
              >
                <Linkedin className="h-3.5 w-3.5" />
                LinkedIn
                <span className="badge badge-neutral text-[8px]">Soon</span>
              </button>
              <button
                onClick={() => toast('Twitter/X integration is planned.', 'info')}
                className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-base-850 px-3 py-1.5 text-xs font-medium text-ink-secondary transition-colors hover:bg-base-hover"
              >
                <Share2 className="h-3.5 w-3.5" />
                Copy link
              </button>
            </div>
          </div>

          {/* Preview card */}
          <div className="card mt-4 p-4">
            <div className="mb-3 text-2xs font-semibold uppercase tracking-wider text-ink-faint">Preview</div>
            <div className="rounded-lg border border-line p-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-accent-400 to-accent-600 font-semibold text-base-950" style={{ fontSize: 14 }}>AS</div>
                <div>
                  <div className="text-sm font-semibold text-ink-primary">Aman Sharma</div>
                  <div className="text-2xs text-ink-muted">@amansharma · just now</div>
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-ink-secondary">{post}</p>
              <div className="mt-3 flex items-center gap-4 text-2xs text-ink-muted">
                <span className="flex items-center gap-1"><Flame className="h-3 w-3" /> 27-day streak</span>
                <span className="flex items-center gap-1"><Code2 className="h-3 w-3" /> 124 solved</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Showcase() {
  const { isPremium } = useAuth();
  if (!isPremium) {
    return (
      <PremiumPage
        title="Showcase is a Premium feature"
        description="Turn your weekly progress into a ready-to-share learning post, generated from your real activity."
      />
    );
  }
  return <ShowcaseInner />;
}
