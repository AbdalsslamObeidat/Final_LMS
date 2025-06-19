import quizModel from "../models/quizModel.js";
import questionModel from "../models/questionModel.js";
import quizGradeModel from "../models/quizGradeModel.js";
import { authenticate } from "../middleware/auth.js";

const quizController = {
  async getAllQuizzes(req, res) {
    try {
      const quizzes = await quizModel.findAll();
      res.json(quizzes);
    } catch (error) {
      console.error("Error getting quizzes:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  async getQuizById(req, res) {
    try {
      const { id } = req.params;
      const quiz = await quizModel.findById(id);
      if (!quiz) {
        return res.status(404).json({ message: "Quiz not found" });
      }
      res.json(quiz);
    } catch (error) {
      console.error("Error getting quiz by ID:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  async createQuiz(req, res) {
    try {
      const { lesson_id, max_score } = req.body;
      if (!lesson_id || max_score === undefined) {
        return res
          .status(400)
          .json({ message: "lesson_id and max_score are required" });
      }
      const newQuiz = await quizModel.create({ lesson_id, max_score });
      res.status(201).json(newQuiz);
    } catch (error) {
      console.error("Error creating quiz:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  async updateQuiz(req, res) {
    try {
      const id = req.params.id;
      const { lesson_id, max_score } = req.body;

      // Optional: Validate input here before updating

      const updatedQuiz = await quizModel.update(id, { lesson_id, max_score });

      if (!updatedQuiz) {
        return res
          .status(404)
          .json({ message: `Quiz with id ${id} not found` });
      }

      res.json(updatedQuiz);
    } catch (error) {
      console.error(`Error updating quiz with id ${req.params.id}:`, error);
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  },

  async deleteQuiz(req, res) {
    try {
      const id = req.params.id;
      const result = await quizModel.delete(id);
      if (!result) {
        return res
          .status(404)
          .json({ message: `Quiz with id ${id} not found` });
      }
      res.json({ message: "Quiz deleted successfully" });
    } catch (error) {
      console.error("Error deleting quiz:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  async gradeQuiz(req, res) {
    try {
      // Validate request
      if (!req.params.quiz_id) {
        return res.status(400).json({
          success: false,
          message: "Quiz ID is required",
        });
      }

      if (!req.body || !req.body.answers) {
        return res.status(400).json({
          success: false,
          message: "Answers object is required in request body",
        });
      }

      if (typeof req.body.answers !== "object") {
        return res.status(400).json({
          success: false,
          message: "Answers must be a JSON object",
        });
      }

      const { quiz_id } = req.params;
      const { answers } = req.body;

      // Get all questions for this quiz
      const quizQuestions = await questionModel.getByQuizId(quiz_id);


      if (!quizQuestions || quizQuestions.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No questions found for this quiz",
        });
      }

      // Get all question IDs for this quiz
      const questionIds = quizQuestions.map((q) => q.id.toString());

      // Validate that all provided answers match existing question IDs
      const invalidQuestionIds = Object.keys(answers).filter(
        (id) => !questionIds.includes(id)
      );
      if (invalidQuestionIds.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid question IDs provided",
          invalidQuestionIds,
          validQuestionIds: questionIds,
        });
      }

      // Calculate grade
      let correctAnswers = 0;
      let incorrectAnswers = 0;
      const detailedResults = {};

      quizQuestions.forEach((question) => {
        const questionId = question.id.toString();
        const userAnswer = answers[questionId];

        if (userAnswer === undefined) {
          detailedResults[questionId] = {
            question: question.question_text,
            status: "not answered",
            correctAnswer: question.correct_answer,
          };
          incorrectAnswers++;
        } else if (userAnswer === question.correct_answer) {
          detailedResults[questionId] = {
            question: question.question_text,
            status: "correct",
            answer: userAnswer,
          };
          correctAnswers++;
        } else {
          detailedResults[questionId] = {
            question: question.question_text,
            status: "incorrect",
            answer: userAnswer,
            correctAnswer: question.correct_answer,
          };
          incorrectAnswers++;
        }
      });

      // Calculate percentage grade
      const totalQuestions = quizQuestions.length;
      const grade = Math.round((correctAnswers / totalQuestions) * 100).toFixed(2);

      // Save grade to database
      await quizGradeModel.create({
        quiz_id: parseInt(quiz_id),
        user_id: req.user.id, // Use authenticated user's ID
        grade,
      });

      res.json({
        success: true,
        grade,
        correctAnswers,
        incorrectAnswers,
        totalQuestions,
        message: "Quiz graded successfully",
        detailedResults,
      });
    } catch (error) {
      console.error("Error grading quiz:", error);
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: error.message,
      });
    }
  },
};

export default quizController;
