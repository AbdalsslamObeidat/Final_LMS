import express from 'express';
import ModuleController from '../controllers/moduleController.js';

const router = express.Router();

// Get all modules for a specific course
router.get('/course/:courseId', ModuleController.getModulesByCourse);

// Create a new module
router.post('/create', ModuleController.createModule);

// Get a single module by id
router.get('/get/:id', ModuleController.getModuleById);

// Update a module by id
router.put('/update/:id', ModuleController.updateModule);

// Delete a module by id
router.delete('/delete/:id', ModuleController.deleteModule);

export default router;
