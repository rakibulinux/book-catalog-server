/* eslint-disable @typescript-eslint/no-explicit-any */
import Book from './book.model';
import { IBook, IBookFilters } from './book.interface';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { SortOrder } from 'mongoose';
import calculatePagination from '../../helpers/paginationHelpers';
import { bookSearchableFields } from './book.constent';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';

const createBook = async (book: IBook): Promise<IBook | null> => {
  const createdBook = await Book.create(book);
  if (!createdBook) {
    throw new ApiError(400, `Failed to create Book`);
  }
  return createdBook;
};

const getAllBooks = async (
  filters: IBookFilters,
  paginationOptions: IPaginationOptions,
): Promise<IGenericResponse<IBook[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const andCondition = [];

  if (searchTerm) {
    andCondition.push({
      $or: bookSearchableFields.map(field => ({
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

  const result = await Book.find(whereCondition)
    .sort(sortCondition)
    .skip(skip)
    .limit(limit);
  const count = await Book.countDocuments(whereCondition);

  return {
    meta: {
      page,
      limit,
      count,
    },
    data: result,
  };
};

const getSingleBook = async (id: string): Promise<IBook | null> => {
  const result = await Book.findById(id);
  return result;
};
const deleteSingleBook = async (id: string): Promise<IBook | null> => {
  const result = await Book.findByIdAndDelete(id);
  return result;
};
const updateSingleBook = async (
  id: string,
  payload: Partial<IBook>,
): Promise<IBook | null> => {
  const isExsist = await Book.findOne({ _id: id });

  if (!isExsist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Book Not found');
  }
  const { ...BookData } = payload;
  const updateBookData: Partial<IBook> = { ...BookData };
  const result = await Book.findOneAndUpdate({ _id: id }, updateBookData, {
    new: true,
  });
  return result;
};

export const BookService = {
  createBook,
  getAllBooks,
  getSingleBook,
  deleteSingleBook,
  updateSingleBook,
};
