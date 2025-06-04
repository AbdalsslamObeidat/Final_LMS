import express from 'express';
import quizController from '../controllers/quizController.js';

const router = express.Router();

// POST /api/quizzes/create
router.post('/create', quizController.createQuiz);

// GET /api/quizzes/getall
router.get('/getall', quizController.getAllQuizzes);

// GET /api/quizzes/get/:id
router.get('/get/:id', quizController.getQuizById);

// PUT /api/quizzes/update/:id
router.put('/update/:id', quizController.updateQuiz);

// DELETE /api/quizzes/delete/:id
router.delete('/delete/:id', quizController.deleteQuiz);

export default router;
