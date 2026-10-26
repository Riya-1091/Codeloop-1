import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { listMyClasses } from '@/lib/api';
import { PageHeader } from '@/components/ui/Section';
import { ActivityView } from '@/components/instructor/ActivityView';

export default function InstructorActivity() {
  const { user } = useAuth();
  const [ids, setIds] = useState<string[] | null>(null);

  useEffect(() => {
    if (user) listMyClasses(user.id).then((c) => setIds(c.map((x) => x.id)));
  }, [user?.id]);

  return (
    <div>
      <PageHeader title="Activity" subtitle="Recent activity across all your classes." />
      {ids && <ActivityView classIds={ids} />}
    </div>
  );
}
