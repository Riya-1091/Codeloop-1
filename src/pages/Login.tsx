import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Logo } from '@/components/ui/Section';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Input, Button } from '@/components/ui/Form';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const from = (location.state as { from?: string })?.from || '/dashboard';

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      if (result.role === 'admin') {
        navigate('/admin', { replace: true });
      } else if (result.role === 'instructor') {
        navigate('/instructor', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } else {
      setError(result.error || 'Login failed');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-base-950 px-4">
      <div className="absolute right-4 top-4">
        <ThemeToggle compact />
      </div>
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center">
          <Logo />
          <h1 className="mt-6 text-xl font-semibold text-ink-primary">Welcome back</h1>
          <p className="mt-1 text-sm text-ink-secondary">Log in to continue your learning loop.</p>
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
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
            <div className="-mt-2 flex justify-end">
              <Link to="/forgot-password" className="text-2xs text-ink-muted hover:text-accent-400">
                Forgot password?
              </Link>
            </div>

            <Button variant="primary" className="w-full justify-center" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Signing in...' : 'Log in'}
              {!loading && <ArrowRight className="h-3.5 w-3.5" />}
            </Button>
          </div>

          <div className="mt-4 rounded-lg border border-line bg-base-850/50 p-3 text-2xs text-ink-muted">
            Instructor and admin accounts are created by an administrator. Signing up here always creates a student account.
          </div>
        </div>

        <p className="mt-4 text-center text-sm text-ink-secondary">
          Don't have an account?{' '}
          <Link to="/signup" className="font-medium text-accent-400 hover:text-accent-300">
            Sign up
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
