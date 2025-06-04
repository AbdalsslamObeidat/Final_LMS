import express from 'express';
import submissionController from '../controllers/submissionController.js';

const router = express.Router();

// POST /api/submissions/create
router.post('/create', submissionController.createSubmission);

// GET /api/submissions/getall
router.get('/getall', submissionController.getAllSubmissions);

// GET /api/submissions/get/:id
router.get('/get/:id', submissionController.getSubmissionById);

// PUT /api/submissions/update/:id
router.put('/update/:id', submissionController.updateSubmission);

// DELETE /api/submissions/delete/:id
router.delete('/delete/:id', submissionController.deleteSubmission);

export default router;
