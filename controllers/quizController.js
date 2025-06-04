import quizModel from '../models/quizModel.js';

const quizController = {
  async getAllQuizzes(req, res) {
    try {
      const quizzes = await quizModel.findAll();
      res.json(quizzes);
    } catch (error) {
      console.error('Error getting quizzes:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  async getQuizById(req, res) {
    try {
      const { id } = req.params;
      const quiz = await quizModel.findById(id);
      if (!quiz) {
        return res.status(404).json({ message: 'Quiz not found' });
      }
      res.json(quiz);
    } catch (error) {
      console.error('Error getting quiz by ID:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  async createQuiz(req, res) {
    try {
      const { lesson_id, max_score } = req.body;
      if (!lesson_id || max_score === undefined) {
        return res.status(400).json({ message: 'lesson_id and max_score are required' });
      }
      const newQuiz = await quizModel.create({ lesson_id, max_score });
      res.status(201).json(newQuiz);
    } catch (error) {
      console.error('Error creating quiz:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },
async updateQuiz(req, res) {
  try {
    const id = req.params.id;
    const { lesson_id, max_score } = req.body;

    // Optional: Validate input here before updating

    const updatedQuiz = await quizModel.update(id, { lesson_id, max_score });

    if (!updatedQuiz) {
      return res.status(404).json({ message: `Quiz with id ${id} not found` });
    }

    res.json(updatedQuiz);
  } catch (error) {
    console.error(`Error updating quiz with id ${req.params.id}:`, error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}
,

  async deleteQuiz(req, res) {
    try {
      const { id } = req.params;
      const deletedQuiz = await quizModel.delete(id);
      if (!deletedQuiz) {
        return res.status(404).json({ message: 'Quiz not found' });
      }
      res.json({ message: 'Quiz deleted successfully', id: deletedQuiz.id });
    } catch (error) {
      console.error('Error deleting quiz:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
};

export default quizController;
