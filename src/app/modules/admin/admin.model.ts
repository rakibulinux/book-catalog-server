/* eslint-disable @typescript-eslint/no-this-alias */
import { Schema, model } from 'mongoose';
import { AdminModel, IAdmin } from './admin.interface';
import { ENUM_ADMIN_ROLE } from '../../../enums/user';
import bcrypt from 'bcrypt';
import config from '../../../config';
const AdminSchema = new Schema<IAdmin, AdminModel>(
  {
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      required: true,
      enum: ENUM_ADMIN_ROLE,
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
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

AdminSchema.statics.isUserExsist = async function (
  phoneNumber: string
): Promise<Pick<IAdmin, 'phoneNumber' | 'role' | 'password'> | null> {
  return await Admin.findOne(
    { phoneNumber },
    { role: 1, password: 1, phoneNumber: 1 }
  );
};

AdminSchema.statics.isPasswordMatched = async function (
  givenPassword: string,
  savedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(givenPassword, savedPassword);
};

AdminSchema.pre('save', async function (next) {
  const user = this;
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds)
  );
  next();
});

export const Admin = model<IAdmin, AdminModel>('Admin', AdminSchema);
