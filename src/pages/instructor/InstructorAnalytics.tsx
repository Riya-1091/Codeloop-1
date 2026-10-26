import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { listMyClasses } from '@/lib/api';
import { PageHeader } from '@/components/ui/Section';
import { AnalyticsView } from '@/components/instructor/AnalyticsView';

export default function InstructorAnalytics() {
  const { user } = useAuth();
  const [ids, setIds] = useState<string[] | null>(null);

  useEffect(() => {
    if (user) listMyClasses(user.id).then((c) => setIds(c.map((x) => x.id)));
  }, [user?.id]);

  return (
    <div>
      <PageHeader title="Analytics" subtitle="Combined metrics across all your classes." />
      {ids && <AnalyticsView classIds={ids} />}
    </div>
  );
}
