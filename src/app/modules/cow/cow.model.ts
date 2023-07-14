import { Schema, model } from 'mongoose';
import { CowModel, ICow } from './cow.interface';
import { Breed, Category, Label, Location } from '../../../enums/cow';

const cowSchema = new Schema<ICow>(
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
  }
);

const Cow = model<ICow, CowModel>('Cow', cowSchema);
export default Cow;
