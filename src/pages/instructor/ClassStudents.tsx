import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, Users, AlertTriangle, Copy, UserMinus, UserPlus } from 'lucide-react';
import { getClass, listClassMembers, removeClassMember, addClassMember, getUserStats, type DbClass, type UserStats } from '@/lib/api';
import { PageHeader, ProgressBar, EmptyState, Avatar } from '@/components/ui/Section';
import { ConfirmModal, Modal } from '@/components/ui/Modal';
import { Input, Button } from '@/components/ui/Form';
import { useToast } from '@/contexts/ToastContext';

interface StudentRow {
  id: string;
  name: string;
  email: string;
  stats: UserStats | null;
}

export default function ClassStudents() {
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [cls, setCls] = useState<DbClass | null>(null);
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [removeTarget, setRemoveTarget] = useState<StudentRow | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [addEmail, setAddEmail] = useState('');
  const [adding, setAdding] = useState(false);

  const load = async () => {
    if (!classId) return;
    setLoading(true);
    const c = await getClass(classId).catch(() => null);
    setCls(c);
    if (c) {
      const members = await listClassMembers(classId);
      const withStats = await Promise.all(
        members.map(async (m) => ({
          id: m.profiles.id,
          name: m.profiles.name,
          email: m.profiles.email,
          stats: await getUserStats(m.profiles.id).catch(() => null),
        }))
      );
      setStudents(withStats);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, [classId]);

  const filtered = students.filter((s) => !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase()));

  if (loading) return null;

  if (!cls) {
    return <EmptyState icon={AlertTriangle} title="Class not found" description="This class may have been removed." />;
  }

  const handleRemove = async () => {
    if (!removeTarget || !classId) return;
    await removeClassMember(classId, removeTarget.id);
    toast('Student removed from class.', 'warning');
    setRemoveTarget(null);
    load();
  };

  const handleAdd = async () => {
    if (!addEmail.trim() || !classId) return;
    setAdding(true);
    try {
      await addClassMember(classId, addEmail.trim());
      toast('Student added.');
      setAddOpen(false);
      setAddEmail('');
      load();
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Could not add student.', 'error');
    } finally {
      setAdding(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(cls.join_code);
    toast(`Enrollment code "${cls.join_code}" copied.`);
  };

  return (
    <div>
      <PageHeader
        title="Students"
        subtitle={`${cls.name} · ${students.length} enrolled`}
        actions={
          <>
            <button onClick={() => setAddOpen(true)} className="btn-secondary">
              <UserPlus className="h-3.5 w-3.5" />
              Add Student
            </button>
            <button onClick={handleCopyCode} className="btn-secondary">
              <Copy className="h-3.5 w-3.5" />
              Copy Code
            </button>
          </>
        }
      />

      {students.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No students enrolled yet"
          description="Share the enrollment code with your students, or add them by email."
          action={<button onClick={handleCopyCode} className="btn-primary"><Copy className="h-3.5 w-3.5" /> Copy Code</button>}
        />
      ) : (
        <>
          <div className="mb-4 relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="input-field pl-9"
            />
          </div>

          {filtered.length === 0 ? (
            <EmptyState icon={Search} title="No students found" description="Try adjusting your search." />
          ) : (
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-line text-2xs uppercase tracking-wider text-ink-faint">
                      <th className="px-4 py-3 font-medium">Student</th>
                      <th className="px-4 py-3 font-medium">Solved</th>
                      <th className="px-4 py-3 font-medium">Revision</th>
                      <th className="px-4 py-3 font-medium">Streak</th>
                      <th className="px-4 py-3 font-medium"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line/60">
                    {filtered.map((s) => (
                      <tr
                        key={s.id}
                        onClick={() => navigate(`/instructor/classes/${classId}/students/${s.id}`)}
                        className="cursor-pointer transition-colors hover:bg-base-hover"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <Avatar name={s.name || s.email} size={28} />
                            <div>
                              <div className="font-medium text-ink-primary">{s.name || '—'}</div>
                              <div className="text-2xs text-ink-muted">{s.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 font-medium text-ink-primary">{s.stats?.solved_total ?? 0}</td>
                        <td className="px-4 py-3 text-ink-secondary">{s.stats?.revision_success_rate ?? 0}%</td>
                        <td className="px-4 py-3 text-ink-secondary">{s.stats?.current_streak ?? 0}d</td>
                        <td className="px-4 py-3">
                          <button
                            onClick={(e) => { e.stopPropagation(); setRemoveTarget(s); }}
                            className="flex h-7 w-7 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-danger/10 hover:text-danger"
                            aria-label="Remove student"
                          >
                            <UserMinus className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      <ConfirmModal
        open={!!removeTarget}
        onClose={() => setRemoveTarget(null)}
        onConfirm={handleRemove}
        title="Remove Student"
        message="Are you sure you want to remove this student from the class?"
        confirmLabel="Remove"
        danger
      />

      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add Student"
        footer={
          <>
            <Button variant="secondary" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button variant="primary" disabled={adding} onClick={handleAdd}>Add</Button>
          </>
        }
      >
        <Input label="Student email" placeholder="student@example.com" value={addEmail} onChange={(e) => setAddEmail(e.target.value)} />
        <p className="mt-2 text-2xs text-ink-muted">The student must already have a CodeLoop account.</p>
      </Modal>
    </div>
  );
}
