import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase env vars. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export type ProfileRole = 'student' | 'instructor' | 'admin';

export interface Profile {
  id: string;
  name: string;
  username: string;
  email: string;
  role: ProfileRole;
  avatar_url: string | null;
  bio: string | null;
  status: 'active' | 'suspended';
  plan: 'free' | 'premium';
  plan_expires_at: string | null;
  preferences: Record<string, unknown>;
  created_at: string;
}
