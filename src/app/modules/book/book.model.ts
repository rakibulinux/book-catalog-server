import { Schema, model } from 'mongoose';
import { BookModel, IBook } from './book.interface';
import { BookGenre } from '../../../enums/book';

const bookSchema = new Schema<IBook>(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    genre: {
      type: String,
      enum: BookGenre,
      required: true,
    },
    publicationDate: {
      type: String,
      required: true,
    },
    reviews: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

const Book = model<IBook, BookModel>('Book', bookSchema);
export default Book;
