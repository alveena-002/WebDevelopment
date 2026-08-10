import { supabase } from "@/lib/supabase";
import type { TeacherProfile, Profile } from "@/types";

export const teachersApi = {
  getByProfileId: async (profileId: string) => {
    const { data, error } = await supabase
      .from("teachers")
      .select("*, profiles(*)")
      .eq("profile_id", profileId)
      .maybeSingle();
    if (error) throw error;
    return data as unknown as (TeacherProfile & { profiles: Profile }) | null;
  },

  list: async () => {
    const { data, error } = await supabase.from("teachers").select("*, profiles(*)");
    if (error) throw error;
    return data as unknown as (TeacherProfile & { profiles: Profile })[];
  },
};
