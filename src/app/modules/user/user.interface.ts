/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';

export type UserName = {
  firstName: string;
  middleName: string;
  lastName: string;
};

export type IUser = {
  _id?: string;
  password: string;
  role: 'buyer' | 'seller';
  name: UserName;
  phoneNumber: string;
  address: string;
  budget: number;
  income: number;
};

export type UserModel = {
  isUserExsist(
    phoneNumber: string
  ): Promise<Pick<IUser, '_id' | 'role' | 'password' | 'phoneNumber'>>;
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string
  ): Promise<boolean>;
} & Model<IUser, Record<string, unknown>>;
export type IUserFilters = { searchTerm?: string };
