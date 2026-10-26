import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Flame, CheckCircle2, RotateCw, TrendingUp, AlertTriangle, Github } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { getUserStats, listProblems, type UserStats, type DbProblem } from '@/lib/api';
import { StatCard, Avatar, EmptyState, DifficultyBadge } from '@/components/ui/Section';

interface StudentProfile {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

export default function StudentDetail() {
  const { classId, studentId } = useParams<{ classId: string; studentId: string }>();
  const navigate = useNavigate();
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [problems, setProblems] = useState<DbProblem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!studentId) return;
    (async () => {
      const { data } = await supabase.from('profiles').select('id, name, email, created_at').eq('id', studentId).maybeSingle();
      setStudent(data as StudentProfile | null);
      if (data) {
        const [s, p] = await Promise.all([getUserStats(studentId).catch(() => null), listProblems(studentId).catch(() => [])]);
        setStats(s);
        setProblems(p);
      }
      setLoading(false);
    })();
  }, [studentId]);

  if (loading) return null;

  if (!student) {
    return <EmptyState icon={AlertTriangle} title="Student not found" description="This student may have been removed from the class." />;
  }

  const recentProblems = problems.slice(0, 8);

  return (
    <div>
      <button
        onClick={() => navigate(`/instructor/classes/${classId}/students`)}
        className="mb-4 flex items-center gap-1.5 text-xs text-ink-muted transition-colors hover:text-ink-secondary"
      >
        <ChevronLeft className="h-3.5 w-3.5" />
        Back to Students
      </button>

      <div className="card mb-4 p-5">
        <div className="flex items-center gap-4">
          <Avatar name={student.name || student.email} size={56} />
          <div>
            <h1 className="text-lg font-semibold text-ink-primary">{student.name || '—'}</h1>
            <p className="mt-1 text-xs text-ink-faint">{student.email}</p>
            <p className="mt-1 text-2xs text-ink-muted">Joined {new Date(student.created_at).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard icon={CheckCircle2} label="Problems Solved" value={stats?.solved_total ?? 0} accent />
        <StatCard icon={Flame} label="Current Streak" value={stats?.current_streak ?? 0} />
        <StatCard icon={TrendingUp} label="Revision Success" value={`${stats?.revision_success_rate ?? 0}%`} />
        <StatCard icon={Github} label="GitHub Syncs" value={stats?.github_syncs ?? 0} />
      </div>

      <div className="mb-4 grid grid-cols-3 gap-3">
        <div className="card p-4 text-center">
          <div className="text-xl font-semibold text-success">{stats?.solved_easy ?? 0}</div>
          <div className="mt-0.5 text-2xs text-ink-muted">Easy</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-xl font-semibold text-warning">{stats?.solved_medium ?? 0}</div>
          <div className="mt-0.5 text-2xs text-ink-muted">Medium</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-xl font-semibold text-danger">{stats?.solved_hard ?? 0}</div>
          <div className="mt-0.5 text-2xs text-ink-muted">Hard</div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="flex items-center gap-2 border-b border-line px-4 py-3">
          <RotateCw className="h-3.5 w-3.5 text-ink-muted" />
          <h3 className="text-sm font-semibold text-ink-primary">Recent Problems</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-line text-2xs uppercase tracking-wider text-ink-faint">
                <th className="px-4 py-2.5 font-medium">Problem</th>
                <th className="px-4 py-2.5 font-medium">Topic</th>
                <th className="px-4 py-2.5 font-medium">Difficulty</th>
                <th className="px-4 py-2.5 font-medium">Solved</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60">
              {recentProblems.length === 0 && (
                <tr><td colSpan={4} className="px-4 py-6 text-center text-ink-muted">No problems logged yet.</td></tr>
              )}
              {recentProblems.map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-3 font-medium text-ink-primary">{p.title}</td>
                  <td className="px-4 py-3 text-ink-secondary">{p.topic}</td>
                  <td className="px-4 py-3"><DifficultyBadge difficulty={p.difficulty} /></td>
                  <td className="px-4 py-3 text-ink-muted">{new Date(p.solved_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
