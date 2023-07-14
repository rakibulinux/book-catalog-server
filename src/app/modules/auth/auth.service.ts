import ApiError from '../../../errors/ApiError';
import { IUser } from '../user/user.interface';
import { User } from '../user/user.model';
import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';
import config from '../../../config';
import { jwtHelpers } from '../../helpers/jwtHelpers';
import {
  ILoginUser,
  ILoginUserResponse,
  IRefreshTokenResponse,
} from './auth.interface';

const createUser = async (user: IUser): Promise<IUser | null> => {
  const createdUser = await User.create(user);
  if (!createdUser) {
    throw new ApiError(400, `Failed to create user`);
  }
  return createdUser;
};

const loginUser = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  const { phoneNumber: userId, password } = payload;

  const isUserExsist = await User.isUserExsist(userId);

  if (!isUserExsist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exsist');
  }

  if (
    isUserExsist.password &&
    !(await User.isPasswordMatched(password, isUserExsist?.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect');
  }

  const { _id, phoneNumber, role } = isUserExsist;

  //Token
  const accessToken = jwtHelpers.createToken(
    { _id, phoneNumber, role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );
  const refreshToken = jwtHelpers.createToken(
    { _id, phoneNumber, role },
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
  } catch (error) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid Refresh Token');
  }
  const { phoneNumber } = verifiedToken;

  const isUserExsist = await User.isUserExsist(phoneNumber);

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

export const AuthService = {
  createUser,
  loginUser,
  refreshToken,
};
