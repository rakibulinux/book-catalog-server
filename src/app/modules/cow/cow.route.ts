import express from 'express';
import { CowController } from './cow.controller';
import validateRequest from '../../middlewares/validateRequest';
import { CowValidation } from './cow.validation';
import auth from '../../middlewares/auth';
import { ENUM_ADMIN_ROLE, ENUM_USER_ROLE } from '../../../enums/user';
const router = express.Router();

router.post(
  '/',
  validateRequest(CowValidation.createCowZodSchema),
  auth(ENUM_USER_ROLE.SELLER),
  CowController.createCow
);
router.get(
  '/:id',
  auth(ENUM_USER_ROLE.SELLER, ENUM_USER_ROLE.BUYER, ENUM_ADMIN_ROLE.ADMIN),
  CowController.getSingleCow
);
router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.SELLER),
  CowController.deleteSingleCow
);
router.patch(
  '/:id',
  validateRequest(CowValidation.updateCowZodSchema),
  auth(ENUM_USER_ROLE.SELLER),

  CowController.updateSingleCow
);
router.get(
  '/',
  auth(ENUM_USER_ROLE.SELLER, ENUM_USER_ROLE.BUYER, ENUM_ADMIN_ROLE.ADMIN),
  CowController.getAllCows
);

export const CowRoutes = router;
