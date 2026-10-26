import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, AlertCircle, MailCheck } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Logo } from '@/components/ui/Section';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Input, Button } from '@/components/ui/Form';

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);

  const handleSubmit = async () => {
    setError('');
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    setLoading(true);
    const result = await signup(name, email, password);
    setLoading(false);
    if (result.success && result.needsConfirmation) {
      setConfirmationSent(true);
    } else if (result.success) {
      navigate('/dashboard', { replace: true });
    } else {
      setError(result.error || 'Signup failed');
    }
  };

  if (confirmationSent) {
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
              We sent a confirmation link to <span className="font-medium text-ink-primary">{email}</span>. Click it to activate your account, then come back and log in.
            </p>
            <p className="mt-3 text-2xs text-ink-muted">Didn't get it? Check spam, or try signing up again in a minute.</p>
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
          <h1 className="mt-6 text-xl font-semibold text-ink-primary">Create your account</h1>
          <p className="mt-1 text-sm text-ink-secondary">Start your learning loop today.</p>
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
              label="Name"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              label="Password"
              type="password"
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />

            <Button variant="primary" className="w-full justify-center" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Creating account...' : 'Sign up'}
              {!loading && <ArrowRight className="h-3.5 w-3.5" />}
            </Button>
          </div>

          <div className="mt-4 rounded-lg border border-line bg-base-850/50 p-3 text-2xs text-ink-muted">
            By signing up, you agree to our <Link to="/terms" className="text-accent-400">Terms</Link> and <Link to="/privacy" className="text-accent-400">Privacy Policy</Link>. We'll send a confirmation link to your email.
          </div>
        </div>

        <p className="mt-4 text-center text-sm text-ink-secondary">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-accent-400 hover:text-accent-300">
            Log in
          </Link>
        </p>

        <p className="mt-2 text-center">
          <Link to="/" className="text-2xs text-ink-muted hover:text-ink-secondary">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
