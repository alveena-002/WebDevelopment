import { z } from "zod";

export const assignmentSchema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().min(1, "Description is required"),
  course_id: z.string().uuid("Select a course"),
  batch_id: z.string().uuid("Select a batch"),
  due_date: z.string().min(1, "Due date is required"),
});

export type AssignmentInput = z.infer<typeof assignmentSchema>;
