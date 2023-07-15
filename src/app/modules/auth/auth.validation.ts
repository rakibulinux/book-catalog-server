import { z } from 'zod';

const createUserZodSchema = z.object({
  body: z.object({
    name: z.object({
      firstName: z.string({
        required_error: 'First Name is Required',
      }),
      lastName: z.string({
        required_error: 'Last Name is Required',
      }),
    }),
    email: z.string({
      required_error: 'Email is Required',
    }),
    password: z.string({
      required_error: 'Password is Required',
    }),
  }),
});

const loginUserZodSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: 'Email is Required',
    }),
    password: z.string({
      required_error: 'Password is Required',
    }),
  }),
});

const refreshTokenZodSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: 'ID Is Required',
    }),
  }),
});

export const AuthValidation = {
  createUserZodSchema,
  loginUserZodSchema,
  refreshTokenZodSchema,
};
