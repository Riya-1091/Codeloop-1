import { useState, useMemo, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, Ban, CheckCircle, Crown } from 'lucide-react';
import { PageHeader, Avatar } from '@/components/ui/Section';
import { ConfirmModal, Modal } from '@/components/ui/Modal';
import { useToast } from '@/contexts/ToastContext';
import { listAllUsers, setUserStatus, adminSetUserPlan, type StaffProfile } from '@/lib/api';

export default function AdminUsers() {
  const { toast } = useToast();
  const [users, setUsers] = useState<StaffProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [actionTarget, setActionTarget] = useState<{ user: StaffProfile; action: 'suspend' | 'activate' } | null>(null);
  const perPage = 8;
  const [planTarget, setPlanTarget] = useState<StaffProfile | null>(null);
  const [planDays, setPlanDays] = useState('30');

  const grantPremium = async () => {
    if (!planTarget) return;
    try {
      await adminSetUserPlan(planTarget.id, 'premium', Number(planDays));
      toast(`Premium granted to ${planTarget.name || planTarget.email} for ${planDays} days.`, 'success');
      load();
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Could not grant Premium.', 'error');
    }
    setPlanTarget(null);
  };

  const revokePremium = async (u: StaffProfile) => {
    try {
      await adminSetUserPlan(u.id, 'free');
      toast(`${u.name || u.email} moved to Free.`, 'warning');
      load();
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Could not change plan.', 'error');
    }
  };

  const load = () => {
    setLoading(true);
    listAllUsers().then((u) => { setUsers(u.filter((x) => x.role === 'student')); setLoading(false); });
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    return users.filter((u) => {
      if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false;
      if (statusFilter !== 'All' && u.status !== statusFilter.toLowerCase()) return false;
      return true;
    });
  }, [users, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageItems = filtered.slice((page - 1) * perPage, page * perPage);

  const confirmAction = async () => {
    if (!actionTarget) return;
    try {
      await setUserStatus(actionTarget.user.id, actionTarget.action === 'suspend' ? 'suspended' : 'active');
      toast(`${actionTarget.action === 'suspend' ? 'Suspended' : 'Activated'} ${actionTarget.user.name}.`, actionTarget.action === 'suspend' ? 'warning' : 'success');
      load();
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Action failed.', 'error');
    }
    setActionTarget(null);
  };

  return (
    <div>
      <PageHeader title="User Management" subtitle={`${filtered.length} students`} />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name or email..."
            className="input-field pl-9"
          />
        </div>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="input-field w-auto py-1.5 text-xs">
          <option>All</option>
          <option>Active</option>
          <option>Suspended</option>
        </select>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-line text-2xs uppercase tracking-wider text-ink-faint">
                <th className="px-4 py-3 font-medium">User</th>
                <th className="hidden px-4 py-3 font-medium sm:table-cell">Email</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Plan</th>
                <th className="hidden px-4 py-3 font-medium md:table-cell">Joined</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60">
              {loading && (
                <tr><td colSpan={5} className="px-4 py-6 text-center text-ink-muted">Loading...</td></tr>
              )}
              {!loading && pageItems.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-6 text-center text-ink-muted">No students found.</td></tr>
              )}
              {pageItems.map((u) => (
                <tr key={u.id} className="transition-colors hover:bg-base-hover">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={u.name || u.email} size={28} />
                      <span className="font-medium text-ink-primary">{u.name || '—'}</span>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 text-ink-secondary sm:table-cell">{u.email}</td>
                  <td className="px-4 py-3">
                    {u.status === 'active'
                      ? <span className="badge badge-success">Active</span>
                      : <span className="badge badge-danger">Suspended</span>}
                  </td>
                  <td className="px-4 py-3">
                    {u.plan === 'premium' && (!u.plan_expires_at || new Date(u.plan_expires_at) > new Date())
                      ? <span className="badge badge-accent" title={u.plan_expires_at ? `Until ${new Date(u.plan_expires_at).toLocaleDateString()}` : ''}>Premium</span>
                      : <span className="badge badge-neutral">Free</span>}
                  </td>
                  <td className="hidden px-4 py-3 text-ink-muted md:table-cell">{new Date(u.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {u.plan === 'premium' ? (
                        <button onClick={() => revokePremium(u)} className="flex h-6 w-6 items-center justify-center rounded-md text-ink-muted hover:bg-base-hover" aria-label="Revoke Premium" title="Revoke Premium">
                          <Crown className="h-3.5 w-3.5" />
                        </button>
                      ) : (
                        <button onClick={() => { setPlanDays('30'); setPlanTarget(u); }} className="flex h-6 w-6 items-center justify-center rounded-md text-accent-400 hover:bg-accent-400/10" aria-label="Grant Premium" title="Grant Premium">
                          <Crown className="h-3.5 w-3.5" />
                        </button>
                      )}
                      {u.status === 'active' ? (
                        <button onClick={() => setActionTarget({ user: u, action: 'suspend' })} className="flex h-6 w-6 items-center justify-center rounded-md text-warning hover:bg-warning/10" aria-label="Suspend">
                          <Ban className="h-3.5 w-3.5" />
                        </button>
                      ) : (
                        <button onClick={() => setActionTarget({ user: u, action: 'activate' })} className="flex h-6 w-6 items-center justify-center rounded-md text-success hover:bg-success/10" aria-label="Activate">
                          <CheckCircle className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-line px-4 py-3">
            <span className="text-2xs text-ink-muted">Page {page} of {totalPages}</span>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="flex h-7 w-7 items-center justify-center rounded-md border border-line text-ink-secondary disabled:opacity-30 hover:bg-base-hover">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="flex h-7 w-7 items-center justify-center rounded-md border border-line text-ink-secondary disabled:opacity-30 hover:bg-base-hover">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      <Modal
        open={!!planTarget}
        onClose={() => setPlanTarget(null)}
        title="Grant Premium"
        footer={
          <>
            <button onClick={() => setPlanTarget(null)} className="btn-secondary">Cancel</button>
            <button onClick={grantPremium} className="btn-primary">Grant</button>
          </>
        }
      >
        <p className="mb-3 text-sm text-ink-secondary">Give {planTarget?.name || planTarget?.email} Premium for how many days? (If they already have Premium, this extends it.)</p>
        <input type="number" min={1} max={3650} className="input-field" value={planDays} onChange={(e) => setPlanDays(e.target.value)} />
        <div className="mt-2 flex gap-2">
          {[30, 90, 365].map((d) => (
            <button key={d} onClick={() => setPlanDays(String(d))} className="btn-secondary text-xs">{d} days</button>
          ))}
        </div>
      </Modal>

      <ConfirmModal
        open={!!actionTarget}
        onClose={() => setActionTarget(null)}
        onConfirm={confirmAction}
        title={actionTarget?.action === 'suspend' ? 'Suspend User?' : 'Activate User?'}
        message={`Are you sure you want to ${actionTarget?.action} ${actionTarget?.user.name}?`}
        confirmLabel={actionTarget?.action === 'suspend' ? 'Suspend' : 'Activate'}
        danger={actionTarget?.action === 'suspend'}
      />
    </div>
  );
}
