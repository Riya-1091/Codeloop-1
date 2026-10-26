import { useEffect, useRef, useState, type ReactNode } from 'react';

export function Dropdown({
  trigger,
  children,
  align = 'right',
  width = 'w-56',
}: {
  trigger: ReactNode;
  children: (close: () => void) => ReactNode;
  align?: 'left' | 'right';
  width?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent && e.key === 'Escape') {
        setOpen(false);
        return;
      }
      if (e instanceof MouseEvent && ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('keydown', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('keydown', handler);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <div onClick={() => setOpen(!open)}>{trigger}</div>
      {open && (
        <div
          className={`absolute top-full mt-1 ${width} ${align === 'right' ? 'right-0' : 'left-0'} z-50 animate-fade-up rounded-lg border border-line surface py-1.5 shadow-float`}
          style={{ animationDuration: '0.15s' }}
        >
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  );
}

export function DropdownItem({
  icon: Icon,
  children,
  onClick,
  danger = false,
}: {
  icon?: typeof import('lucide-react').User;
  children: ReactNode;
  onClick?: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm transition-colors hover:bg-base-hover ${
        danger ? 'text-danger' : 'text-ink-secondary hover:text-ink-primary'
      }`}
    >
      {Icon && <Icon className="h-4 w-4 shrink-0" />}
      {children}
    </button>
  );
}

export function DropdownSeparator() {
  return <div className="my-1 h-px bg-line" />;
}

export function DropdownLabel({ children }: { children: ReactNode }) {
  return <div className="px-3 py-1.5 text-2xs font-semibold uppercase tracking-wider text-ink-faint">{children}</div>;
}
