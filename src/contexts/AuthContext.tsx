import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase, type Profile, type ProfileRole } from '@/lib/supabase';
import { logLogin } from '@/lib/api';
import { ALL_FEATURES_FREE } from '@/lib/site';

export type UserRole = ProfileRole;

export interface AuthUser {
  id: string;
  name: string;
  username: string;
  email: string;
  role: UserRole;
  avatar?: string;
  bio?: string;
  plan: 'free' | 'premium';
  planExpiresAt: string | null;
  preferences: Record<string, unknown>;
}

interface AuthResult {
  success: boolean;
  error?: string;
  role?: UserRole;
  needsConfirmation?: boolean;
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isInstructor: boolean;
  isPremium: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  signup: (name: string, email: string, password: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const SUSPENDED_MESSAGE = 'Your account has been suspended. Please contact support.';

function toAuthUser(profile: Profile): AuthUser {
  return {
    id: profile.id,
    name: profile.name,
    username: profile.username,
    email: profile.email,
    role: profile.role,
    avatar: profile.avatar_url ?? undefined,
    bio: profile.bio ?? undefined,
    plan: profile.plan ?? 'free',
    planExpiresAt: profile.plan_expires_at ?? null,
    preferences: profile.preferences ?? {},
  };
}

// Mirrors the database rule: staff are always premium; students need an active premium plan.
function computeIsPremium(u: AuthUser | null) {
  if (!u) return false;
  if (u.role !== 'student') return true;
  return u.plan === 'premium' && (!u.planExpiresAt || new Date(u.planExpiresAt) > new Date());
}

async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
  if (error || !data) return null;
  return data as Profile;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const loadFromSession = async (session: Session | null) => {
    if (!session?.user) {
      setUser(null);
      return;
    }
    const profile = await fetchProfile(session.user.id);
    if (profile && profile.status === 'suspended') {
      await supabase.auth.signOut();
      setUser(null);
      return;
    }
    setUser(profile ? toAuthUser(profile) : null);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      loadFromSession(data.session).finally(() => setLoading(false));
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      // Defer to avoid deadlocks inside the auth callback.
      setTimeout(() => loadFromSession(session), 0);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const refreshProfile = async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session?.user) {
      const profile = await fetchProfile(data.session.user.id);
      if (profile) setUser(toAuthUser(profile));
    }
  };

  const login = async (email: string, password: string): Promise<AuthResult> => {
    if (!email || !password) {
      return { success: false, error: 'Please enter your email and password.' };
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error || !data.user) {
      const message = error?.message?.toLowerCase().includes('email not confirmed')
        ? 'Please confirm your email first — check your inbox for the confirmation link.'
        : error?.message || 'Invalid email or password.';
      return { success: false, error: message };
    }
    const profile = await fetchProfile(data.user.id);
    if (!profile) {
      await supabase.auth.signOut();
      return { success: false, error: 'Account found but profile is missing. Contact support.' };
    }
    if (profile.status === 'suspended') {
      await supabase.auth.signOut();
      return { success: false, error: SUSPENDED_MESSAGE };
    }
    setUser(toAuthUser(profile));
    if (profile.role === 'admin' || profile.role === 'instructor') {
      logLogin().catch(() => {});
    }
    return { success: true, role: profile.role };
  };

  const signup = async (name: string, email: string, password: string): Promise<AuthResult> => {
    if (!name.trim() || !email.trim() || !password) {
      return { success: false, error: 'Please fill in all fields.' };
    }
    if (password.length < 8) {
      return { success: false, error: 'Password must be at least 8 characters.' };
    }
    // Public signup never carries a role in metadata, so the DB trigger
    // always creates a 'student' profile — instructor/admin accounts can
    // only be created by an admin via the Supabase edge function.
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { name: name.trim(), username: email.trim().split('@')[0] },
        emailRedirectTo: `${window.location.origin}/login`,
      },
    });
    if (error || !data.user) {
      return { success: false, error: error?.message || 'Signup failed.' };
    }
    // Email confirmation is required — no session until the user clicks the link.
    if (!data.session) {
      return { success: true, needsConfirmation: true, role: 'student' };
    }
    const profile = await fetchProfile(data.user.id);
    if (profile) setUser(toAuthUser(profile));
    return { success: true, role: 'student' };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isInstructor: user?.role === 'instructor',
        isPremium: ALL_FEATURES_FREE || computeIsPremium(user),
        loading,
        login,
        signup,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
