import { z } from "zod"

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(3, "Name must be at least 3 characters"),

    email: z
      .string()
      .email("Invalid email address"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters"),

    rePassword: z.string(),

    phone: z
      .string()
      .min(10, "Phone number is too short"),
  })
  .refine((data) => data.password === data.rePassword, {
    message: "Passwords do not match",
    path: ["rePassword"],
  })

export type RegisterFormData = z.infer<typeof registerSchema>
