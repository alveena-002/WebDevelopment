import { z } from "zod";

export const studentProfileSchema = z.object({
  father_name: z.string().min(2, "Father's name is required"),
  phone: z.string().min(7, "Enter a valid phone number"),
  address: z.string().min(3, "Address is required"),
  application_id: z.string().min(1, "Application ID is required"),
  course_id: z.string().uuid("Select a course"),
  batch_id: z.string().uuid("Select a batch"),
  enrollment_date: z.string().min(1, "Enrollment date is required"),
});

export type StudentProfileInput = z.infer<typeof studentProfileSchema>;
