import { z } from 'zod';
import { userRole } from './user.constent';

const updateUserZodSchema = z.object({
  body: z.object({
    role: z.enum([...userRole] as [string, ...string[]]).optional(),
    name: z
      .object({
        firstName: z.string().optional(),
        lastName: z.string().optional(),
      })
      .optional(),
    email: z.string().optional(),
    password: z.string().optional(),
  }),
});

export const UserValidation = { updateUserZodSchema };
