import { useParams } from 'react-router-dom';
import { PageHeader } from '@/components/ui/Section';
import { AnalyticsView } from '@/components/instructor/AnalyticsView';

export default function ClassAnalytics() {
  const { classId } = useParams<{ classId: string }>();
  return (
    <div>
      <PageHeader title="Class Analytics" subtitle="Live metrics from your students' real activity." />
      {classId && <AnalyticsView classIds={[classId]} />}
    </div>
  );
}
