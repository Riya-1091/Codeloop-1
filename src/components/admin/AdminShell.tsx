import { type ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  MessageSquare,
  Code2,
  BarChart3,
  ScrollText,
  Settings,
  ArrowLeft,
  LogOut,
  Shield,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Logo } from '@/components/ui/Section';

const adminNav = [
  { to: '/admin', icon: LayoutDashboard, label: 'Overview' },
  { to: '/admin/users', icon: Users, label: 'Users' },
  { to: '/admin/instructors', icon: GraduationCap, label: 'Instructors' },
  { to: '/admin/messages', icon: MessageSquare, label: 'Messages' },
  { to: '/admin/problems', icon: Code2, label: 'Problems' },
  { to: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/admin/audit-logs', icon: ScrollText, label: 'Audit Logs' },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors ${
      isActive ? 'bg-danger/10 text-danger' : 'text-ink-secondary hover:bg-base-hover hover:text-ink-primary'
    }`;

  return (
    <div className="flex h-screen overflow-hidden bg-base-950">
      <aside className="flex w-56 flex-col border-r border-line surface">
        <div className="flex h-14 shrink-0 items-center border-b border-line px-3">
          <Logo />
        </div>
        <div className="border-b border-line px-3 py-2">
          <div className="flex items-center gap-2 rounded-lg bg-danger/10 px-2.5 py-1.5">
            <Shield className="h-3.5 w-3.5 text-danger" />
            <span className="text-2xs font-bold uppercase tracking-wider text-danger">Admin Panel</span>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto px-2 py-3">
          <div className="space-y-0.5">
            {adminNav.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.to === '/admin'} className={linkClass}>
                <item.icon className="h-4 w-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
          <div className="mb-1 mt-5 px-2.5 text-2xs font-semibold uppercase tracking-wider text-ink-faint">
            System
          </div>
          <div className="space-y-0.5">
            <button onClick={() => navigate('/settings')} className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium text-ink-secondary transition-colors hover:bg-base-hover hover:text-ink-primary">
              <Settings className="h-4 w-4 shrink-0" />
              <span>Settings</span>
            </button>
            <button onClick={() => navigate('/dashboard')} className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium text-ink-secondary transition-colors hover:bg-base-hover hover:text-ink-primary">
              <ArrowLeft className="h-4 w-4 shrink-0" />
              <span>Back to CodeLoop</span>
            </button>
            <button onClick={() => { logout(); navigate('/'); }} className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium text-danger transition-colors hover:bg-base-hover">
              <LogOut className="h-4 w-4 shrink-0" />
              <span>Logout</span>
            </button>
          </div>
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-line surface px-4">
          <h1 className="text-sm font-semibold text-ink-primary">Admin Dashboard</h1>
          <div className="ml-auto flex items-center gap-2">
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
