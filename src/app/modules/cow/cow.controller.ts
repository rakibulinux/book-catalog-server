import { Request, Response } from 'express';
import { CowService } from './cow.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { ICow } from './cow.interface';
import { cowFilterableFields } from './cow.constent';
import { paginationField } from '../../constants/pagination';
import pick from '../../../shared/pick';

const createCow = catchAsync(async (req: Request, res: Response) => {
  const { ...cowData } = req.body;
  const result = await CowService.createCow(cowData);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Cow Created Successfully',
    data: result,
  });
});

const getAllCows = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, cowFilterableFields);
  const paginationOptions = pick(req.query, paginationField);
  const result = await CowService.getAllCows(filters, paginationOptions);

  sendResponse<ICow[]>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Cow retrived Successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleCow = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await CowService.getSingleCow(id);

  sendResponse<ICow>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Single Cow retrived Successfully',
    data: result,
  });
});
const deleteSingleCow = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await CowService.deleteSingleCow(id);

  sendResponse<ICow>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Cow deleted Successfully',
    data: result,
  });
});
const updateSingleCow = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const updatedData = req.body;
  const result = await CowService.updateSingleCow(id, updatedData);

  sendResponse<ICow>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Cow Update Successfully',
    data: result,
  });
});

export const CowController = {
  createCow,
  getAllCows,
  getSingleCow,
  deleteSingleCow,
  updateSingleCow,
};
