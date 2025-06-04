import express from 'express';
import CategoryController from '../controllers/categoryController.js';

const router = express.Router();

router.post('/create', CategoryController.create);
router.get('/getall', CategoryController.getAll);
router.get('/get/:id', CategoryController.getById);
router.put('/update/:id', CategoryController.update);
router.delete('/delete/:id', CategoryController.delete);

export default router;
