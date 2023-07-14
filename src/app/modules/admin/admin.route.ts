import express from 'express';
import { AdminController } from './admin.controller';
import { AdminValidation } from './admin.validation';
import validateRequest from '../../middlewares/validateRequest';

const router = express.Router();

router.post(
  '/create-admin',
  validateRequest(AdminValidation.createAdminZodSchema),
  AdminController.createAdmin
);

router.post(
  '/login',
  validateRequest(AdminValidation.loginAdminZodSchema),
  AdminController.loginAdmin
);

export const AdminRoutes = router;
