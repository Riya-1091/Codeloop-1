import { supabase } from './supabase';

export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type ProblemPlatform = 'LeetCode' | 'GeeksforGeeks' | 'Codeforces' | 'HackerRank' | 'CodeChef' | 'Other';
export type ProblemStatus = 'Solved' | 'Revision Due' | 'Synced' | 'Overdue';

export interface DbProblem {
  id: string;
  user_id: string;
  title: string;
  url: string;
  platform: ProblemPlatform;
  topic: string;
  difficulty: Difficulty;
  language: string;
  status: ProblemStatus;
  notes: string;
  solution: string;
  revision_count: number;
  solved_at: string;
  last_reviewed_at: string | null;
  next_review_at: string | null;
  github_synced: boolean;
  github_commit: string | null;
  github_file: string | null;
  github_synced_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbNotification {
  id: string;
  user_id: string;
  type: 'revision' | 'github' | 'summary' | 'system';
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}

export interface UserStats {
  solved_easy: number;
  solved_medium: number;
  solved_hard: number;
  solved_total: number;
  current_streak: number;
  longest_streak: number;
  revision_total: number;
  revision_done: number;
  revision_success_rate: number;
  github_syncs: number;
}

export interface AdminOverview {
  totalUsers: number;
  activeUsers: number;
  problemsSolved: number;
  revisionsCompleted: number;
  newUsersThisWeek: number;
}

// ---------- Problems ----------
export async function listProblems(userId: string) {
  const { data, error } = await supabase
    .from('problems')
    .select('*')
    .eq('user_id', userId)
    .order('solved_at', { ascending: false });
  if (error) throw error;
  return data as DbProblem[];
}

export async function createProblem(userId: string, input: Partial<DbProblem>) {
  const { data, error } = await supabase
    .from('problems')
    .insert({ ...input, user_id: userId })
    .select('*')
    .single();
  if (error) throw error;
  return data as DbProblem;
}

export async function updateProblem(id: string, input: Partial<DbProblem>) {
  const { data, error } = await supabase.from('problems').update(input).eq('id', id).select('*').single();
  if (error) throw error;
  return data as DbProblem;
}

export async function deleteProblem(id: string) {
  const { error } = await supabase.from('problems').delete().eq('id', id);
  if (error) throw error;
}

export async function reviewProblem(id: string, recalled: boolean) {
  const { error } = await supabase.rpc('review_problem', { p_id: id, recalled });
  if (error) throw error;
}

// ---------- Stats ----------
export async function getUserStats(userId: string): Promise<UserStats> {
  const { data, error } = await supabase.rpc('get_user_stats', { target_id: userId });
  if (error) throw error;
  return data as UserStats;
}

export async function getAdminOverview(): Promise<AdminOverview> {
  const { data, error } = await supabase.rpc('get_admin_overview');
  if (error) throw error;
  return data as AdminOverview;
}

export async function logLogin() {
  await supabase.rpc('log_login');
}

// ---------- Notifications ----------
export async function listNotifications(userId: string) {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(30);
  if (error) throw error;
  return data as DbNotification[];
}

export async function markNotificationRead(id: string) {
  const { error } = await supabase.from('notifications').update({ read: true }).eq('id', id);
  if (error) throw error;
}

export async function createNotification(userId: string, input: Partial<DbNotification>) {
  const { error } = await supabase.from('notifications').insert({ ...input, user_id: userId });
  if (error) throw error;
}

// ---------- Admin: users ----------
export interface StaffProfile {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'instructor' | 'admin';
  status: 'active' | 'suspended';
  plan: 'free' | 'premium';
  plan_expires_at: string | null;
  created_at: string;
}

export async function listAllUsers() {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, name, email, role, status, plan, plan_expires_at, created_at')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as StaffProfile[];
}

export async function setUserStatus(id: string, status: 'active' | 'suspended') {
  const { error } = await supabase.rpc('admin_set_user_status', { target_id: id, new_status: status });
  if (error) throw error;
}

// ---------- Admin: audit logs ----------
export interface DbAuditLog {
  id: string;
  action: string;
  actor_email: string;
  target: string;
  severity: 'info' | 'warning' | 'critical';
  created_at: string;
}

export async function listAuditLogs() {
  const { data, error } = await supabase
    .from('audit_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);
  if (error) throw error;
  return data as DbAuditLog[];
}

// ---------- Instructor: classes ----------
export interface DbClass {
  id: string;
  instructor_id: string;
  name: string;
  join_code: string;
  created_at: string;
}

export async function getClass(classId: string) {
  const { data, error } = await supabase.from('classes').select('*').eq('id', classId).single();
  if (error) throw error;
  return data as DbClass;
}

export async function listMyClasses(instructorId: string) {
  const { data, error } = await supabase
    .from('classes')
    .select('*, class_members(count)')
    .eq('instructor_id', instructorId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data as unknown as (DbClass & { class_members: { count: number }[] })[]).map((c) => ({
    ...c,
    member_count: c.class_members?.[0]?.count ?? 0,
  }));
}

export async function createClass(instructorId: string, name: string) {
  const { data, error } = await supabase
    .from('classes')
    .insert({ instructor_id: instructorId, name })
    .select('*')
    .single();
  if (error) throw error;
  return data as DbClass;
}

export interface MyJoinedClass {
  id: string;
  name: string;
  instructor_name: string;
  added_at: string;
}

export async function listMyJoinedClasses(studentId: string) {
  const { data, error } = await supabase
    .from('my_classes_view')
    .select('id, name, instructor_name, added_at')
    .eq('student_id', studentId);
  if (error) throw error;
  return data as MyJoinedClass[];
}

export async function joinClassByCode(code: string) {
  const { data, error } = await supabase.rpc('join_class_by_code', { p_code: code });
  if (error) throw error;
  return data as string;
}

export async function listClassMembers(classId: string) {
  const { data, error } = await supabase
    .from('class_members')
    .select('student_id, added_at, profiles:student_id (id, name, email)')
    .eq('class_id', classId);
  if (error) throw error;
  return data as unknown as { student_id: string; added_at: string; profiles: { id: string; name: string; email: string } }[];
}

export async function addClassMember(classId: string, studentEmail: string) {
  const { error } = await supabase.rpc('add_student_to_class', { p_class: classId, p_email: studentEmail });
  if (error) throw new Error(error.message);
}

export async function removeClassMember(classId: string, studentId: string) {
  const { error } = await supabase.from('class_members').delete().eq('class_id', classId).eq('student_id', studentId);
  if (error) throw error;
}

export async function getClassLeaderboard(classId: string) {
  const members = await listClassMembers(classId);
  const withStats = await Promise.all(
    members.map(async (m) => {
      try {
        const stats = await getUserStats(m.student_id);
        return { ...m.profiles, stats };
      } catch {
        return { ...m.profiles, stats: null };
      }
    })
  );
  return withStats
    .filter((s) => s.stats)
    .sort((a, b) => {
      const scoreA = (a.stats!.solved_total || 0) + (a.stats!.current_streak || 0) * 2;
      const scoreB = (b.stats!.solved_total || 0) + (b.stats!.current_streak || 0) * 2;
      return scoreB - scoreA;
    });
}
export async function listAllStudents() {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, name, email, created_at')
    .eq('role', 'student')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as { id: string; name: string; email: string; created_at: string }[];
}

// Admin/instructor: browse problems across all students (moderation view)
export async function listAllProblemsForStaff(limit = 50) {
  const { data, error } = await supabase
    .from('problems')
    .select('*, profiles:user_id (name, email)')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data as unknown as (DbProblem & { profiles: { name: string; email: string } })[];
}

// ---------- Contact messages ----------
export interface DbContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  resolved: boolean;
  created_at: string;
}

export async function sendContactMessage(input: { name: string; email: string; subject: string; message: string }) {
  const { error } = await supabase.from('contact_messages').insert(input);
  if (error) throw error;
}

export async function listContactMessages() {
  const { data, error } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);
  if (error) throw error;
  return data as DbContactMessage[];
}

