import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Users, TrendingUp, Target, Copy, AlertTriangle } from 'lucide-react';
import { getClass, listClassMembers, getUserStats, type DbClass, type UserStats } from '@/lib/api';
import { PageHeader, StatCard, EmptyState, Avatar } from '@/components/ui/Section';
import { useToast } from '@/contexts/ToastContext';

interface StudentRow {
  id: string;
  name: string;
  email: string;
  stats: UserStats | null;
}

export default function ClassOverview() {
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [cls, setCls] = useState<DbClass | null>(null);
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!classId) return;
    (async () => {
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
    })();
  }, [classId]);

  if (loading) return null;

  if (!cls) {
    return <EmptyState icon={AlertTriangle} title="Class not found" description="This class may have been removed." />;
  }

  const copyCode = () => {
    navigator.clipboard.writeText(cls.join_code);
    toast(`Code "${cls.join_code}" copied.`);
  };

  if (students.length === 0) {
    return (
      <div>
        <PageHeader title={cls.name} />
        <EmptyState
          icon={Users}
          title="No students enrolled yet"
          description="Share the enrollment code with your students to get started."
          action={<button onClick={copyCode} className="btn-primary"><Copy className="h-3.5 w-3.5" /> Copy Enrollment Code</button>}
        />
      </div>
    );
  }

  const totalSolved = students.reduce((sum, s) => sum + (s.stats?.solved_total ?? 0), 0);
  const avgSolved = Math.round(totalSolved / students.length);
  const avgRevision = Math.round(students.reduce((sum, s) => sum + (s.stats?.revision_success_rate ?? 0), 0) / students.length);
  const inactive = students.filter((s) => (s.stats?.current_streak ?? 0) === 0);
  const topStudents = [...students].sort((a, b) => (b.stats?.solved_total ?? 0) - (a.stats?.solved_total ?? 0)).slice(0, 5);

  return (
    <div>
      <PageHeader
        title={cls.name}
        actions={
          <button onClick={copyCode} className="btn-secondary">
            <Copy className="h-3.5 w-3.5" />
            Copy Code · {cls.join_code}
          </button>
        }
      />

      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard icon={Users} label="Total Students" value={students.length} accent />
        <StatCard icon={TrendingUp} label="Avg Problems Solved" value={avgSolved} />
        <StatCard icon={Target} label="Avg Revision Success" value={`${avgRevision}%`} />
        <StatCard icon={AlertTriangle} label="No Active Streak" value={inactive.length} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card lg:col-span-2 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-ink-primary">Top Students</h3>
            <button onClick={() => navigate(`/instructor/classes/${classId}/leaderboard`)} className="text-2xs text-accent-400 hover:text-accent-300">
              Full leaderboard →
            </button>
          </div>
          <div className="space-y-2">
            {topStudents.map((s) => (
              <button
                key={s.id}
                onClick={() => navigate(`/instructor/classes/${classId}/students/${s.id}`)}
                className="flex w-full items-center justify-between rounded-lg border border-line bg-base-850/50 p-2.5 text-left transition-colors hover:bg-base-hover"
              >
                <div className="flex items-center gap-2.5">
                  <Avatar name={s.name || s.email} size={28} />
                  <div>
                    <div className="text-sm font-medium text-ink-primary">{s.name || s.email}</div>
                    <div className="text-2xs text-ink-muted">{s.stats?.current_streak ?? 0}d streak</div>
                  </div>
                </div>
                <span className="text-sm font-semibold text-accent-400">{s.stats?.solved_total ?? 0}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="card p-4">
          <h3 className="mb-3 text-sm font-semibold text-ink-primary">Actions</h3>
          <div className="space-y-2">
            <button onClick={() => navigate(`/instructor/classes/${classId}/students`)} className="btn-secondary w-full justify-start">
              <Users className="h-3.5 w-3.5" />
              Manage Students
            </button>
            <button onClick={() => navigate(`/instructor/classes/${classId}/leaderboard`)} className="btn-secondary w-full justify-start">
              <Target className="h-3.5 w-3.5" />
              Leaderboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
