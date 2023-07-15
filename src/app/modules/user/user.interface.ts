/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';

export type UserName = {
  firstName: string;
  lastName: string;
};

export type IUser = {
  _id?: string;
  name: UserName;
  email: string;
  password: string;
};

export type UserModel = {
  isUserExsist(
    phoneNumber: string,
  ): Promise<Pick<IUser, '_id' | 'email' | 'password'>>;
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string,
  ): Promise<boolean>;
} & Model<IUser, Record<string, unknown>>;
export type IUserFilters = { searchTerm?: string };
