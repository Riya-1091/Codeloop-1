import { type ReactNode, useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Menu, X, ChevronLeft, LayoutDashboard, GraduationCap, BarChart3, Activity, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Logo } from '@/components/ui/Section';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { getClass, type DbClass } from '@/lib/api';

const instructorNav = [
  { to: '/instructor', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/instructor/classes', label: 'My Classes', icon: GraduationCap },
  { to: '/instructor/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/instructor/activity', label: 'Activity', icon: Activity },
];

const classNavItems = [
  { suffix: '', label: 'Overview' },
  { suffix: '/students', label: 'Students' },
  { suffix: '/analytics', label: 'Analytics' },
  { suffix: '/activity', label: 'Activity' },
  { suffix: '/leaderboard', label: 'Leaderboard' },
];

const routeTitles: Record<string, string> = {
  '/instructor': 'Instructor Dashboard',
  '/instructor/classes': 'My Classes',
  '/instructor/analytics': 'Analytics',
  '/instructor/activity': 'Activity',
};

export function InstructorShell({ children }: { children: ReactNode }) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { classId } = useParams<{ classId?: string }>();

  const [activeClass, setActiveClass] = useState<DbClass | null>(null);

  useEffect(() => {
    if (!classId) { setActiveClass(null); return; }
    getClass(classId).then(setActiveClass).catch(() => setActiveClass(null));
  }, [classId]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const path = location.pathname;
  const isInClassContext = !!activeClass;
  const pageTitle = activeClass ? activeClass.name : routeTitles[path] || 'Instructor';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const linkClass = (isActive: boolean) =>
    `group relative flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors ${
      isActive
        ? 'bg-accent-400/10 text-accent-400'
        : 'text-ink-secondary hover:bg-base-hover hover:text-ink-primary'
    }`;

  const renderSidebarContent = () => {
    if (!isInClassContext) {
      return (
        <div className="space-y-0.5">
          {instructorNav.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/instructor'} onClick={() => setMobileOpen(false)} className={({ isActive }) => linkClass(isActive)}>
              <item.icon className="h-4 w-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      );
    }
    return (
      <div className="space-y-0.5">
        <button
          onClick={() => { navigate('/instructor/classes'); setMobileOpen(false); }}
          className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm font-medium text-ink-muted transition-colors hover:bg-base-hover hover:text-ink-secondary"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>All Classes</span>
        </button>
        <div className="mb-2 mt-3 px-2.5 text-2xs font-semibold uppercase tracking-wider text-ink-faint">
          {activeClass!.name.length > 28 ? activeClass!.name.slice(0, 28) + '...' : activeClass!.name}
        </div>
        {classNavItems.map((item) => {
          const to = `/instructor/classes/${classId}${item.suffix}`;
          return (
            <NavLink key={item.suffix} to={to} end={item.suffix === ''} onClick={() => setMobileOpen(false)} className={({ isActive }) => linkClass(isActive)}>
              <span className="ml-1">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex h-screen overflow-hidden bg-base-950">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-56 flex-col border-r border-line surface">
        <div className="flex h-14 shrink-0 items-center border-b border-line px-3">
          <button onClick={() => navigate('/instructor')} className="flex items-center">
            <Logo />
          </button>
        </div>
        <div className="border-b border-line px-3 py-2">
          <div className="flex items-center gap-2 rounded-lg bg-accent-400/10 px-2.5 py-1.5">
            <GraduationCap className="h-3.5 w-3.5 text-accent-400" />
            <span className="text-2xs font-bold uppercase tracking-wider text-accent-400">Instructor</span>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto px-2 py-3">
          {renderSidebarContent()}
        </nav>
        <div className="border-t border-line px-2 py-3">
          <div className="space-y-0.5">
            <button onClick={() => navigate('/settings')} className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium text-ink-secondary transition-colors hover:bg-base-hover hover:text-ink-primary">
              <Settings className="h-4 w-4 shrink-0" />
              <span>Settings</span>
            </button>
            <button onClick={() => navigate('/dashboard')} className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium text-ink-secondary transition-colors hover:bg-base-hover hover:text-ink-primary">
              <ChevronLeft className="h-4 w-4 shrink-0" />
              <span>Student View</span>
            </button>
            <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium text-danger transition-colors hover:bg-base-hover">
              <LogOut className="h-4 w-4 shrink-0" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar drawer */}
      <div className={`fixed inset-0 z-50 md:hidden ${mobileOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        <div
          className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${mobileOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setMobileOpen(false)}
        />
        <div className={`absolute left-0 top-0 h-full w-56 transition-transform duration-300 ease-smooth ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="relative flex h-full flex-col border-r border-line surface">
            <div className="flex h-14 shrink-0 items-center border-b border-line px-3">
              <Logo />
            </div>
            <div className="border-b border-line px-3 py-2">
              <div className="flex items-center gap-2 rounded-lg bg-accent-400/10 px-2.5 py-1.5">
                <GraduationCap className="h-3.5 w-3.5 text-accent-400" />
                <span className="text-2xs font-bold uppercase tracking-wider text-accent-400">Instructor</span>
              </div>
            </div>
            <nav className="flex-1 overflow-y-auto px-2 py-3">
              {renderSidebarContent()}
            </nav>
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

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-line surface px-4">
          <button
            onClick={() => setMobileOpen(true)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-ink-secondary md:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-4 w-4" />
          </button>
          <h1 className="text-sm font-semibold text-ink-primary truncate">{pageTitle}</h1>
          <div className="ml-auto flex items-center gap-2">
            <span className="hidden sm:inline text-2xs text-ink-muted">{user?.name}</span>
            <ThemeToggle compact />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
