import LessonModel from '../models/lessonModel.js';

const LessonController = {
  // Handle request to create a new lesson
  async create(req, res) {
    try {
      const lesson = await LessonModel.create(req.body);
      res.status(201).json(lesson);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Handle request to retrieve a lesson by ID
  async getById(req, res) {
    try {
      const lesson = await LessonModel.findById(req.params.id);
      if (!lesson) return res.status(404).json({ error: 'Lesson not found' });
      res.json(lesson);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Handle request to retrieve all lessons
  async getAll(req, res) {
    try {
      const lessons = await LessonModel.findAll();
      res.json(lessons);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Handle request to update a lesson by ID
  async update(req, res) {
    try {
      const updated = await LessonModel.update(req.params.id, req.body);
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Handle request to delete a lesson by ID
  async delete(req, res) {
    try {
      await LessonModel.delete(req.params.id);
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

export default LessonController;