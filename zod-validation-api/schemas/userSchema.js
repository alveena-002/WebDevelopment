import { z } from "zod";

export const userSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),

  email: z.email("Invalid email"),

  age: z.number().min(18, "Age must be at least 18"),

  password: z.string().min(6, "Password must be at least 6 characters"),
});