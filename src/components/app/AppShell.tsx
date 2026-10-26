import { useState, useEffect, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Sidebar } from '@/components/app/Sidebar';
import { UserMenu } from '@/components/app/UserMenu';
import { NotificationPanel } from '@/components/app/NotificationPanel';
import { CommandSearch, SearchTrigger } from '@/components/app/CommandSearch';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

const routeTitles: Record<string, { title: string; sub?: string }> = {
  '/dashboard': { title: 'Dashboard' },
  '/problems': { title: 'Problems' },
  '/problems/new': { title: 'Add Problem' },
  '/revision': { title: 'Revision Center' },
  '/github': { title: 'GitHub' },
  '/showcase': { title: 'Showcase' },
  '/analytics': { title: 'Analytics' },
  '/upgrade': { title: 'Upgrade' },
  '/profile': { title: 'Profile' },
  '/settings': { title: 'Settings' },
  '/help': { title: 'Help & FAQ' },
  '/about': { title: 'About' },
  '/contact': { title: 'Contact' },
  '/search': { title: 'Search' },
};

export function AppShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();

  // Close mobile nav on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Cmd/Ctrl+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  // Get page title
  const path = location.pathname;
  let titleInfo = routeTitles[path];
  if (!titleInfo && path.startsWith('/problems/')) {
    titleInfo = { title: 'Problem Details' };
  }
  const pageTitle = titleInfo?.title || 'CodeLoop';

  return (
    <div className="flex h-screen overflow-hidden bg-base-950">
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <Sidebar collapsed={collapsed} onToggleCollapse={() => setCollapsed(!collapsed)} />
      </div>

      {/* Mobile sidebar drawer */}
      <div className={`fixed inset-0 z-50 md:hidden ${mobileOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        <div
          className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${mobileOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setMobileOpen(false)}
        />
        <div
          className={`absolute left-0 top-0 h-full transition-transform duration-300 ease-smooth ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <div className="relative h-full">
            <Sidebar collapsed={false} onToggleCollapse={() => {}} onNavigate={() => setMobileOpen(false)} />
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-md text-ink-muted hover:bg-base-hover"
              aria-label="Close menu"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-line surface px-4">
          <button
            onClick={() => setMobileOpen(true)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-ink-secondary md:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-2">
            <h1 className="text-sm font-semibold text-ink-primary">{pageTitle}</h1>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <SearchTrigger onClick={() => setSearchOpen(true)} />
            <ThemeToggle compact />
            <NotificationPanel />
            <UserMenu />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
            {children}
          </div>
        </main>
      </div>

      <CommandSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
