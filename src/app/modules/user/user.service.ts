/* eslint-disable @typescript-eslint/no-explicit-any */
import { SortOrder } from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import calculatePagination from '../../helpers/paginationHelpers';
import { userSearchableFields } from './user.constent';
import { IUser, IUserFilters } from './user.interface';
import { User } from './user.model';
import httpStatus from 'http-status';

const getAllUsers = async (
  filters: IUserFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IUser[]>> => {
  const { searchTerm, ...filtersData } = filters;

  const andCondition = [];

  if (searchTerm) {
    andCondition.push({
      $or: userSearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    andCondition.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const { page, limit, skip, soryBy, sortOrder } =
    calculatePagination(paginationOptions);

  const sortCondition: { [key: string]: SortOrder } = {};
  if (soryBy && sortOrder) {
    sortCondition[soryBy] = sortOrder;
  }

  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};

  const result = await User.find(whereCondition)
    .sort(sortCondition)
    .skip(skip)
    .limit(limit);
  const count = await User.countDocuments(whereCondition);

  return {
    meta: {
      page,
      limit,
      count,
    },
    data: result,
  };
};

const getSingleUser = async (id: string): Promise<IUser | null> => {
  const result = await User.findById(id);
  return result;
};
const deleteSingleUser = async (id: string): Promise<IUser | null> => {
  const result = await User.findByIdAndDelete(id);
  return result;
};
const updateSingleUser = async (
  id: string,
  payload: Partial<IUser>
): Promise<IUser | null> => {
  const isExsist = await User.findOne({ _id: id });

  if (!isExsist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User Not found');
  }
  const { name, ...UserData } = payload;
  const updateUserData: Partial<IUser> = { ...UserData };
  if (name && Object.keys(name).length > 0) {
    Object.keys(name).forEach(key => {
      const nameKey = `name.${key}`;
      (updateUserData as any)[nameKey] = name[key as keyof typeof name];
    });
  }
  const result = await User.findOneAndUpdate({ _id: id }, updateUserData, {
    new: true,
  });
  return result;
};

export const UserService = {
  getAllUsers,
  getSingleUser,
  updateSingleUser,
  deleteSingleUser,
};
