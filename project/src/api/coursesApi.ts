import { supabase } from "@/lib/supabase";
import type { Course, Batch } from "@/types";

export const coursesApi = {
  list: async () => {
    const { data, error } = await supabase.from("courses").select("*").order("name");
    if (error) throw error;
    return data as unknown as Course[];
  },
  create: async (payload: Omit<Course, "id" | "created_at">) => {
    const { data, error } = await supabase.from("courses").insert(payload).select().single();
    if (error) throw error;
    return data as unknown as Course;
  },
};

export const batchesApi = {
  list: async (courseId?: string) => {
    let query = supabase.from("batches").select("*").order("name");
    if (courseId) query = query.eq("course_id", courseId);
    const { data, error } = await query;
    if (error) throw error;
    return data as unknown as Batch[];
  },
  create: async (payload: Omit<Batch, "id">) => {
    const { data, error } = await supabase.from("batches").insert(payload).select().single();
    if (error) throw error;
    return data as unknown as Batch;
  },
};