export async function setContactResolved(id: string, resolved: boolean) {
  const { error } = await supabase.from('contact_messages').update({ resolved }).eq('id', id);
  if (error) throw error;
}

// ---------- Class / instructor analytics data ----------
export interface StaffProblemRow extends DbProblem {
  student_name: string;
}

// Problems solved by every student in the given classes (instructor/admin only via RLS)
export async function getProblemsForClasses(classIds: string[]): Promise<{
  problems: StaffProblemRow[];
  students: { id: string; name: string; email: string; stats: UserStats | null }[];
}> {
  if (classIds.length === 0) return { problems: [], students: [] };
  const { data: members, error } = await supabase
    .from('class_members')
    .select('student_id, profiles:student_id (id, name, email)')
    .in('class_id', classIds);
  if (error) throw error;

  const uniq = new Map<string, { id: string; name: string; email: string }>();
  (members as unknown as { student_id: string; profiles: { id: string; name: string; email: string } }[]).forEach((m) => {
    if (m.profiles) uniq.set(m.profiles.id, m.profiles);
  });
  const ids = Array.from(uniq.keys());
  if (ids.length === 0) return { problems: [], students: [] };

  const { data: probs, error: pErr } = await supabase
    .from('problems')
    .select('*')
    .in('user_id', ids)
    .order('solved_at', { ascending: false })
    .limit(1000);
  if (pErr) throw pErr;

  const problems = (probs as DbProblem[]).map((p) => ({
    ...p,
    student_name: uniq.get(p.user_id)?.name || uniq.get(p.user_id)?.email || 'Student',
  }));
  const students = await Promise.all(
    ids.map(async (id) => ({ ...uniq.get(id)!, stats: await getUserStats(id).catch(() => null) }))
  );
  return { problems, students };
}

