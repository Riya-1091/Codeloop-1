import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Dropdown, DropdownItem, DropdownLabel } from '@/components/ui/Dropdown';

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { theme, setTheme } = useTheme();

  if (compact) {
    return (
      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-ink-secondary transition-colors hover:bg-base-hover hover:text-ink-primary"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </button>
    );
  }

  return (
    <Dropdown
      trigger={
        <button
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-ink-secondary transition-colors hover:bg-base-hover hover:text-ink-primary"
          aria-label="Theme options"
        >
          {theme === 'dark' ? <Moon className="h-4 w-4" /> : theme === 'light' ? <Sun className="h-4 w-4" /> : <Monitor className="h-4 w-4" />}
        </button>
      }
    >
      {(close) => (
        <>
          <DropdownLabel>Theme</DropdownLabel>
          <DropdownItem icon={Moon} onClick={() => { setTheme('dark'); close(); }}>
            Dark
            {theme === 'dark' && <span className="ml-auto text-accent-400">●</span>}
          </DropdownItem>
          <DropdownItem icon={Sun} onClick={() => { setTheme('light'); close(); }}>
            Light
            {theme === 'light' && <span className="ml-auto text-accent-400">●</span>}
          </DropdownItem>
          <DropdownItem icon={Monitor} onClick={() => { setTheme('system'); close(); }}>
            System
            {theme === 'system' && <span className="ml-auto text-accent-400">●</span>}
          </DropdownItem>
        </>
      )}
    </Dropdown>
  );
}
