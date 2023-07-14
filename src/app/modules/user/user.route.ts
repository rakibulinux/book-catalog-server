import express from 'express';
import { UserController } from './user.controller';
import { UserValidation } from './user.validation';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { ENUM_ADMIN_ROLE } from '../../../enums/user';

const router = express.Router();

router.get('/:id', auth(ENUM_ADMIN_ROLE.ADMIN), UserController.getSingleUser);
router.patch(
  '/:id',
  validateRequest(UserValidation.updateUserZodSchema),
  auth(ENUM_ADMIN_ROLE.ADMIN),
  UserController.updateSingleUser
);
router.delete(
  '/:id',
  auth(ENUM_ADMIN_ROLE.ADMIN),
  UserController.deleteSingleUser
);
router.get('/', auth(ENUM_ADMIN_ROLE.ADMIN), UserController.getAllUsers);

export const UserRoutes = router;
