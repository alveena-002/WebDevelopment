import { supabase } from "@/lib/supabase";
import type { Notification } from "@/types";

export const notificationsApi = {
  listForUser: async (userId: string) => {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data as unknown as Notification[];
  },

  markRead: async (id: string) => {
    const { error } = await supabase.from("notifications").update({ is_read: true }).eq("id", id);
    if (error) throw error;
  },

  markAllRead: async (userId: string) => {
    const { error } = await supabase.from("notifications").update({ is_read: true }).eq("user_id", userId).eq("is_read", false);
    if (error) throw error;
  },

  create: async (payload: Omit<Notification, "id" | "created_at" | "is_read">) => {
    const { error } = await supabase.from("notifications").insert({ ...payload, is_read: false });
    if (error) throw error;
  },
};
