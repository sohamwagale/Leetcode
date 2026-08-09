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
  .refine( //Thte whole object is passed into data
    (data) => data.password === data.confirmPassword,
    { //Error path
      path:["confirmPassword"],
      message: "Passwords do not match",
    }
  );
 
// z.infer extracts the TypeScript type from the schema.
export type RegisterFormData = z.infer<typeof registerSchema>;