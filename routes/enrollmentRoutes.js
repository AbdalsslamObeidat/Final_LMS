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

//This route lets the frontend update progress when a student completes a lesson or module.
router.patch('/progress/:id', EnrollmentController.updateProgress);

// Delete enrollment by ID
router.delete('/delete/:id', EnrollmentController.delete);

// Get enrollments by user ID
router.get('/user/:user_id', EnrollmentController.getByUserId);

// Get enrollments by course ID
router.get('/course/:course_id', EnrollmentController.getByCourseId);

export default router;
