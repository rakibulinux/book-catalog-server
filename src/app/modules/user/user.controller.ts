import { Request, Response } from 'express';
import { UserService } from './user.service';
import httpStatus from 'http-status';
import { IUser } from './user.interface';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import pick from '../../../shared/pick';
import { userFilterableFields } from './user.constent';
import { paginationField } from '../../constants/pagination';
import {
  ILoginUserResponse,
  IRefreshTokenResponse,
} from '../auth/auth.interface';
import config from '../../../config';
import { AuthService } from '../auth/auth.service';

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, userFilterableFields);
  const paginationOptions = pick(req.query, paginationField);
  const result = await UserService.getAllUsers(filters, paginationOptions);

  sendResponse<IUser[]>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User retrived Successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleUser = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await UserService.getSingleUser(id);

  sendResponse<IUser>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Single User retrived Successfully',
    data: result,
  });
});
const deleteSingleUser = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await UserService.deleteSingleUser(id);

  sendResponse<IUser>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User deleted Successfully',
    data: result,
  });
});
const updateSingleUser = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const updatedData = req.body;
  const result = await UserService.updateSingleUser(id, updatedData);

  sendResponse<IUser>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User Update Successfully',
    data: result,
  });
});
const loginUser = catchAsync(async (req: Request, res: Response) => {
  const { ...loginData } = req.body;
  const result = await AuthService.loginUser(loginData);
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
  const result = await AuthService.refreshToken(refreshToken);

  const cookieOption = {
    secure: config.env === 'production',
    httpOnly: true,
  };

  res.cookie('refreshToken', refreshToken, cookieOption);

  if (refreshToken)
    sendResponse<IRefreshTokenResponse>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User Login Successfully',
      data: result,
    });
});
export const UserController = {
  getAllUsers,
  getSingleUser,
  updateSingleUser,
  deleteSingleUser,
  loginUser,
  refreshToken,
};
