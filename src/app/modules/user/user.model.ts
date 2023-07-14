/* eslint-disable @typescript-eslint/no-this-alias */
import { Schema, model } from 'mongoose';
import { IUser, UserModel } from './user.interface';
import bcrypt from 'bcrypt';
import config from '../../../config';
import { ENUM_USER_ROLE } from '../../../enums/user';
const UserSchema = new Schema<IUser, UserModel>(
  {
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      required: true,
      enum: ENUM_USER_ROLE,
    },
    name: {
      type: {
        firstName: {
          type: String,
          required: true,
        },
        lastName: {
          type: String,
          required: true,
        },
      },
      required: true,
    },
    phoneNumber: {
      type: String,
      unique: true,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    budget: {
      type: Number,
      required: true,
    },
    income: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

UserSchema.statics.isUserExsist = async function (
  phoneNumber: string
): Promise<Pick<IUser, '_id' | 'phoneNumber' | 'role' | 'password'> | null> {
  return await User.findOne(
    { phoneNumber },
    { _id: 1, role: 1, password: 1, phoneNumber: 1 }
  );
};

UserSchema.statics.isPasswordMatched = async function (
  givenPassword: string,
  savedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(givenPassword, savedPassword);
};

UserSchema.pre('save', async function (next) {
  const user = this;
  // Check if the user's password is modified before hashing
  if (user.isModified('password')) {
    try {
      const saltRounds = Number(config.bcrypt_salt_rounds);
      const hashedPassword = await bcrypt.hash(user.password, saltRounds);
      user.password = hashedPassword;
    } catch (error) {
      return next();
    }
  }
  next();
});

export const User = model<IUser, UserModel>('User', UserSchema);
