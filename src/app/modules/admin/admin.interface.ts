/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';

export type AdminName = {
  firstName: string;
  lastName: string;
};

export type IAdmin = {
  password: string;
  role: 'admin';
  name: AdminName;
  phoneNumber: string;
  address: string;
};
export type AdminModel = {
  isUserExsist(
    phoneNumber: string
  ): Promise<Pick<IAdmin, 'role' | 'password' | 'phoneNumber'>>;
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string
  ): Promise<boolean>;
} & Model<IAdmin, Record<string, unknown>>;
export type ILoginAdmin = {
  phoneNumber: string;
  password: string;
};
export type IAdminFilters = { searchTerm?: string };
