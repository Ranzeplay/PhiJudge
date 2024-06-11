import { z } from "zod";

export const RegisterFormSchema = z.object({
  email: z
    .string({
      required_error: "Require email address",
    })
    .email({
      message: "Require a valid email address",
    }),
  userName: z.string({ required_error: "Require username" }),
  passwordScope: z
    .object({
      password: z.string({ required_error: "Require password" }),
      confirmPassword: z.string({
        required_error: "Require password double check",
      }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Password mismatch",
      path: ["confirmPassword"],
    }),
});

export type RegisterForm = z.infer<typeof RegisterFormSchema>;
