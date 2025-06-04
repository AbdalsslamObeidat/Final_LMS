import express from 'express';
import assignmentController from '../controllers/assignmentController.js';

const router = express.Router();

router.post('/create', assignmentController.createAssignment);
router.get('/getall', assignmentController.getAllAssignments);
router.get('/get/:id', assignmentController.getAssignmentById);
router.put('/update/:id', assignmentController.updateAssignment);
router.delete('/delete/:id', assignmentController.deleteAssignment);

export default router;
