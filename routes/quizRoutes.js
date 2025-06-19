import express from "express";
import quizController from "../controllers/quizController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// POST /api/quizzes/create
router.post("/create", quizController.createQuiz);

// GET /api/quizzes/getall
router.get("/getall", quizController.getAllQuizzes);

// GET /api/quizzes/get/:id
router.get("/get/:id", quizController.getQuizById);

// PUT /api/quizzes/update/:id
router.put("/update/:id", authenticate, quizController.updateQuiz);

// DELETE /api/quizzes/delete/:id
router.delete("/delete/:id", authenticate, quizController.deleteQuiz);

// POST /api/quizzes/:quiz_id/grade
router.post("/:quiz_id/grade", authenticate, quizController.gradeQuiz);

export default router;
