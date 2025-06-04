import questionModel from '../models/questionModel.js';

const questionController = {
 async createQuestion(req, res) {
  try {
    console.log('Received body:', req.body);
    const question = await questionModel.create(req.body);
    res.status(201).json(question);
  } catch (error) {
    console.error('Error creating question:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
},

  async getAllQuestions(req, res) {
    try {
      const questions = await questionModel.getAll();
      res.json(questions);
    } catch (error) {
      console.error('Error fetching questions:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  async getQuestionById(req, res) {
    try {
      const question = await questionModel.getById(req.params.id);
      if (!question) return res.status(404).json({ message: 'Question not found' });
      res.json(question);
    } catch (error) {
      console.error('Error fetching question:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

 async updateQuestion(req, res) {
  try {
    let { question_text, options, correct_answer, quizz_id } = req.body;
    

    if (typeof options === 'string') {
      try {
        options = JSON.parse(options);
       
      } catch (err) {
        console.error(' Invalid JSON format for options:', err.message);
        return res.status(400).json({ message: 'Invalid JSON format for options' });
      }
    }

    if (!question_text || !correct_answer || !quizz_id) {
     
      return res.status(400).json({ message: 'question_text, correct_answer, and quizz_id are required' });
    }

    const updated = await questionModel.update(req.params.id, {
      question_text,
      options,
      correct_answer,
      quizz_id,
    });

    if (!updated) {
      
      return res.status(404).json({ message: 'Question not found' });
    }

    
    res.json(updated);

  } catch (error) {
    console.error(' Error updating question:', error.message);
    console.error(error); // logs full object
    res.status(500).json({ message: 'Internal Server Error' });
  }
},




   

  async deleteQuestion(req, res) {
    try {
      const deleted = await questionModel.delete(req.params.id);
      if (!deleted) return res.status(404).json({ message: 'Question not found' });
      res.json({ message: 'Question deleted successfully', id: deleted.id });
    } catch (error) {
      console.error('Error deleting question:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
};

export default questionController;
