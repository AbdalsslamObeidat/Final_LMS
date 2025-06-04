import express from 'express';
import questionController from '../controllers/questionController.js';

const router = express.Router();

// Create a new question
router.post('/create', questionController.createQuestion);

// Get all questions
router.get('/getall', questionController.getAllQuestions);

// Get a single question by id
router.get('/get/:id', questionController.getQuestionById);

// Update a question by id
router.put('/update/:id', questionController.updateQuestion);

// Delete a question by id
router.delete('/delete/:id', questionController.deleteQuestion);

export default router;
