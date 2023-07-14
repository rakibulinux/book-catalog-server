/* eslint-disable @typescript-eslint/no-explicit-any */
import Cow from './cow.model';
import { ICow, ICowFilters } from './cow.interface';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { SortOrder } from 'mongoose';
import calculatePagination from '../../helpers/paginationHelpers';
import { cowSearchableFields } from './cow.constent';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';

const createCow = async (cow: ICow): Promise<ICow | null> => {
  const createdCow = await Cow.create(cow);
  if (!createdCow) {
    throw new ApiError(400, `Failed to create Cow`);
  }
  return createdCow;
};

const getAllCows = async (
  filters: ICowFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<ICow[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const andCondition = [];

  if (searchTerm) {
    andCondition.push({
      $or: cowSearchableFields.map(field => ({
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

  const result = await Cow.find(whereCondition)
    .populate('seller')
    .sort(sortCondition)
    .skip(skip)
    .limit(limit);
  const count = await Cow.countDocuments(whereCondition);

  return {
    meta: {
      page,
      limit,
      count,
    },
    data: result,
  };
};

const getSingleCow = async (id: string): Promise<ICow | null> => {
  const result = await Cow.findById(id).populate('seller');
  return result;
};
const deleteSingleCow = async (id: string): Promise<ICow | null> => {
  const result = await Cow.findByIdAndDelete(id);
  return result;
};
const updateSingleCow = async (
  id: string,
  payload: Partial<ICow>
): Promise<ICow | null> => {
  const isExsist = await Cow.findOne({ _id: id });

  if (!isExsist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cow Not found');
  }
  const { ...CowData } = payload;
  const updateCowData: Partial<ICow> = { ...CowData };
  const result = await Cow.findOneAndUpdate({ _id: id }, updateCowData, {
    new: true,
  });
  return result;
};

export const CowService = {
  createCow,
  getAllCows,
  getSingleCow,
  deleteSingleCow,
  updateSingleCow,
};
