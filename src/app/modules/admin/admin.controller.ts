import { Request, Response } from 'express';
import { AdminService } from './admin.service';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import pick from '../../../shared/pick';
import { paginationField } from '../../constants/pagination';
import { IAdmin } from './admin.interface';
import { adminFilterableFields } from './admin.constent';
import {
  ILoginUserResponse,
  IRefreshTokenResponse,
} from '../auth/auth.interface';
import config from '../../../config';

const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const { ...adminData } = req.body;
  const result = await AdminService.createAdmin(adminData);

  sendResponse<IAdmin>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Admin Created Successfully',
    data: result,
  });
});

const loginAdmin = catchAsync(async (req: Request, res: Response) => {
  const { ...loginData } = req.body;
  const result = await AdminService.loginAdmin(loginData);
  const { refreshToken, ...others } = result;

  const cookieOption = {
    secure: config.env === 'production',
    httpOnly: true,
  };

  res.cookie('refreshToken', refreshToken, cookieOption);

  if (refreshToken)
    sendResponse<ILoginUserResponse>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User Login Successfully',
      data: others,
    });
});
const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  const result = await AdminService.refreshToken(refreshToken);

  const cookieOption = {
    secure: config.env === 'production',
    httpOnly: true,
  };

  res.cookie('refreshToken', refreshToken, cookieOption);

  if (refreshToken)
    sendResponse<IRefreshTokenResponse>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Admin Login Successfully',
      data: result,
    });
});

const getAllAdmins = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, adminFilterableFields);
  const paginationOptions = pick(req.query, paginationField);
  const result = await AdminService.getAllAdmins(filters, paginationOptions);

  sendResponse<IAdmin[]>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Admin retrived Successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleAdmin = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await AdminService.getSingleAdmin(id);

  sendResponse<IAdmin>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Single Admin retrived Successfully',
    data: result,
  });
});
const deleteSingleAdmin = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await AdminService.deleteSingleAdmin(id);

  sendResponse<IAdmin>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Admin deleted Successfully',
    data: result,
  });
});
const updateSingleAdmin = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const updatedData = req.body;
  const result = await AdminService.updateSingleAdmin(id, updatedData);

  sendResponse<IAdmin>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Admin Update Successfully',
    data: result,
  });
});

export const AdminController = {
  createAdmin,
  getAllAdmins,
  getSingleAdmin,
  updateSingleAdmin,
  deleteSingleAdmin,
  loginAdmin,
  refreshToken,
};
