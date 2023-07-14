import { z } from 'zod';
import { adminRole } from './admin.constent';

const createAdminZodSchema = z.object({
  body: z.object({
    password: z.string({
      required_error: 'Password is Required',
    }),
    role: z.enum([...adminRole] as [string, ...string[]], {
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
  }),
});

const loginAdminZodSchema = z.object({
  body: z.object({
    phoneNumber: z.string({
      required_error: 'Phone Number is Required',
    }),
    password: z.string({
      required_error: 'Password is Required',
    }),
  }),
});

export const AdminValidation = { createAdminZodSchema, loginAdminZodSchema };
