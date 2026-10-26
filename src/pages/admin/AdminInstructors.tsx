import { useEffect, useState } from 'react';
import { UserPlus, Mail, Copy, Check, ShieldCheck, GraduationCap } from 'lucide-react';
import { supabase, type Profile } from '@/lib/supabase';
import { PageHeader, Avatar } from '@/components/ui/Section';
import { Modal } from '@/components/ui/Modal';
import { Input, Textarea, Select, Button } from '@/components/ui/Form';
import { useToast } from '@/contexts/ToastContext';

function generatePassword() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789#!@';
  let pw = '';
  for (let i = 0; i < 12; i++) pw += chars[Math.floor(Math.random() * chars.length)];
  return pw;
}

export default function AdminInstructors() {
  const { toast } = useToast();
  const [staff, setStaff] = useState<Profile[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(generatePassword());
  const [role, setRole] = useState<'instructor' | 'admin'>('instructor');
  const [bio, setBio] = useState('');
  const [error, setError] = useState('');
  const [createdCreds, setCreatedCreds] = useState<{ email: string; password: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const loadStaff = async () => {
    setLoadingList(true);
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .in('role', ['instructor', 'admin'])
      .order('created_at', { ascending: false });
    setStaff((data as Profile[]) || []);
    setLoadingList(false);
  };

  useEffect(() => {
    loadStaff();
  }, []);

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword(generatePassword());
    setRole('instructor');
    setBio('');
    setError('');
  };

  const handleCreate = async () => {
    setError('');
    if (!name || !email || !password) {
      setError('Name, email and password are required.');
      return;
    }
    setCreating(true);
    const { data, error: fnError } = await supabase.functions.invoke('create-instructor', {
      body: { name, email, password, role, bio },
    });
    setCreating(false);

    if (fnError || data?.error) {
      setError(data?.error || fnError?.message || 'Failed to create account.');
      return;
    }

    setCreatedCreds({ email, password });
    toast(`${role === 'admin' ? 'Admin' : 'Instructor'} account created.`, 'success');
    resetForm();
    loadStaff();
  };

  const copyCreds = () => {
    if (!createdCreds) return;
    navigator.clipboard.writeText(`Email: ${createdCreds.email}\nPassword: ${createdCreds.password}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <PageHeader
        title="Instructors & Mentors"
        subtitle={`${staff.length} staff account${staff.length === 1 ? '' : 's'} with portal access`}
        actions={
          <Button variant="primary" size="sm" onClick={() => setOpen(true)}>
            <UserPlus className="h-3.5 w-3.5" />
            Add instructor
          </Button>
        }
      />

      <div className="mb-4 flex items-start gap-2 rounded-lg border border-line bg-base-850/50 p-3 text-xs text-ink-muted">
        <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-400" />
        <p>
          Only accounts created here can access <span className="font-mono text-ink-secondary">/instructor</span> or{' '}
          <span className="font-mono text-ink-secondary">/admin</span>. Every instructor/mentor gets their own email
          and password — students who sign up normally always get a student account and can never reach these areas.
        </p>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-line text-2xs uppercase tracking-wider text-ink-faint">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="hidden px-4 py-3 font-medium sm:table-cell">Email</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="hidden px-4 py-3 font-medium md:table-cell">Added</th>
              </tr>
            </thead>
            <tbody>
              {loadingList && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-ink-muted">
                    Loading...
                  </td>
                </tr>
              )}
              {!loadingList && staff.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-ink-muted">
                    No instructor or admin accounts yet.
                  </td>
                </tr>
              )}
              {staff.map((s) => (
                <tr key={s.id} className="border-b border-line-soft last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={s.name || s.email} size={28} />
                      <span className="font-medium text-ink-primary">{s.name || '—'}</span>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 text-ink-secondary sm:table-cell">{s.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-2xs font-medium ${
                        s.role === 'admin' ? 'bg-danger/10 text-danger' : 'bg-accent-400/10 text-accent-400'
                      }`}
                    >
                      {s.role === 'admin' ? <ShieldCheck className="h-3 w-3" /> : <GraduationCap className="h-3 w-3" />}
                      {s.role}
                    </span>
                  </td>
                  <td className="hidden px-4 py-3 text-ink-muted md:table-cell">
                    {new Date(s.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
          resetForm();
        }}
        title="Add instructor / mentor"
        footer={
          <>
            <button className="btn-secondary" onClick={() => setOpen(false)}>
              Cancel
            </button>
            <Button variant="primary" onClick={handleCreate} disabled={creating}>
              {creating ? 'Creating...' : 'Create account'}
            </Button>
          </>
        }
      >
        <div className="space-y-3.5">
          {error && (
            <div className="rounded-lg border border-danger/20 bg-danger/5 p-2.5 text-xs text-danger">{error}</div>
          )}
          <Input label="Full name" placeholder="e.g. Priya Verma" value={name} onChange={(e) => setName(e.target.value)} />
          <Input
            label="Email"
            type="email"
            placeholder="teacher@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-secondary">Temporary password</label>
            <div className="flex gap-2">
              <input className="input-field flex-1 font-mono" value={password} onChange={(e) => setPassword(e.target.value)} />
              <button type="button" className="btn-secondary shrink-0 text-xs" onClick={() => setPassword(generatePassword())}>
                Regenerate
              </button>
            </div>
            <p className="mt-1 text-2xs text-ink-muted">Share this with them securely — they can change it after logging in.</p>
          </div>
          <Select label="Access level" value={role} onChange={(e) => setRole(e.target.value as 'instructor' | 'admin')}>
            <option value="instructor">Instructor / Bootcamp mentor</option>
            <option value="admin">Admin</option>
          </Select>
          <Textarea label="Bio (optional)" placeholder="Short bio shown on their profile" value={bio} onChange={(e) => setBio(e.target.value)} />
        </div>
      </Modal>

      <Modal
        open={!!createdCreds}
        onClose={() => setCreatedCreds(null)}
        title="Account created"
        size="sm"
        footer={
          <button className="btn-primary" onClick={() => setCreatedCreds(null)}>
            Done
          </button>
        }
      >
        {createdCreds && (
          <div className="space-y-3">
            <p className="flex items-center gap-1.5 text-sm text-ink-secondary">
              <Mail className="h-3.5 w-3.5" /> Send these credentials to the instructor:
            </p>
            <div className="rounded-lg border border-line bg-base-850/50 p-3 font-mono text-xs text-ink-primary">
              <div>Email: {createdCreds.email}</div>
              <div>Password: {createdCreds.password}</div>
            </div>
            <button onClick={copyCreds} className="btn-secondary w-full justify-center text-xs">
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? 'Copied' : 'Copy to clipboard'}
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}
