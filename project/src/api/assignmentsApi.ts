import { supabase } from "@/lib/supabase";
import type { Assignment, AssignmentSubmission } from "@/types";

export const assignmentsApi = {
  list: async (batchId?: string) => {
    let query = supabase.from("assignments").select("*").order("due_date", { ascending: true });
    if (batchId) query = query.eq("batch_id", batchId);
    const { data, error } = await query;
    if (error) throw error;
    return data as unknown as Assignment[];
  },

  create: async (payload: Omit<Assignment, "id" | "created_at">) => {
    const { data, error } = await supabase.from("assignments").insert(payload).select().single();
    if (error) throw error;
    return data as unknown as Assignment;
  },

  update: async (id: string, payload: Partial<Assignment>) => {
    const { data, error } = await supabase.from("assignments").update(payload).eq("id", id).select().single();
    if (error) throw error;
    return data as unknown as Assignment;
  },

  remove: async (id: string) => {
    const { error } = await supabase.from("assignments").delete().eq("id", id);
    if (error) throw error;
  },

  uploadAttachment: async (file: File, assignmentId: string) => {
    const path = `assignments/${assignmentId}/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("assignment-files").upload(path, file);
    if (error) throw error;
    const { data } = supabase.storage.from("assignment-files").getPublicUrl(path);
    return data.publicUrl;
  },

  submit: async (payload: Omit<AssignmentSubmission, "id">) => {
    const { data, error } = await supabase
      .from("assignment_submissions")
      .upsert(payload, { onConflict: "assignment_id,student_id" })
      .select()
      .single();
    if (error) throw error;
    return data as unknown as AssignmentSubmission;
  },

  listSubmissions: async (assignmentId: string) => {
    const { data, error } = await supabase
      .from("assignment_submissions")
      .select("*")
      .eq("assignment_id", assignmentId);
    if (error) throw error;
    return data as unknown as AssignmentSubmission[];
  },
};
