import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Users, Copy } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { listMyClasses, createClass } from '@/lib/api';
import { PageHeader, EmptyState } from '@/components/ui/Section';
import { Modal } from '@/components/ui/Modal';
import { Input, Button } from '@/components/ui/Form';
import { useToast } from '@/contexts/ToastContext';

interface ClassRow {
  id: string;
  name: string;
  join_code: string;
  created_at: string;
  member_count: number;
}

export default function ClassList() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [creating, setCreating] = useState(false);

  const load = () => {
    if (!user) return;
    listMyClasses(user.id).then((c) => { setClasses(c); setLoading(false); });
  };

  useEffect(load, [user?.id]);

  const filtered = classes.filter((c) => !search || c.name.toLowerCase().includes(search.toLowerCase()));

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast(`Enrollment code "${code}" copied to clipboard.`);
  };

  const handleCreate = async () => {
    if (!newName.trim() || !user) {
      toast('Please enter a class name.', 'warning');
      return;
    }
    setCreating(true);
    try {
      await createClass(user.id, newName.trim());
      toast('Class created.');
      setCreateOpen(false);
      setNewName('');
      load();
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Failed to create class.', 'error');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="My Classes"
        subtitle={`${classes.length} classes total`}
        actions={
          <button onClick={() => setCreateOpen(true)} className="btn-primary">
            <Plus className="h-3.5 w-3.5" />
            Create Class
          </button>
        }
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search classes..."
            className="input-field pl-9"
          />
        </div>
      </div>

      {!loading && filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No classes found"
          description="Create your first class to start monitoring student progress."
          action={<button onClick={() => setCreateOpen(true)} className="btn-primary"><Plus className="h-3.5 w-3.5" /> Create Class</button>}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((cls) => (
            <div
              key={cls.id}
              className="card cursor-pointer p-5 transition-colors hover:border-line-strong"
              onClick={() => navigate(`/instructor/classes/${cls.id}`)}
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-sm font-semibold text-ink-primary">{cls.name}</h3>
                <span className="badge badge-success">active</span>
              </div>

              <div className="mt-4 flex items-center gap-4 text-2xs text-ink-muted">
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {cls.member_count} students
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
                <div className="flex items-center gap-2 text-2xs">
                  <span className="text-ink-faint">Enrollment:</span>
                  <span className="font-mono font-medium text-ink-secondary">{cls.join_code}</span>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); handleCopyCode(cls.join_code); }}
                  className="flex h-7 w-7 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-base-hover hover:text-ink-primary"
                  aria-label="Copy enrollment code"
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create New Class"
        footer={
          <>
            <Button variant="secondary" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button variant="primary" disabled={creating} onClick={handleCreate}>Create Class</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Class Name"
            placeholder="e.g. Competitive Coding — Semester 4"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <p className="rounded-lg border border-line bg-base-850/50 p-3 text-2xs text-ink-muted">
            A unique enrollment code will be generated automatically. Students can use this code to join your class.
          </p>
        </div>
      </Modal>
    </div>
  );
}
