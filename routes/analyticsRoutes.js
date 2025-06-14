import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import {
  getStudentPerformanceAnalytics,
} from '../controllers/analyticsController.js';

const router = Router();

router.get(
  '/student-performance',
  authenticate,
  authorize(['admin', 'instructor']), 
  getStudentPerformanceAnalytics
);

export default router;