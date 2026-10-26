import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Users, TrendingUp, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { listMyClasses } from '@/lib/api';
import { PageHeader, StatCard, EmptyState } from '@/components/ui/Section';

interface ClassRow {
  id: string;
  name: string;
  join_code: string;
  created_at: string;
  member_count: number;
}

export default function InstructorDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [loading, setLoading] = useState(true);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  useEffect(() => {
    if (!user) return;
    listMyClasses(user.id).then((c) => { setClasses(c); setLoading(false); });
  }, [user?.id]);

  const totalStudents = classes.reduce((sum, c) => sum + c.member_count, 0);

  return (
    <div>
      <PageHeader
        title={`${greeting}, ${user?.name || 'Instructor'}`}
        subtitle="Monitor your classes, track student progress, and identify who needs help."
        actions={
          <button onClick={() => navigate('/instructor/classes')} className="btn-primary">
            <Plus className="h-3.5 w-3.5" />
            Create Class
          </button>
        }
      />

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard icon={GraduationCap} label="Classes" value={classes.length} accent />
        <StatCard icon={Users} label="Total Students" value={totalStudents} />
        <StatCard icon={TrendingUp} label="Avg Class Size" value={classes.length > 0 ? Math.round(totalStudents / classes.length) : 0} />
      </div>

      <div className="card p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-ink-primary">My Classes</h3>
          <button onClick={() => navigate('/instructor/classes')} className="text-2xs text-accent-400 hover:text-accent-300">
            View all →
          </button>
        </div>
        {!loading && classes.length === 0 && (
          <EmptyState
            icon={GraduationCap}
            title="No classes yet"
            description="Create your first class to start monitoring student progress."
            action={<button onClick={() => navigate('/instructor/classes')} className="btn-primary">Create Class</button>}
          />
        )}
        <div className="space-y-3">
          {classes.map((cls) => (
            <button
              key={cls.id}
              onClick={() => navigate(`/instructor/classes/${cls.id}`)}
              className="w-full rounded-lg border border-line bg-base-850/50 p-4 text-left transition-colors hover:border-line-strong hover:bg-base-hover"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-ink-primary">{cls.name}</div>
                  <div className="mt-0.5 text-2xs text-ink-muted">{cls.member_count} students</div>
                </div>
                <span className="badge badge-success">active</span>
              </div>
              <div className="mt-2 flex items-center gap-4 text-2xs text-ink-muted">
                <span>Code: <span className="font-mono text-ink-secondary">{cls.join_code}</span></span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
