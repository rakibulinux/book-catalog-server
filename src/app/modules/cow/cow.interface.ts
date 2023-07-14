import mongoose, { Model } from 'mongoose';

export type location =
  | 'Dhaka'
  | 'Chattogram'
  | 'Barishal'
  | 'Rajshahi'
  | 'Sylhet'
  | 'Comilla'
  | 'Rangpur'
  | 'Mymensingh';

export type breed =
  | 'Brahman'
  | 'Nellore'
  | 'Sahiwal'
  | 'Gir'
  | 'Indigenous'
  | 'Tharparkar'
  | 'Kankrej';

export type label = 'for sale' | 'sold out';

export type category = 'Dairy' | 'Beef' | 'Dual Purpose';

export type ICow = {
  name: string;
  age: number;
  price: number;
  location: location;
  breed: breed;
  weight: number;
  label: label;
  category: category;
  seller: mongoose.Types.ObjectId;
};

export type CowModel = Model<ICow, Record<string, unknown>>;
export type ICowFilters = { searchTerm?: string };
