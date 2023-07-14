/* eslint-disable @typescript-eslint/no-explicit-any */
import { SortOrder } from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import calculatePagination from '../../helpers/paginationHelpers';
import { adminSearchableFields } from './admin.constent';
import { IAdmin, IAdminFilters, ILoginAdmin } from './admin.interface';
import httpStatus from 'http-status';
import { Admin } from './admin.model';
import config from '../../../config';
import { Secret } from 'jsonwebtoken';
import { jwtHelpers } from '../../helpers/jwtHelpers';
import {
  ILoginUserResponse,
  IRefreshTokenResponse,
} from '../auth/auth.interface';

const createAdmin = async (admin: IAdmin): Promise<IAdmin> => {
  const createdAdmin = await Admin.create(admin);
  if (!createdAdmin) {
    throw new ApiError(400, `Failed to create Admin`);
  }
  return createdAdmin;
};

const getAllAdmins = async (
  filters: IAdminFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IAdmin[]>> => {
  const { searchTerm, ...filtersData } = filters;

  const andCondition = [];

  if (searchTerm) {
    andCondition.push({
      $or: adminSearchableFields.map(field => ({
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

  const result = await Admin.find(whereCondition)
    .sort(sortCondition)
    .skip(skip)
    .limit(limit);
  const count = await Admin.countDocuments(whereCondition);

  return {
    meta: {
      page,
      limit,
      count,
    },
    data: result,
  };
};

const getSingleAdmin = async (id: string): Promise<IAdmin | null> => {
  const result = await Admin.findById(id);
  return result;
};
const deleteSingleAdmin = async (id: string): Promise<IAdmin | null> => {
  const result = await Admin.findByIdAndDelete(id);
  return result;
};
const updateSingleAdmin = async (
  id: string,
  payload: Partial<IAdmin>
): Promise<IAdmin | null> => {
  const isExsist = await Admin.findOne({ _id: id });

  if (!isExsist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Admin Not found');
  }
  const { name, ...AdminData } = payload;
  const updateAdminData: Partial<IAdmin> = { ...AdminData };
  if (name && Object.keys(name).length > 0) {
    Object.keys(name).forEach(key => {
      const nameKey = `name.${key}`;
      (updateAdminData as any)[nameKey] = name[key as keyof typeof name];
    });
  }
  const result = await Admin.findOneAndUpdate({ _id: id }, updateAdminData, {
    new: true,
  });
  return result;
};

const loginAdmin = async (
  payload: ILoginAdmin
): Promise<ILoginUserResponse> => {
  const { phoneNumber: userId, password } = payload;

  const isUserExsist = await Admin.isUserExsist(userId);
  if (isUserExsist.role !== 'admin') {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      'This is a admin user you are not allowed to login'
    );
  }
  if (!isUserExsist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exsist');
  }

  if (
    isUserExsist.password &&
    !(await Admin.isPasswordMatched(password, isUserExsist?.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect');
  }

  const { phoneNumber, role } = isUserExsist;

  //Token
  const accessToken = jwtHelpers.createToken(
    { phoneNumber, role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  const refreshToken = jwtHelpers.createToken(
    { phoneNumber, role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );

  return { accessToken, refreshToken };
};

const refreshToken = async (token: string): Promise<IRefreshTokenResponse> => {
  let verifiedToken = null;

  // invalid token
  try {
    verifiedToken = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_secret as Secret
    );
    // verifiedToken = jwt.verify(token, config.jwt.refresh_secret as Secret);
  } catch (err) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid Refresh Token');
  }
  const { userId } = verifiedToken;
  const isUserExsist = await Admin.isUserExsist(userId);

  //Generate new token
  if (!isUserExsist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exsist');
  }

  const newAccessToken = jwtHelpers.createToken(
    {
      phoneNumber: isUserExsist.phoneNumber,
      role: isUserExsist.role,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );
  return {
    accessToken: newAccessToken,
  };
};

export const AdminService = {
  createAdmin,
  getAllAdmins,
  getSingleAdmin,
  updateSingleAdmin,
  deleteSingleAdmin,
  loginAdmin,
  refreshToken,
};
