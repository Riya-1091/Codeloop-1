import { useNavigate } from 'react-router-dom';
import { User, Settings, Sun, Moon, HelpCircle, LogOut, Crown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Dropdown, DropdownItem, DropdownLabel, DropdownSeparator } from '@/components/ui/Dropdown';
import { Avatar } from '@/components/ui/Section';

export function UserMenu() {
  const { user, logout, isPremium } = useAuth();
  const { setTheme } = useTheme();
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <Dropdown
      trigger={
        <button className="flex items-center gap-2 rounded-lg p-1 transition-colors hover:bg-base-hover" aria-label="User menu">
          <Avatar name={user.name} size={28} />
        </button>
      }
    >
      {(close) => (
        <>
          <div className="px-3 py-2">
            <div className="text-sm font-medium text-ink-primary">{user.name}</div>
            <div className="text-2xs text-ink-muted">{user.email}</div>
          </div>
          <DropdownSeparator />
          <DropdownItem icon={User} onClick={() => { navigate('/profile'); close(); }}>
            Profile
          </DropdownItem>
          {!isPremium && (
            <DropdownItem icon={Crown} onClick={() => { navigate('/upgrade'); close(); }}>
              Upgrade to Premium
            </DropdownItem>
          )}
          <DropdownItem icon={Settings} onClick={() => { navigate('/settings'); close(); }}>
            Settings
          </DropdownItem>
          <DropdownItem icon={HelpCircle} onClick={() => { navigate('/help'); close(); }}>
            Help
          </DropdownItem>
          <DropdownSeparator />
          <DropdownLabel>Theme</DropdownLabel>
          <DropdownItem icon={Moon} onClick={() => { setTheme('dark'); close(); }}>
            Dark
          </DropdownItem>
          <DropdownItem icon={Sun} onClick={() => { setTheme('light'); close(); }}>
            Light
          </DropdownItem>
          <DropdownSeparator />
          <DropdownItem icon={LogOut} danger onClick={() => { logout(); navigate('/'); close(); }}>
            Logout
          </DropdownItem>
        </>
      )}
    </Dropdown>
  );
}
