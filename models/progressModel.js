import { query } from '../config/db.js';

const ProgressModel = {
  /**
   * Mark a lesson as completed for a student's enrollment.
   * Uses UPSERT to insert or update the completion status.
   * @param {number} enrollmentId - ID of the student's course enrollment
   * @param {number} lessonId - ID of the lesson being marked completed
   */
  async completeLesson(enrollmentId, lessonId) {
    await query(
      `
      INSERT INTO lesson_progress (enrollment_id, lesson_id, is_completed, completed_at)
      VALUES ($1, $2, TRUE, NOW())
      ON CONFLICT (enrollment_id, lesson_id)
      DO UPDATE SET is_completed = TRUE, completed_at = NOW()
      `,
      [enrollmentId, lessonId]
    );
  },

  /**
   * Calculate overall course progress (percentage) for a student's enrollment.
   * Updates the 'progress' field in enrollments table.
   * @param {number} enrollmentId - ID of the student's course enrollment
   * @returns {object} - Object with total lessons, completed lessons, and progress percentage
   */
  async calculateProgress(enrollmentId) {
    // Get total lessons count in the course
    const totalLessonsRes = await query(
      `
      SELECT COUNT(*) FROM lessons
      WHERE module_id IN (
        SELECT id FROM modules
        WHERE course_id = (
          SELECT course_id FROM enrollments WHERE id = $1
        )
      )
      `,
      [enrollmentId]
    );

    // Get number of lessons completed by student
    const completedLessonsRes = await query(
      `
      SELECT COUNT(*) FROM lesson_progress
      WHERE enrollment_id = $1 AND is_completed = TRUE
      `,
      [enrollmentId]
    );

    const total = parseInt(totalLessonsRes.rows[0].count, 10);
    const completed = parseInt(completedLessonsRes.rows[0].count, 10);
    // Calculate percentage progress (0 if no lessons)
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Update progress field in enrollments table
    await query(
      `
      UPDATE enrollments SET progress = $1 WHERE id = $2
      `,
      [progress, enrollmentId]
    );

    // Return progress summary
    return { total, completed, progress };
  }
};

export default ProgressModel;