// ---------- GitHub integration ----------
export interface GithubConnection {
  github_username: string;
  github_avatar_url: string | null;
  repo_name: string;
  connected_at: string;
}

export async function getMyGithubConnection(): Promise<GithubConnection | null> {
  const { data, error } = await supabase.rpc('get_my_github_connection');
  if (error) throw error;
  return Array.isArray(data) && data.length > 0 ? (data[0] as GithubConnection) : null;
}

// supabase-js hides the real error of a non-2xx Edge Function behind a generic
// "Edge Function returned a non-2xx status code". The real message is in the
// response body (error.context), so read it from there.
async function functionErrorMessage(error: unknown, data: unknown, fallback: string): Promise<string> {
  const fromData = (data as { error?: unknown } | null)?.error;
  if (typeof fromData === 'string' && fromData) return fromData;
  const ctx = (error as { context?: unknown } | null)?.context;
  if (ctx && typeof (ctx as Response).clone === 'function') {
    const res = ctx as Response;
    try {
      const body = await res.clone().json();
      const msg = body?.error || body?.message || body?.msg;
      if (typeof msg === 'string' && msg) return `${msg} (HTTP ${res.status})`;
    } catch {
      try {
        const text = await res.clone().text();
        if (text) return `${text.slice(0, 200)} (HTTP ${res.status})`;
      } catch { /* ignore */ }
    }
    return `${fallback} (HTTP ${res.status})`;
  }
  return (error as { message?: string } | null)?.message || fallback;
}

// Call right after supabase.auth.linkIdentity('github') redirects back with a
// fresh session — verifies + stores the GitHub token server-side.
export async function connectGithub(providerToken: string) {
  const { data, error } = await supabase.functions.invoke('github-connect', {
    body: { provider_token: providerToken },
  });
  if (error || data?.error) throw new Error(await functionErrorMessage(error, data, 'Could not connect GitHub.'));
  return data as { github_username: string; github_avatar_url: string };
}

export async function disconnectGithub(userId: string) {
  const { error } = await supabase.from('github_connections').delete().eq('user_id', userId);
  if (error) throw error;
  // RLS can block a delete without an error — make sure the row is really gone.
  const { data: still } = await supabase.rpc('get_my_github_connection');
  if (Array.isArray(still) ? still.length > 0 : !!still) {
    throw new Error('Could not remove the stored GitHub connection (database permissions). Use Reconnect instead — it replaces the token.');
  }
}

export async function syncProblemToGithub(problemId: string) {
  const { data, error } = await supabase.functions.invoke('github-sync', {
    body: { problem_id: problemId },
  });
  if (error || data?.error) throw new Error(await functionErrorMessage(error, data, 'GitHub sync failed.'));
  return data as { commit: string; file: string; repo: string };
}

// ---------- Preferences & account ----------
export async function savePreferences(userId: string, prefs: Record<string, unknown>) {
  const { error } = await supabase.from('profiles').update({ preferences: prefs }).eq('id', userId);
  if (error) throw error;
}

export async function deleteMyAccount(confirmEmail: string) {
  const { data, error } = await supabase.functions.invoke('delete-account', { body: { confirm_email: confirmEmail } });
  if (error || data?.error) throw new Error(data?.error || error?.message || 'Could not delete account.');
}

// ---------- Plans ----------
export async function countMyProblems(userId: string) {
  const { count, error } = await supabase.from('problems').select('id', { count: 'exact', head: true }).eq('user_id', userId);
  if (error) throw error;
  return count ?? 0;
}

export async function adminSetUserPlan(targetId: string, plan: 'free' | 'premium', days = 30) {
  const { error } = await supabase.rpc('admin_set_user_plan', { target_id: targetId, new_plan: plan, days });
  if (error) throw new Error(error.message);
}
