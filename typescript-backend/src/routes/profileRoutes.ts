import express, { Router } from 'express';

import { authenticateUser } from '../middleware/authMiddleware';
import {
  getProfile,
  updateProfile
} from '../controllers/profileController';

const router: Router = express.Router();

// View Profile
router.get('/', authenticateUser, getProfile);

// Update Profile
router.put('/', authenticateUser, updateProfile);

export default router;
