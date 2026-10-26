import { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { Dropdown } from '@/components/ui/Dropdown';
import { useAuth } from '@/contexts/AuthContext';
import { listNotifications, markNotificationRead, type DbNotification } from '@/lib/api';

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function NotificationPanel() {
  const { user } = useAuth();
  const [notifs, setNotifs] = useState<DbNotification[]>([]);
  const unreadCount = notifs.filter((n) => !n.read).length;

  useEffect(() => {
    if (!user) return;
    listNotifications(user.id).then(setNotifs);
  }, [user?.id]);

  const markAllRead = async () => {
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
    await Promise.all(notifs.filter((n) => !n.read).map((n) => markNotificationRead(n.id)));
  };

  return (
    <Dropdown
      trigger={
        <button
          className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-line text-ink-secondary transition-colors hover:bg-base-hover hover:text-ink-primary"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-danger text-[8px] font-bold text-white">
              {unreadCount}
            </span>
          )}
        </button>
      }
      width="w-80"
    >
      {() => (
        <div>
          <div className="flex items-center justify-between border-b border-line px-3 py-2">
            <span className="text-sm font-semibold text-ink-primary">Notifications</span>
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="text-2xs text-accent-400 hover:text-accent-300">
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifs.length === 0 && (
              <div className="px-3 py-6 text-center text-2xs text-ink-muted">No notifications yet.</div>
            )}
            {notifs.map((n) => (
              <div
                key={n.id}
                className={`flex items-start gap-2.5 border-b border-line/60 px-3 py-2.5 transition-colors hover:bg-base-hover ${
                  !n.read ? 'bg-accent-400/[0.03]' : ''
                }`}
              >
                <div className={`mt-1 h-2 w-2 shrink-0 rounded-full ${!n.read ? 'bg-accent-400' : 'bg-transparent'}`} />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-medium text-ink-primary">{n.title}</div>
                  <div className="mt-0.5 text-2xs text-ink-secondary">{n.message}</div>
                  <div className="mt-1 text-2xs text-ink-faint">{timeAgo(n.created_at)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Dropdown>
  );
}
