import { useEffect, useRef, useState } from 'react';
import { Github, GitBranch, CheckCircle2, Link2, Unlink, Loader2 } from 'lucide-react';
import { PageHeader, Avatar } from '@/components/ui/Section';
import { Button } from '@/components/ui/Form';
import { ConfirmModal } from '@/components/ui/Modal';
import { useToast } from '@/contexts/ToastContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import {
  listProblems,
  getMyGithubConnection,
  connectGithub,
  disconnectGithub,
  type DbProblem,
  type GithubConnection,
} from '@/lib/api';

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function GitHub() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [disconnectOpen, setDisconnectOpen] = useState(false);
  const [problems, setProblems] = useState<DbProblem[]>([]);
  const [connection, setConnection] = useState<GithubConnection | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!user) return;
    const [probs, conn] = await Promise.all([listProblems(user.id), getMyGithubConnection()]);
    setProblems(probs);
    setConnection(conn);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // If GitHub/Supabase sent us back with an error (e.g. "identity already linked",
  // redirect URL not allowed), it is only in the URL — show it instead of failing silently.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    const desc = params.get('error_description') || hash.get('error_description');
    const code = params.get('error_code') || hash.get('error_code') || params.get('error') || hash.get('error');
    if (desc || code) {
      const text = (desc || code || '').replace(/\+/g, ' ');
      toast(
        /already linked/i.test(text)
          ? 'This GitHub account is already linked to another CodeLoop account. Use a different GitHub account, or log in with the account it is linked to.'
          : `GitHub connect failed: ${text}`,
        'error'
      );
      window.history.replaceState({}, '', window.location.pathname);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // After the GitHub OAuth redirect lands back here with a fresh session,
  // supabase-js exposes provider_token once — capture and store it server-side.
  // Runs on mount AND when the session event arrives, and only once per token.
  const handledToken = useRef<string | null>(null);
  useEffect(() => {
    const finishConnect = async (session: unknown) => {
      const token = (session as { provider_token?: string } | null)?.provider_token;
      if (!token || handledToken.current === token) return;
      handledToken.current = token;
      // A leftover token in the stored session must not re-run on every visit, but a
      // NEW token must always replace whatever (possibly expired) token is stored.
      const DONE_KEY = 'codeloop_gh_token_done';
      let last: string | null = null;
      try { last = localStorage.getItem(DONE_KEY); } catch { /* ignore */ }
      if (last === token) return;
      try {
        await connectGithub(token);
        try { localStorage.setItem(DONE_KEY, token); } catch { /* ignore */ }
        toast('GitHub connected — new access token saved.', 'success');
        load();
      } catch (e) {
        handledToken.current = null; // allow a retry with the same token
        toast(e instanceof Error ? e.message : 'Could not finish connecting GitHub.', 'error');
      }
    };

    supabase.auth.getSession().then(({ data }) => {
      if (!data.session?.provider_token && /[?&#](code|access_token)=/.test(window.location.href)) {
        toast('Came back from GitHub but no access token was received. Please click Connect GitHub again.', 'error');
      }
      finishConnect(data.session);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      // Defer: never await Supabase calls directly inside this callback.
      setTimeout(() => finishConnect(session), 0);
    });
    return () => sub.subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleConnect = async () => {
    setConnecting(true);
    const redirectOptions = { redirectTo: `${window.location.origin}/github`, scopes: 'repo', skipBrowserRedirect: true };
    // If GitHub is already linked to this login (e.g. an earlier attempt linked it but
    // saving the token failed), linking again errors out. Re-authorize instead: same
    // account, and it hands us a fresh GitHub token to store.
    const { data: idData } = await supabase.auth.getUserIdentities();
    const alreadyLinked = !!idData?.identities?.some((i) => i.provider === 'github');
    const { data, error } = alreadyLinked
      ? await supabase.auth.signInWithOAuth({ provider: 'github', options: redirectOptions })
      : await supabase.auth.linkIdentity({ provider: 'github', options: redirectOptions });
    if (error) {
      toast(error.message.includes('Manual linking')
        ? 'Manual linking is disabled in Supabase Auth settings — enable it first.'
        : error.message, 'error');
      setConnecting(false);
      return;
    }
    if (!data?.url) {
      toast('Supabase did not return a GitHub login URL. Check that the GitHub provider is enabled in Supabase Auth.', 'error');
      setConnecting(false);
      return;
    }
    window.location.assign(data.url); // browser goes to GitHub
  };

  const handleDisconnect = async () => {
    if (!user) return;
    try {
      await disconnectGithub(user.id);
      setConnection(null);
      toast('GitHub disconnected.', 'warning');
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Could not disconnect GitHub.', 'error');
    }
    setDisconnectOpen(false);
  };

  const synced = problems.filter((p) => p.github_synced).sort((a, b) => (b.github_synced_at || '').localeCompare(a.github_synced_at || ''));

  if (loading) return null;

  return (
    <div>
      <PageHeader
        title="GitHub Integration"
        subtitle="Turn your daily practice into a developer portfolio."
      />

      {/* Connection status */}
      <div className="card mb-4 p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            {connection ? (
              <Avatar name={connection.github_username} size={48} />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-base-800">
                <Github className="h-6 w-6 text-ink-primary" />
              </div>
            )}
            <div>
              {connection ? (
                <>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold text-ink-primary">Connected as @{connection.github_username}</h3>
                    <span className="badge badge-success"><CheckCircle2 className="h-2.5 w-2.5" /> Active</span>
                  </div>
                  <div className="mt-1 flex items-center gap-1 text-xs text-ink-muted">
                    <GitBranch className="h-3 w-3" />
                    <span className="font-mono">{connection.github_username}/{connection.repo_name}</span>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-base font-semibold text-ink-primary">GitHub not connected</h3>
                  <p className="mt-1 text-xs text-ink-muted">Connect to auto-commit your solved problems to a repo.</p>
                </>
              )}
            </div>
          </div>
          {connection ? (
            <div className="flex items-center gap-2">
              <Button variant="secondary" onClick={handleConnect} disabled={connecting}>
                {connecting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Github className="h-3.5 w-3.5" />}
                Reconnect
              </Button>
              <Button variant="danger" onClick={() => setDisconnectOpen(true)}>
                <Unlink className="h-3.5 w-3.5" />
                Disconnect
              </Button>
            </div>
          ) : (
            <Button variant="primary" onClick={handleConnect} disabled={connecting}>
              {connecting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Github className="h-3.5 w-3.5" />}
              Connect GitHub
            </Button>
          )}
        </div>
      </div>

      {!connection && (
        <div className="card mb-4 border-accent-400/20 p-4">
          <div className="flex items-start gap-3">
            <Link2 className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" />
            <p className="text-xs text-ink-secondary">
              We'll create a private repo (<span className="font-mono">codeloop-dsa</span>) in your GitHub account the first time you sync,
              and commit each solved problem there as a file, organized by topic.
            </p>
          </div>
        </div>
      )}

      {/* Sync history */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <h3 className="text-sm font-semibold text-ink-primary">Sync History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-line text-2xs uppercase tracking-wider text-ink-faint">
                <th className="px-4 py-2.5 font-medium">Problem</th>
                <th className="hidden px-4 py-2.5 font-medium sm:table-cell">File</th>
                <th className="hidden px-4 py-2.5 font-medium sm:table-cell">Commit</th>
                <th className="px-4 py-2.5 font-medium">Status</th>
                <th className="px-4 py-2.5 font-medium">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60">
              {synced.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-ink-muted">
                    No problems synced yet. Open a problem and hit "Sync to GitHub".
                  </td>
                </tr>
              )}
              {synced.map((sync) => (
                <tr key={sync.id} className="transition-colors hover:bg-base-hover">
                  <td className="px-4 py-3 font-medium text-ink-primary">{sync.title}</td>
                  <td className="hidden px-4 py-3 font-mono text-ink-muted sm:table-cell">{sync.github_file}</td>
                  <td className="hidden px-4 py-3 font-mono text-ink-muted sm:table-cell">{sync.github_commit}</td>
                  <td className="px-4 py-3">
                    <span className="badge badge-success">
                      <CheckCircle2 className="h-2.5 w-2.5" />
                      Synced
                    </span>
                  </td>
                  <td className="px-4 py-3 text-ink-muted">{sync.github_synced_at ? timeAgo(sync.github_synced_at) : ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal
        open={disconnectOpen}
        onClose={() => setDisconnectOpen(false)}
        onConfirm={handleDisconnect}
        title="Disconnect GitHub?"
        message="Future problems won't sync automatically. Already-synced files stay in your repo."
        confirmLabel="Disconnect"
        danger
      />
    </div>
  );
}
