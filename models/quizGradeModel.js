import { query } from "../config/db.js";

const quizGradeModel = {
  async create({ quiz_id, user_id, grade }) {
    try {
      const result = await query(
        `INSERT INTO quiz_grades (quiz_id, user_id, grade)
         VALUES ($1, $2, $3)
         ON CONFLICT (quiz_id, user_id)
         DO UPDATE SET grade = EXCLUDED.grade, updated_at = CURRENT_TIMESTAMP
         RETURNING *`,
        [quiz_id, user_id, grade]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  async findByQuizAndUser(quiz_id, user_id) {
    try {
      const result = await query(
        "SELECT * FROM quiz_grades WHERE quiz_id = $1 AND user_id = $2",
        [quiz_id, user_id]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  async findByUser(user_id) {
    try {
      const result = await query(
        "SELECT * FROM quiz_grades WHERE user_id = $1 ORDER BY created_at DESC",
        [user_id]
      );
      return result.rows;
    } catch (error) {
      throw error;
    }
  },
};

export default quizGradeModel;
