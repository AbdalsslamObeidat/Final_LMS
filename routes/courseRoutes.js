import express from 'express';
import CourseController from '../controllers/courseController.js';

const router = express.Router();

// POST /api/courses/create
router.post('/create', CourseController.create);

// GET /api/courses/getall
router.get('/getall', CourseController.getAll);

// GET /api/courses/get/:id
router.get('/get/:id', CourseController.getById);

// PUT /api/courses/update/:id
router.put('/update/:id', CourseController.update);

// DELETE /api/courses/delete/:id
router.delete('/delete/:id', CourseController.delete);
// Course approval
router.patch('/courses/:id/approval', CourseController.approveOrReject);

//Show pending courses for admin review
router.get('/courses/pending', CourseController.getPendingCourses);

//publish courses
router.patch('/courses/:id/publish', CourseController.publishOrUnpublish);
export default router;
