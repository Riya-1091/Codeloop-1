import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Code2,
  Plus,
  RotateCw,
  Github,
  BarChart3,
  Globe,
  HelpCircle,
  Puzzle,
  Settings,
  User,
  ChevronLeft,
} from 'lucide-react';
import { Logo } from '@/components/ui/Section';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/problems', icon: Code2, label: 'Problems' },
  { to: '/revision', icon: RotateCw, label: 'Revision' },
  { to: '/github', icon: Github, label: 'GitHub' },
  { to: '/showcase', icon: Globe, label: 'Showcase' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
];

const workspaceItems = [
  { to: '/problems/new', icon: Plus, label: 'Add Problem' },
];

const bottomItems = [
  { to: '/extension', icon: Puzzle, label: 'Extension' },
  { to: '/help', icon: HelpCircle, label: 'Help' },
  { to: '/settings', icon: Settings, label: 'Settings' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export function Sidebar({
  collapsed,
  onToggleCollapse,
  onNavigate,
}: {
  collapsed: boolean;
  onToggleCollapse: () => void;
  onNavigate?: () => void;
}) {
  const navigate = useNavigate();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `group relative flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors ${
      isActive
        ? 'bg-accent-400/10 text-accent-400'
        : 'text-ink-secondary hover:bg-base-hover hover:text-ink-primary'
    }`;

  return (
    <aside
      className={`flex h-full flex-col border-r border-line surface transition-all duration-200 ${
        collapsed ? 'w-16' : 'w-56'
      }`}
    >
      {/* Logo */}
      <div className="flex h-14 shrink-0 items-center border-b border-line px-3">
        <button onClick={() => navigate('/dashboard')} className="flex items-center">
          {collapsed ? <Logo showText={false} /> : <Logo />}
        </button>
        {!collapsed && (
          <button
            onClick={onToggleCollapse}
            className="ml-auto flex h-6 w-6 items-center justify-center rounded-md text-ink-muted hover:bg-base-hover hover:text-ink-secondary"
            aria-label="Collapse sidebar"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Collapse expand button when collapsed */}
      {collapsed && (
        <button
          onClick={onToggleCollapse}
          className="mx-auto mt-2 flex h-6 w-6 items-center justify-center rounded-md text-ink-muted hover:bg-base-hover hover:text-ink-secondary"
          aria-label="Expand sidebar"
        >
          <ChevronLeft className="h-4 w-4 rotate-180" />
        </button>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-3">
        <div className="space-y-0.5">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} onClick={onNavigate} className={linkClass}>
              <item.icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
              {collapsed && (
                <span className="pointer-events-none absolute left-full ml-2 z-50 whitespace-nowrap rounded-md border border-line surface px-2 py-1 text-xs opacity-0 shadow-float transition-opacity group-hover:opacity-100">
                  {item.label}
                </span>
              )}
            </NavLink>
          ))}
        </div>

        {!collapsed && (
          <div className="mb-1 mt-5 px-2.5 text-2xs font-semibold uppercase tracking-wider text-ink-faint">
            Workspace
          </div>
        )}
        <div className="space-y-0.5">
          {workspaceItems.map((item) => (
            <NavLink key={item.to} to={item.to} onClick={onNavigate} className={linkClass}>
              <item.icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
              {collapsed && (
                <span className="pointer-events-none absolute left-full ml-2 z-50 whitespace-nowrap rounded-md border border-line surface px-2 py-1 text-xs opacity-0 shadow-float transition-opacity group-hover:opacity-100">
                  {item.label}
                </span>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Bottom */}
      <div className="border-t border-line px-2 py-3">
        <div className="space-y-0.5">
          {bottomItems.map((item) => (
            <NavLink key={item.to} to={item.to} onClick={onNavigate} className={linkClass}>
              <item.icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
              {collapsed && (
                <span className="pointer-events-none absolute left-full ml-2 z-50 whitespace-nowrap rounded-md border border-line surface px-2 py-1 text-xs opacity-0 shadow-float transition-opacity group-hover:opacity-100">
                  {item.label}
                </span>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </aside>
  );
}
