import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, RotateCw } from 'lucide-react';
import { PageHeader } from '@/components/ui/Section';
import { Input, Textarea, Select, Button } from '@/components/ui/Form';
import { useToast } from '@/contexts/ToastContext';
import { useAuth } from '@/contexts/AuthContext';
import { createProblem, countMyProblems, getMyGithubConnection, syncProblemToGithub, type ProblemPlatform, type Difficulty } from '@/lib/api';
import { FREE_PROBLEM_LIMIT } from '@/lib/site';

export default function AddProblem() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isPremium } = useAuth();
  const [saving, setSaving] = useState(false);
  const [count, setCount] = useState(0);
  const [ghConnected, setGhConnected] = useState(false);
  const [autoPush, setAutoPush] = useState(user?.preferences?.auto_github_sync !== false);

  useEffect(() => {
    if (!user) return;
    countMyProblems(user.id).then(setCount).catch(() => {});
    getMyGithubConnection().then((c) => setGhConnected(!!c)).catch(() => {});
  }, [user?.id]);

  const atLimit = !isPremium && count >= FREE_PROBLEM_LIMIT;
  const [form, setForm] = useState({
    name: '',
    url: '',
    platform: 'LeetCode',
    topic: '',
    difficulty: 'Easy',
    language: 'Python',
    solution: '',
    notes: '',
    tags: '',
  });

  const update = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  const validate = () => {
    if (!form.name.trim()) return 'Problem name is required';
    if (!form.topic.trim()) return 'Topic is required';
    return null;
  };

  const handleSave = async (scheduleRevision = false) => {
    const error = validate();
    if (error) {
      toast(error, 'error');
      return;
    }
    if (!user) return;
    if (atLimit) {
      toast(`Free plan is limited to ${FREE_PROBLEM_LIMIT} problems. Upgrade to add more.`, 'warning');
      navigate('/upgrade');
      return;
    }
    setSaving(true);
    try {
      const created = await createProblem(user.id, {
        title: form.name.trim(),
        url: form.url.trim(),
        platform: form.platform as ProblemPlatform,
        topic: form.topic.trim(),
        difficulty: form.difficulty as Difficulty,
        language: form.language,
        solution: form.solution,
        notes: form.tags ? `${form.notes}\n\nTags: ${form.tags}` : form.notes,
        status: scheduleRevision ? 'Revision Due' : 'Solved',
        next_review_at: scheduleRevision ? new Date(Date.now() + 3 * 86400000).toISOString() : null,
      });
      let message = scheduleRevision ? 'Problem saved and revision scheduled.' : 'Problem saved successfully.';
      if (ghConnected && autoPush) {
        if (form.solution.trim()) {
          try {
            const r = await syncProblemToGithub(created.id);
            message += ` Pushed to GitHub (${r.commit}).`;
          } catch (err) {
            message += ` GitHub push failed: ${err instanceof Error ? err.message : 'unknown error'}`;
          }
        } else {
          message += ' Add solution code to push it to GitHub.';
        }
      }
      toast(message);
      navigate('/problems');
    } catch (e) {
      const msg = e instanceof Error ? e.message : (e as { message?: string })?.message || 'Failed to save problem.';
      if (msg.includes('FREE_LIMIT_REACHED')) {
        toast(`Free plan is limited to ${FREE_PROBLEM_LIMIT} problems. Upgrade to add more.`, 'warning');
        navigate('/upgrade');
      } else {
        toast(msg, 'error');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <button onClick={() => navigate('/problems')} className="btn-ghost mb-4 -ml-3">
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Problems
      </button>

      <PageHeader title="Add Problem" subtitle="Capture a solved problem into your learning loop." />

      <div className="card space-y-4 p-5">
        <Input
          label="Problem Name"
          placeholder="e.g. Two Sum"
          value={form.name}
          onChange={(e) => update('name', e.target.value)}
        />
        <Input
          label="Problem URL"
          placeholder="https://leetcode.com/problems/..."
          value={form.url}
          onChange={(e) => update('url', e.target.value)}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Select label="Platform" value={form.platform} onChange={(e) => update('platform', e.target.value)}>
            <option>LeetCode</option>
            <option>GeeksforGeeks</option>
            <option>Codeforces</option>
            <option>HackerRank</option>
            <option>CodeChef</option>
          </Select>
          <Input
            label="Topic"
            placeholder="e.g. Hashing, Arrays, Trees"
            value={form.topic}
            onChange={(e) => update('topic', e.target.value)}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Select label="Difficulty" value={form.difficulty} onChange={(e) => update('difficulty', e.target.value)}>
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </Select>
          <Select label="Language" value={form.language} onChange={(e) => update('language', e.target.value)}>
            <option>Python</option>
            <option>C++</option>
            <option>Java</option>
            <option>JavaScript</option>
            <option>Go</option>
          </Select>
        </div>
        <Textarea
          label="Solution"
          placeholder="Paste your solution code here..."
          value={form.solution}
          onChange={(e) => update('solution', e.target.value)}
          rows={6}
        />
        <Textarea
          label="Notes"
          placeholder="Approach, time complexity, key insights..."
          value={form.notes}
          onChange={(e) => update('notes', e.target.value)}
          rows={3}
        />
        <Input
          label="Tags (optional)"
          placeholder="hashmap, two-pass, optimization"
          value={form.tags}
          onChange={(e) => update('tags', e.target.value)}
        />

        {atLimit && (
          <div className="rounded-lg border border-warning/30 bg-warning/5 p-3 text-xs text-ink-secondary">
            You've used all {FREE_PROBLEM_LIMIT} free problems. <Link to="/upgrade" className="font-medium text-accent-400">Upgrade to Premium</Link> to keep adding.
          </div>
        )}
        <label className="flex items-start gap-2 text-xs text-ink-secondary">
            <input
              type="checkbox"
              className="mt-0.5"
              checked={autoPush && ghConnected}
              disabled={!ghConnected}
              onChange={(e) => setAutoPush(e.target.checked)}
            />
            <span>
              Push this solution to GitHub after saving
              {!ghConnected && <> — <Link to="/github" className="text-accent-400">connect GitHub</Link> to enable</>}
            </span>
          </label>

        <div className="flex items-center justify-end gap-2 border-t border-line pt-4">
          <Button variant="ghost" onClick={() => navigate('/problems')}>Cancel</Button>
          <Button variant="secondary" disabled={saving} onClick={() => handleSave(false)}>
            <Save className="h-3.5 w-3.5" />
            Save Problem
          </Button>
          <Button variant="primary" disabled={saving} onClick={() => handleSave(true)}>
            <RotateCw className="h-3.5 w-3.5" />
            Save & Schedule Revision
          </Button>
        </div>
      </div>
    </div>
  );
}
