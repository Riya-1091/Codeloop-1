import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent-400/10">
        <Compass className="h-6 w-6 text-accent-400" />
      </div>
      <h1 className="text-xl font-semibold text-ink-primary">Page not found</h1>
      <p className="mt-2 max-w-sm text-sm text-ink-secondary">
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <div className="mt-5 flex gap-2">
        <Link to="/" className="btn-secondary">Home</Link>
        <Link to="/dashboard" className="btn-primary">Dashboard</Link>
      </div>
    </div>
  );
}
