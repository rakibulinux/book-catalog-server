import { Request, Response } from 'express';
import { OrderService } from './order.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { paginationField } from '../../constants/pagination';
import pick from '../../../shared/pick';
import { orderFilterableFields } from './order.constent';
import { IOrder } from './order.interface';

const createOrder = catchAsync(async (req: Request, res: Response) => {
  const { ...orderData } = req.body;
  const result = await OrderService.createOrder(orderData);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Order Created Successfully',
    data: result,
  });
});

const getAllOrders = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, orderFilterableFields);
  const paginationOptions = pick(req.query, paginationField);
  const result = await OrderService.getAllOrders(filters, paginationOptions);

  sendResponse<IOrder[]>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Order retrived Successfully',
    meta: result.meta,
    data: result.data,
  });
});
const getSingleOrder = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await OrderService.getSingleOrder(id);

  sendResponse<IOrder>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Order retrived Successfully',
    data: result,
  });
});

export const OrderController = {
  createOrder,
  getAllOrders,
  getSingleOrder,
};
