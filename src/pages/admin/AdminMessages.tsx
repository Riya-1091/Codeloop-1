import { useEffect, useState } from 'react';
import { Check, RotateCcw } from 'lucide-react';
import { PageHeader } from '@/components/ui/Section';
import { useToast } from '@/contexts/ToastContext';
import { listContactMessages, setContactResolved, type DbContactMessage } from '@/lib/api';

export default function AdminMessages() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<DbContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => listContactMessages().then(setMessages).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const toggle = async (m: DbContactMessage) => {
    try {
      await setContactResolved(m.id, !m.resolved);
      load();
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Update failed.', 'error');
    }
  };

  return (
    <div>
      <PageHeader title="Messages" subtitle={`${messages.filter((m) => !m.resolved).length} unresolved · ${messages.length} total`} />
      {!loading && messages.length === 0 && <div className="card p-6 text-center text-sm text-ink-muted">No messages yet.</div>}
      <div className="space-y-3">
        {messages.map((m) => (
          <div key={m.id} className={`card p-4 ${m.resolved ? 'opacity-60' : ''}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-sm font-semibold text-ink-primary">{m.subject}</div>
                <div className="mt-0.5 text-2xs text-ink-muted">
                  {m.name} · <a href={`mailto:${m.email}`} className="text-accent-400">{m.email}</a> · {new Date(m.created_at).toLocaleString()}
                </div>
              </div>
              <button onClick={() => toggle(m)} className="btn-secondary shrink-0 text-xs">
                {m.resolved ? <RotateCcw className="h-3.5 w-3.5" /> : <Check className="h-3.5 w-3.5" />}
                {m.resolved ? 'Reopen' : 'Resolve'}
              </button>
            </div>
            <p className="mt-3 whitespace-pre-wrap text-sm text-ink-secondary">{m.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
