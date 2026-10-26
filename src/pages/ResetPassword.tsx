import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Logo } from '@/components/ui/Section';
import { Input, Button } from '@/components/ui/Form';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // The recovery link puts a session in the URL; detectSessionInUrl picks
    // it up automatically. We just wait for that session to exist.
    supabase.auth.getSession().then(({ data }) => setReady(!!data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') setReady(true);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const handleSubmit = async () => {
    setError('');
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    const { error: err } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    setDone(true);
    setTimeout(() => navigate('/dashboard', { replace: true }), 1500);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-base-950 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center">
          <Logo />
          <h1 className="mt-6 text-xl font-semibold text-ink-primary">Set a new password</h1>
        </div>

        <div className="card p-5">
          {!ready && !done && (
            <p className="text-sm text-ink-secondary">
              Verifying your reset link... If this doesn't update in a few seconds, the link may have expired — request a new one from the login page.
            </p>
          )}

          {ready && !done && (
            <>
              {error && (
                <div className="mb-4 flex items-center gap-2 rounded-lg border border-danger/20 bg-danger/5 p-3 text-xs text-danger">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}
              <div className="space-y-4">
                <Input
                  label="New password"
                  type="password"
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Input
                  label="Confirm new password"
                  type="password"
                  placeholder="Repeat password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                />
                <Button variant="primary" className="w-full justify-center" onClick={handleSubmit} disabled={loading}>
                  {loading ? 'Saving...' : 'Update Password'}
                  {!loading && <ArrowRight className="h-3.5 w-3.5" />}
                </Button>
              </div>
            </>
          )}

          {done && (
            <div className="flex items-center gap-2 text-sm text-success">
              <CheckCircle2 className="h-4 w-4" />
              Password updated. Redirecting...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
