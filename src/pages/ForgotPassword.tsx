import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, AlertCircle, MailCheck } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Logo } from '@/components/ui/Section';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Input, Button } from '@/components/ui/Form';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
    setError('');
    if (!email.trim()) {
      setError('Please enter your email.');
      return;
    }
    setLoading(true);
    const { error: err } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    setSent(true);
  };

  if (sent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base-950 px-4">
        <div className="w-full max-w-sm">
          <div className="mb-6 flex flex-col items-center">
            <Logo />
          </div>
          <div className="card p-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent-400/10">
              <MailCheck className="h-6 w-6 text-accent-400" />
            </div>
            <h1 className="text-lg font-semibold text-ink-primary">Check your inbox</h1>
            <p className="mt-2 text-sm text-ink-secondary">
              If an account exists for <span className="font-medium text-ink-primary">{email}</span>, we've sent a password reset link.
            </p>
            <Link to="/login" className="btn-secondary mt-5 w-full justify-center">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-base-950 px-4">
      <div className="absolute right-4 top-4">
        <ThemeToggle compact />
      </div>
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center">
          <Logo />
          <h1 className="mt-6 text-xl font-semibold text-ink-primary">Reset your password</h1>
          <p className="mt-1 text-sm text-ink-secondary">We'll email you a link to set a new one.</p>
        </div>

        <div className="card p-5">
          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-danger/20 bg-danger/5 p-3 text-xs text-danger">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}
          <div className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
            <Button variant="primary" className="w-full justify-center" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
              {!loading && <ArrowRight className="h-3.5 w-3.5" />}
            </Button>
          </div>
        </div>

        <p className="mt-4 text-center">
          <Link to="/login" className="text-sm font-medium text-accent-400 hover:text-accent-300">
            ← Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}
