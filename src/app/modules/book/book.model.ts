import { Schema, model } from 'mongoose';
import { BookModel, IBook } from './book.interface';
import { Breed, Category, Label, Location } from '../../../enums/book';

const bookSchema = new Schema<IBook>(
  {
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      enum: Location,
      required: true,
    },
    breed: {
      type: String,
      enum: Breed,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    label: {
      type: String,
      enum: Label,
      default: 'for sale',
    },
    category: {
      type: String,
      enum: Category,
      required: true,
    },
    seller: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
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
