import express from 'express';
import EnrollmentController from '../controllers/enrollmentController.js';

const router = express.Router();

// Create new enrollment
router.post('/create', EnrollmentController.create);

// Get all enrollments
router.get('/getall', EnrollmentController.getAll);

// Get enrollment by ID
router.get('/get/:id', EnrollmentController.getById);

// Update enrollment by ID
router.put('/update/:id', EnrollmentController.update);

// Delete enrollment by ID
router.delete('/delete/:id', EnrollmentController.delete);

// Get enrollments by user ID
router.get('/user/:user_id', EnrollmentController.getByUserId);

// Get enrollments by course ID
router.get('/course/:course_id', EnrollmentController.getByCourseId);

export default router;
