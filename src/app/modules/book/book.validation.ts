import { z } from 'zod';
import { BookGenres } from './book.constent';

const createBookZodSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'Title is required' }),
    author: z.string({ required_error: 'Author is required' }),
    genre: z.enum([...BookGenres] as [string, ...string[]], {
      required_error: 'Location is required',
    }),
    publicationDate: z.string({ required_error: 'Date is required' }),
  }),
});
const updateBookZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    author: z.string().optional(),
    genre: z.enum([...BookGenres] as [string, ...string[]]).optional(),
    publicationDate: z.string().optional(),
  }),
});

export const BookValidation = {
  createBookZodSchema,
  updateBookZodSchema,
};
