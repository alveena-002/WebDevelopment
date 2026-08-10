import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import type { Profile } from "@/types";

interface AuthState {
  profile: Profile | null;
  loading: boolean;
  initialized: boolean;
  initialize: () => Promise<void>;
  signOut: () => Promise<void>;
  setProfile: (p: Profile | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  profile: null,
  loading: true,
  initialized: false,

  initialize: async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;

    if (userId) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      set({ profile: profile as unknown as Profile, loading: false, initialized: true });
    } else {
      set({ profile: null, loading: false, initialized: true });
    }

    supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
        set({ profile: profile as unknown as Profile });
      } else {
        set({ profile: null });
      }
    });
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ profile: null });
  },

  setProfile: (p) => set({ profile: p }),
}));
