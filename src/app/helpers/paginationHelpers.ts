import { SortOrder } from 'mongoose';

type IOptions = {
  page?: number;
  limit?: number;
  soryBy?: string;
  sortOrder?: SortOrder;
};

type IOptionsResult = {
  page: number;
  limit: number;
  skip: number;
  soryBy: string;
  sortOrder: SortOrder;
};

const calculatePagination = (options: IOptions): IOptionsResult => {
  const page = Number(options.page || 1);
  const limit = Number(options.limit || 10);
  const skip = (page - 1) * limit;
  const soryBy = options.soryBy || 'createdAt';
  const sortOrder = options.sortOrder || 'desc';
  return {
    page,
    limit,
    skip,
    soryBy,
    sortOrder,
  };
};

export default calculatePagination;
