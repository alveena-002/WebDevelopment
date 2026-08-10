import { supabase } from "@/lib/supabase";
import type { StudentProfile, Profile } from "@/types";

export const studentsApi = {
  list: async (batchId?: string) => {
    let query = supabase.from("students").select("*, profiles(*)");
    if (batchId) query = query.eq("batch_id", batchId);
    const { data, error } = await query;
    if (error) throw error;
    return data as unknown as (StudentProfile & { profiles: Profile })[];
  },

  getByProfileId: async (profileId: string) => {
    const { data, error } = await supabase
      .from("students")
      .select("*, profiles(*)")
      .eq("profile_id", profileId)
      .maybeSingle();
    if (error) throw error;
    return data as unknown as (StudentProfile & { profiles: Profile }) | null;
  },

  getById: async (id: string) => {
    const { data, error } = await supabase.from("students").select("*, profiles(*)").eq("id", id).single();
    if (error) throw error;
    return data as unknown as StudentProfile & { profiles: Profile };
  },

  create: async (payload: Omit<StudentProfile, "id">) => {
    const { data, error } = await supabase.from("students").insert(payload).select().single();
    if (error) throw error;
    return data as unknown as StudentProfile;
  },

  update: async (id: string, payload: Partial<StudentProfile>) => {
    const { data, error } = await supabase.from("students").update(payload).eq("id", id).select().single();
    if (error) throw error;
    return data as unknown as StudentProfile;
  },

  uploadAvatar: async (file: File, profileId: string) => {
    const path = `avatars/${profileId}-${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (error) throw error;
    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    await supabase.from("profiles").update({ avatar_url: data.publicUrl }).eq("id", profileId);
    return data.publicUrl;
  },
};
