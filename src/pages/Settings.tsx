import { useState } from 'react';
import { User, Shield, Palette, RotateCw, Github, Bell, Lock, Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { PageHeader } from '@/components/ui/Section';
import { Button } from '@/components/ui/Form';
import { useToast } from '@/contexts/ToastContext';
import { supabase } from '@/lib/supabase';
import { Link, useNavigate } from 'react-router-dom';
import { savePreferences, deleteMyAccount, getMyGithubConnection, type GithubConnection } from '@/lib/api';
import { useEffect } from 'react';
import { ALL_FEATURES_FREE } from '@/lib/site';

const sections = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'account', label: 'Account', icon: Shield },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'revision', label: 'Revision Preferences', icon: RotateCw },
  { id: 'github', label: 'GitHub', icon: Github },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Lock },
];

const themeOptions = [
  { id: 'dark', label: 'Dark', icon: Moon },
  { id: 'light', label: 'Light', icon: Sun },
  { id: 'system', label: 'System', icon: Monitor },
];

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { user, logout, refreshProfile, isPremium } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [active, setActive] = useState('appearance');
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', username: user?.username || '', bio: user?.bio || '' });
  const [savingProfile, setSavingProfile] = useState(false);
  const [pwForm, setPwForm] = useState({ next: '', confirm: '' });
  const [savingPw, setSavingPw] = useState(false);
  const saved = (user?.preferences || {}) as Record<string, unknown>;
  const [prefs, setPrefs] = useState({
    notify_revision: saved.notify_revision !== false,
    notify_github: saved.notify_github !== false,
    auto_github_sync: saved.auto_github_sync !== false,
    revision_schedule: (saved.revision_schedule as string) || 'standard',
  });
  const [ghConn, setGhConn] = useState<GithubConnection | null>(null);
  const [deleteEmail, setDeleteEmail] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    getMyGithubConnection().then(setGhConn).catch(() => setGhConn(null));
  }, []);

  const persistPrefs = async (next: typeof prefs) => {
    setPrefs(next);
    if (!user) return;
    try {
      await savePreferences(user.id, { ...saved, ...next });
      await refreshProfile();
      toast('Settings saved.');
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Could not save settings.', 'error');
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    setDeleting(true);
    try {
      await deleteMyAccount(deleteEmail.trim());
      await logout();
      navigate('/', { replace: true });
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Could not delete account.', 'error');
      setDeleting(false);
    }
  };

  const saveProfile = async () => {
    setSavingProfile(true);
    const { error } = await supabase
      .from('profiles')
      .update({ name: profileForm.name, username: profileForm.username, bio: profileForm.bio })
      .eq('id', user?.id);
    setSavingProfile(false);
    if (error) toast(error.message, 'error');
    else toast('Profile updated. Refresh to see changes everywhere.');
  };

  const changePassword = async () => {
    if (pwForm.next.length < 8) {
      toast('Password must be at least 8 characters.', 'error');
      return;
    }
    if (pwForm.next !== pwForm.confirm) {
      toast('Passwords do not match.', 'error');
      return;
    }
    setSavingPw(true);
    const { error } = await supabase.auth.updateUser({ password: pwForm.next });
    setSavingPw(false);
    if (error) toast(error.message, 'error');
    else {
      toast('Password changed.');
      setPwForm({ next: '', confirm: '' });
    }
  };

  const togglePref = (key: 'notify_revision' | 'notify_github' | 'auto_github_sync') => {
    persistPrefs({ ...prefs, [key]: !prefs[key] });
  };

  return (
    <div>
      <PageHeader title="Settings" subtitle="Manage your account and preferences." />

      <div className="grid gap-4 lg:grid-cols-4">
        {/* Settings sidebar */}
        <div className="lg:col-span-1">
          <div className="card p-2">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
                  active === s.id ? 'bg-accent-400/10 text-accent-400' : 'text-ink-secondary hover:bg-base-hover hover:text-ink-primary'
                }`}
              >
                <s.icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Settings content */}
        <div className="lg:col-span-3">
          {active === 'appearance' && (
            <div className="card p-5">
              <h3 className="mb-4 text-sm font-semibold text-ink-primary">Appearance</h3>
              <p className="mb-4 text-xs text-ink-secondary">Choose how CodeLoop looks to you. System will match your OS preference.</p>
              <div className="grid grid-cols-3 gap-3">
                {themeOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => { setTheme(opt.id as 'dark' | 'light' | 'system'); toast('Theme updated.'); }}
                    className={`flex flex-col items-center gap-2 rounded-lg border p-4 transition-all ${
                      theme === opt.id ? 'border-accent-400/40 bg-accent-400/5' : 'border-line hover:border-line-strong'
                    }`}
                  >
                    <opt.icon className={`h-5 w-5 ${theme === opt.id ? 'text-accent-400' : 'text-ink-muted'}`} />
                    <span className={`text-sm font-medium ${theme === opt.id ? 'text-ink-primary' : 'text-ink-secondary'}`}>{opt.label}</span>
                    {theme === opt.id && <div className="h-1 w-1 rounded-full bg-accent-400" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {active === 'profile' && (
            <div className="card p-5">
              <h3 className="mb-4 text-sm font-semibold text-ink-primary">Profile Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink-secondary">Name</label>
                  <input className="input-field" value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink-secondary">Username</label>
                  <input className="input-field" value={profileForm.username} onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })} />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink-secondary">Email</label>
                  <input className="input-field opacity-60" defaultValue={user?.email} disabled />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink-secondary">Bio</label>
                  <textarea className="input-field min-h-[80px] resize-y" value={profileForm.bio} onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })} />
                </div>
                <Button variant="primary" disabled={savingProfile} onClick={saveProfile}>Save Changes</Button>
              </div>
            </div>
          )}

          {active === 'account' && (
            <div className="card p-5">
              <h3 className="mb-4 text-sm font-semibold text-ink-primary">Account</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg border border-line p-3">
                  <div>
                    <div className="text-sm font-medium text-ink-primary">Account ID</div>
                    <div className="mt-0.5 font-mono text-2xs text-ink-muted">{user?.id}</div>
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-line p-3">
                  <div>
                    <div className="text-sm font-medium text-ink-primary">Plan</div>
                    <div className="mt-0.5 text-2xs text-ink-muted">
                      {user?.role !== 'student' ? 'Staff — all features included'
                        : ALL_FEATURES_FREE ? 'Free — all Premium features are unlocked for now'
                        : isPremium ? `Premium${user?.planExpiresAt ? ` until ${new Date(user.planExpiresAt).toLocaleDateString()}` : ''}`
                        : 'Free'}
                    </div>
                  </div>
                  {user?.role === 'student' && !isPremium && !ALL_FEATURES_FREE
                    ? <Link to="/upgrade" className="btn-primary text-xs">Upgrade</Link>
                    : <span className="badge badge-accent">{ALL_FEATURES_FREE ? 'Free' : isPremium ? 'Premium' : 'Free'}</span>}
                </div>
                <div className="flex items-center justify-between rounded-lg border border-line p-3">
                  <div>
                    <div className="text-sm font-medium text-ink-primary">Role</div>
                    <div className="mt-0.5 text-2xs text-ink-muted">{user?.role}</div>
                  </div>
                  <span className="badge badge-accent capitalize">{user?.role}</span>
                </div>
                {user?.role === 'student' && (
                  <div className="rounded-lg border border-danger/30 p-3">
                    <div className="text-sm font-medium text-danger">Delete account</div>
                    <p className="mt-1 text-2xs text-ink-muted">
                      Permanently deletes your profile, problems, notifications and GitHub connection. This cannot be undone.
                    </p>
                    <input
                      className="input-field mt-2.5"
                      placeholder={`Type your email (${user?.email}) to confirm`}
                      value={deleteEmail}
                      onChange={(e) => setDeleteEmail(e.target.value)}
                    />
                    <Button
                      variant="danger"
                      className="mt-2.5"
                      disabled={deleting || deleteEmail.trim().toLowerCase() !== (user?.email || '').toLowerCase()}
                      onClick={handleDeleteAccount}
                    >
                      {deleting ? 'Deleting...' : 'Delete my account'}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {active === 'revision' && (
            <div className="card p-5">
              <h3 className="mb-4 text-sm font-semibold text-ink-primary">Revision Preferences</h3>
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink-secondary">Default Revision Schedule</label>
                  <select className="input-field" value={prefs.revision_schedule} onChange={(e) => persistPrefs({ ...prefs, revision_schedule: e.target.value })}>
                    <option value="standard">Standard (3d, 7d, 14d, 30d)</option>
                    <option value="aggressive" disabled={!isPremium}>Aggressive (1d, 3d, 7d, 14d){isPremium ? '' : ' — Premium'}</option>
                    <option value="relaxed" disabled={!isPremium}>Relaxed (7d, 14d, 30d, 60d){isPremium ? '' : ' — Premium'}</option>
                  </select>
                </div>
                <div className="rounded-lg border border-line bg-base-850/50 p-3 text-xs text-ink-muted">
                  Applies to your next revisions. When you recall a problem the gap grows step by step; if you forget it, it returns the next day.
                </div>
              </div>
            </div>
          )}

          {active === 'github' && (
            <div className="card p-5">
              <h3 className="mb-4 text-sm font-semibold text-ink-primary">GitHub Integration</h3>
              <div className="flex items-center justify-between rounded-lg border border-line p-3">
                <div className="flex items-center gap-3">
                  <Github className="h-5 w-5 text-ink-primary" />
                  <div>
                    <div className="text-sm font-medium text-ink-primary">Connection Status</div>
                    <div className="mt-0.5 text-2xs text-ink-muted">
                      {ghConn ? `Connected as @${ghConn.github_username} · ${ghConn.repo_name}` : 'Not connected'}
                    </div>
                  </div>
                </div>
                <span className={`badge ${ghConn ? 'badge-success' : 'badge-neutral'}`}>{ghConn ? 'Active' : 'Off'}</span>
              </div>
              <div className="mt-3 space-y-3">
                  <ToggleRow label="Auto-push new problems" desc="After you save a problem with solution code, push it to GitHub automatically" checked={prefs.auto_github_sync} onChange={() => togglePref('auto_github_sync')} />
                  <Link to="/github" className="btn-secondary inline-flex">Manage on GitHub page</Link>
                </div>
            </div>
          )}

          {active === 'notifications' && (
            <div className="card p-5">
              <h3 className="mb-4 text-sm font-semibold text-ink-primary">Notifications</h3>
              <div className="space-y-3">
                <ToggleRow label="Revision activity" desc="Show a notification each time you complete a revision" checked={prefs.notify_revision} onChange={() => togglePref('notify_revision')} />
                <ToggleRow label="GitHub sync" desc="Show a notification when a solution is synced to GitHub" checked={prefs.notify_github} onChange={() => togglePref('notify_github')} />
              </div>
            </div>
          )}

          {active === 'security' && (
            <div className="card p-5">
              <h3 className="mb-4 text-sm font-semibold text-ink-primary">Security</h3>
              <div className="space-y-3">
                <div className="rounded-lg border border-line p-3 space-y-2.5">
                  <div className="text-sm font-medium text-ink-primary">Change Password</div>
                  <input type="password" className="input-field" placeholder="New password" value={pwForm.next} onChange={(e) => setPwForm({ ...pwForm, next: e.target.value })} />
                  <input type="password" className="input-field" placeholder="Confirm new password" value={pwForm.confirm} onChange={(e) => setPwForm({ ...pwForm, confirm: e.target.value })} />
                  <Button variant="secondary" disabled={savingPw} onClick={changePassword}>
                    <Lock className="h-3.5 w-3.5" />
                    Update Password
                  </Button>
                </div>
                <div className="rounded-lg border border-line p-3">
                  <div className="text-sm font-medium text-ink-primary">Active Sessions</div>
                  <div className="mt-2 flex items-center gap-2 text-xs text-ink-muted">
                    <div className="h-2 w-2 rounded-full bg-success" />
                    <span>Current session · this device</span>
                  </div>
                </div>
                <Button variant="danger" onClick={() => { logout(); toast('Logged out successfully.'); }}>
                  Logout
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ToggleRow({ label, desc, checked, onChange }: { label: string; desc: string; checked: boolean; onChange: () => void }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-line p-3">
      <div>
        <div className="text-sm font-medium text-ink-primary">{label}</div>
        <div className="mt-0.5 text-2xs text-ink-muted">{desc}</div>
      </div>
      <button
        onClick={onChange}
        className={`relative h-6 w-11 rounded-full transition-colors ${checked ? 'bg-accent-400' : 'bg-base-700'}`}
        aria-label={label}
      >
        <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
      </button>
    </div>
  );
}
