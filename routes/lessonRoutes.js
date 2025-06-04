import express from 'express';
import LessonController from '../controllers/lessonController.js';

const router = express.Router();

// Route to create a new lesson
router.post('/create', LessonController.create);

// Route to get a lesson by its ID
router.get('/get/:id', LessonController.getById);

// Route to get all lessons
router.get('/getall', LessonController.getAll);

// Route to update a lesson by its ID
router.put('/update/:id', LessonController.update);

// Route to delete a lesson by its ID
router.delete('/delete/:id', LessonController.delete);

export default router;