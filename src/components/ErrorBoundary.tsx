import { Component, type ErrorInfo, type ReactNode } from 'react';

interface State { hasError: boolean }

export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Unhandled UI error:', error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="flex min-h-screen items-center justify-center bg-base-950 px-4 text-center">
        <div className="max-w-sm">
          <h1 className="text-lg font-semibold text-ink-primary">Something went wrong</h1>
          <p className="mt-2 text-sm text-ink-secondary">
            An unexpected error occurred. Please reload the page. If it keeps happening, contact support.
          </p>
          <button onClick={() => window.location.assign('/')} className="btn-primary mt-5">
            Reload CodeLoop
          </button>
        </div>
      </div>
    );
  }
}
