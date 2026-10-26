import { useParams } from 'react-router-dom';
import { PageHeader } from '@/components/ui/Section';
import { ActivityView } from '@/components/instructor/ActivityView';

export default function ClassActivity() {
  const { classId } = useParams<{ classId: string }>();
  return (
    <div>
      <PageHeader title="Class Activity" subtitle="Latest solves, revisions and syncs in this class." />
      {classId && <ActivityView classIds={[classId]} />}
    </div>
  );
}
