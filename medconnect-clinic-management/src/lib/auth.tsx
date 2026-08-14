import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import type { Clinic, StaffMember } from '@/lib/types';

interface AuthState {
  session: Session | null;
  user: User | null;
  staff: StaffMember | null;
  clinic: Clinic | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [staff, setStaff] = useState<StaffMember | null>(null);
  const [clinic, setClinic] = useState<Clinic | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadProfile(uid: string) {
    const { data: staffRow } = await supabase
      .from('clinic_staff')
      .select('*')
      .eq('user_id', uid)
      .maybeSingle();
    setStaff(staffRow as StaffMember | null);
    if (staffRow) {
      const { data: clinicRow } = await supabase
        .from('clinics')
        .select('*')
        .eq('id', staffRow.clinic_id)
        .maybeSingle();
      setClinic(clinicRow as Clinic | null);
    } else {
      setClinic(null);
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      if (data.session?.user) {
        loadProfile(data.session.user.id).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
      setUser(sess?.user ?? null);
      if (sess?.user) {
        (async () => {
          await loadProfile(sess.user.id);
          setLoading(false);
        })();
      } else {
        setStaff(null);
        setClinic(null);
        setLoading(false);
      }
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  async function signUp(email: string, password: string, fullName: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    if (error) return { error: error.message };
    const uid = data.user?.id;
    if (uid) {
      const { error: rpcError } = await supabase.rpc('seed_demo_clinic', {
        p_user_id: uid,
        p_full_name: fullName,
        p_email: email,
      });
      if (rpcError) return { error: rpcError.message };
      await loadProfile(uid);
    }
    return { error: null };
  }

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return { error: null };
  }

  async function signOut() {
    await supabase.auth.signOut();
    setStaff(null);
    setClinic(null);
  }

  async function refresh() {
    if (user) await loadProfile(user.id);
  }

  return (
    <AuthContext.Provider
      value={{ session, user, staff, clinic, loading, signUp, signIn, signOut, refresh }}
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
