import CatchAsync from '../utils/CatchAsync';
import { ROUTES } from '../config/constant';
import express from 'express';
import organizationController from '../app/organization/organization.controller';

const router = express.Router();

router.get(ROUTES.ORGANIZATION, CatchAsync(organizationController.paginate));

export default router;
