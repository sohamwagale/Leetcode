import { z } from "zod";

//TBD
export const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be atleast 3 characters")
      .max(20,"username cannot exceed 20 charchters")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Only letters, numbers and underscores are allowed"
      ),

    email: z
      .email("Enter a valid email"),

    password: z
      .string()
      .min(8,"Password must be atleast 8 charachters"),

    confirmPassword: z.string(),
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      path:["confirmPassword"],
      message: "Passwords do not match",
    }
  );

export type RegisterFormData = z.infer<typeof registerSchema>;