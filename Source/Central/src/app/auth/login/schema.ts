import z from 'zod';

export const LoginFormSchema = z.object({
  email: z
    .string({ required_error: 'Email required' })
    .email({ message: 'Invalid email address' }),
  password: z
    .string({ required_error: 'Password required' })
    .min(8, { message: 'Password must be at least 8 characters' }),
});

export type LoginForm = z.infer<typeof LoginFormSchema>;
