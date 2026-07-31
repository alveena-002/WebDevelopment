import { supabase } from "@/lib/supabase";
import type { Profile, UserRole } from "@/types";

export const usersApi = {
  list: async () => {
    const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return data as unknown as Profile[];
  },

  updateRole: async (id: string, role: UserRole) => {
    const { error } = await supabase.from("profiles").update({ role }).eq("id", id);
    if (error) throw error;
  },
};
