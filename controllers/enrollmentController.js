import EnrollmentModel from '../models/enrollmentModel.js';

const EnrollmentController = {
  async create(req, res) {
    try {
      const { user_id, course_id, enrolled_at, completed_at, progress } = req.body;
      if (!user_id || !course_id) {
        return res.status(400).json({ message: 'user_id and course_id are required' });
      }
      const enrollment = await EnrollmentModel.create({
        user_id,
        course_id,
        enrolled_at,
        completed_at,
        progress,
      });
      res.status(201).json(enrollment);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to create enrollment', error: error.message });
    }
  },

  async getById(req, res) {
    try {
      const enrollment = await EnrollmentModel.findById(req.params.id);
      if (!enrollment) return res.status(404).json({ message: 'Enrollment not found' });
      res.json(enrollment);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to get enrollment', error: error.message });
    }
  },

  async getAll(req, res) {
    try {
      const enrollments = await EnrollmentModel.findAll();
      res.json(enrollments);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to get enrollments', error: error.message });
    }
  },

  async update(req, res) {
    try {
      const { completed_at, progress } = req.body;
      const updatedEnrollment = await EnrollmentModel.update(req.params.id, { completed_at, progress });
      if (!updatedEnrollment) return res.status(404).json({ message: 'Enrollment not found' });
      res.json(updatedEnrollment);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to update enrollment', error: error.message });
    }
  },

  async updateProgress(req, res) {
  try {
    const { progress } = req.body;
    if (progress == null) return res.status(400).json({ message: 'Progress is required' });

    const updatedEnrollment = await EnrollmentModel.update(req.params.id, { progress });
    if (!updatedEnrollment) return res.status(404).json({ message: 'Enrollment not found' });

    res.json(updatedEnrollment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update progress', error: error.message });
  }
},


  async delete(req, res) {
    try {
      await EnrollmentModel.delete(req.params.id);
      res.json({ message: 'Enrollment deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to delete enrollment', error: error.message });
    }
  },

  async getByUserId(req, res) {
    try {
      const enrollments = await EnrollmentModel.findByUserId(req.params.user_id);
      res.json(enrollments);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to get enrollments for user', error: error.message });
    }
  },

  async getByCourseId(req, res) {
    try {
      const enrollments = await EnrollmentModel.findByCourseId(req.params.course_id);
      res.json(enrollments);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to get enrollments for course', error: error.message });
    }
  },
};

export default EnrollmentController;
