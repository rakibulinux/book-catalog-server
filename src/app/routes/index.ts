import express, { Router } from 'express';
import { AuthRoutes } from '../modules/auth/auth.route';

const router = express.Router();

const moduleRoutes: {
  path: string;
  route: Router;
}[] = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
];

// Application route
moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
