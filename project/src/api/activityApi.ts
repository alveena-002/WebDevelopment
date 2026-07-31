import { supabase } from "@/lib/supabase";

export const activityApi = {
  log: async (actorId: string, action: string, metadata: Record<string, unknown> = {}) => {
    // Best-effort — a failed activity log should never block the user's actual action.
    try {
      await supabase.from("activity_logs").insert({ actor_id: actorId, action, metadata });
    } catch {
      // ignore
    }
  },
};
