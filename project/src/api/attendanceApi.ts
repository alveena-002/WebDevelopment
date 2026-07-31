import { supabase } from "@/lib/supabase";
import type { AttendanceRecord, AttendanceStatus } from "@/types";

export const attendanceApi = {
  markBulk: async (records: Omit<AttendanceRecord, "id">[]) => {
    const { data, error } = await supabase
      .from("attendance")
      .upsert(records, { onConflict: "student_id,date" })
      .select();
    if (error) throw error;
    return data as unknown as AttendanceRecord[];
  },

  listByBatchAndDate: async (batchId: string, date: string) => {
    const { data, error } = await supabase
      .from("attendance")
      .select("*")
      .eq("batch_id", batchId)
      .eq("date", date);
    if (error) throw error;
    return data as unknown as AttendanceRecord[];
  },

  studentReport: async (studentId: string, from: string, to: string) => {
    const { data, error } = await supabase
      .from("attendance")
      .select("*")
      .eq("student_id", studentId)
      .gte("date", from)
      .lte("date", to);
    if (error) throw error;
    return data as unknown as AttendanceRecord[];
  },

  batchReport: async (batchId: string, from: string, to: string) => {
    const { data, error } = await supabase
      .from("attendance")
      .select("*")
      .eq("batch_id", batchId)
      .gte("date", from)
      .lte("date", to);
    if (error) throw error;
    return data as unknown as AttendanceRecord[];
  },
};

export const attendanceStatusLabel: Record<AttendanceStatus, string> = {
  present: "Present",
  absent: "Absent",
  late: "Late",
  leave: "Leave",
};
