import ProgressModel from '../models/progressModel.js';

const ProgressController = {
  /**
   * Controller to handle marking a lesson completed.
   * Expects enrollmentId and lessonId in request body.
   */
  async markLessonCompleted(req, res) {
    const { enrollmentId, lessonId } = req.body;

    try {
      await ProgressModel.completeLesson(enrollmentId, lessonId);
      res.status(200).json({ message: 'Lesson marked as completed' });
    } catch (error) {
      console.error('Error marking lesson completed:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  /**
   * Controller to fetch progress summary for an enrollment.
   * Expects enrollmentId as URL param.
   */
  async getProgress(req, res) {
    const { enrollmentId } = req.params;

    try {
      const progressData = await ProgressModel.calculateProgress(enrollmentId);
      res.status(200).json(progressData);
    } catch (error) {
      console.error('Error fetching progress:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export default ProgressController;
