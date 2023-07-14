import { z } from 'zod';
import { userRole } from '../user/user.constent';

const createUserZodSchema = z.object({
  body: z.object({
    password: z.string({
      required_error: 'Password is Required',
    }),
    role: z.enum([...userRole] as [string, ...string[]], {
      required_error: 'Role is Required',
    }),
    name: z.object({
      firstName: z.string({
        required_error: 'First Name is Required',
      }),
      lastName: z.string({
        required_error: 'Last Name is Required',
      }),
    }),
    phoneNumber: z.string({
      required_error: 'Phone Number is Required',
    }),
    address: z.string({
      required_error: 'Address is Required',
    }),
    budget: z.number({
      required_error: 'Budget is Required',
    }),
    income: z.number({
      required_error: 'Income is Required',
    }),
  }),
});

const loginUserZodSchema = z.object({
  body: z.object({
    phoneNumber: z.string({
      required_error: 'Phone Number is Required',
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
