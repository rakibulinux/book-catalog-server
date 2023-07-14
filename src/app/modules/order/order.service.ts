/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { SortOrder } from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import calculatePagination from '../../helpers/paginationHelpers';
import { orderSearchableFields } from './order.constent';
import { IOrder, IOrderFilters } from './order.interface';
import Order from './order.model';
import Cow from '../cow/cow.model';
import { User } from '../user/user.model';
import httpStatus from 'http-status';

const createOrder = async (order: IOrder): Promise<IOrder | null> => {
  let newOrder = null;
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { cow: cowId, buyer: buyerId } = order;

    const [cow, buyer] = await Promise.all([
      Cow.findById(cowId).session(session),
      User.findById(buyerId).session(session),
    ]);

    if (!cow || !buyer) {
      throw new ApiError(404, 'Cow or buyer not found');
    }
    if (cow.label === 'sold out') {
      throw new ApiError(httpStatus.ALREADY_REPORTED, 'Already sold');
    }
    if (buyer.budget < cow.price) {
      throw new ApiError(400, 'Insufficient funds');
    }
    cow.label = 'sold out';
    buyer.budget -= cow.price;
    const seller = await User.findById(cow.seller).session(session);
    if (!seller) {
      throw new ApiError(404, 'Seller not found');
    }
    seller.income += cow.price;

    await Promise.all([cow.save(), buyer.save()]);

    newOrder = await Order.create({ cow: cowId, buyer: buyerId });

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }

  return newOrder;
};

const getAllOrders = async (
  filters: IOrderFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IOrder[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const andCondition = [];

  if (searchTerm) {
    andCondition.push({
      $or: orderSearchableFields.map(field => ({
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

  const result = await Order.find(whereCondition)
    .populate('cow')
    .populate({
      path: 'cow',
      populate: {
        path: 'seller',
        model: 'User',
      },
    })
    .populate('buyer')
    .sort(sortCondition)
    .skip(skip)
    .limit(limit);

  const count = await Order.countDocuments(whereCondition);

  return {
    meta: {
      page,
      limit,
      count,
    },
    data: result,
  };
};

const getSingleOrder = async (id: string): Promise<IOrder | null> => {
  const result = await Order.findById(id)
    .populate('cow')
    .populate({
      path: 'cow',
      populate: {
        path: 'seller',
        model: 'User',
      },
    })
    .populate('buyer');
  return result;
};

export const OrderService = {
  createOrder,
  getAllOrders,
  getSingleOrder,
};
