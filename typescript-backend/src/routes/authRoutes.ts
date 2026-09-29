// backend/src/routes/authRoutes.ts
import express, { Router } from 'express';

import {
  registerUser,
  loginUser
} from '../controllers/authController';

const router: Router = express.Router();

// Register
router.post('/register', registerUser);

// Login
router.post('/login', loginUser);

export default router;