import assignmentModel from '../models/assignmentModel.js';

const assignmentController = {
  async createAssignment(req, res) {
    try {
      const { lesson_id, title, description, deadline, max_score } = req.body;
      if (!lesson_id || !title) {
        return res.status(400).json({ message: 'lesson_id and title are required' });
      }

      const assignment = await assignmentModel.create({ lesson_id, title, description, deadline, max_score });
      res.status(201).json(assignment);
    } catch (error) {
      console.error('Error creating assignment:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  async getAllAssignments(req, res) {
    try {
      const assignments = await assignmentModel.getAll();
      res.json(assignments);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  async getAssignmentById(req, res) {
    try {
      const assignment = await assignmentModel.getById(req.params.id);
      if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
      res.json(assignment);
    } catch (error) {
      console.error('Error fetching assignment:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  async updateAssignment(req, res) {
    try {
      const { lesson_id, title, description, deadline, max_score } = req.body;
      const updated = await assignmentModel.update(req.params.id, {
        lesson_id,
        title,
        description,
        deadline,
        max_score
      });
      if (!updated) return res.status(404).json({ message: 'Assignment not found' });
      res.json(updated);
    } catch (error) {
      console.error('Error updating assignment:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  async deleteAssignment(req, res) {
    try {
      const deleted = await assignmentModel.delete(req.params.id);
      if (!deleted) return res.status(404).json({ message: 'Assignment not found' });
      res.json({ message: 'Assignment deleted successfully', id: deleted.id });
    } catch (error) {
      console.error('Error deleting assignment:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
};

export default assignmentController;
