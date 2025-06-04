// models/quizModel.js
import { query } from '../config/db.js';

const QuizModel = {
  // Create a new quiz record
  async create({ lesson_id, max_score }) {
    const sql = `
      INSERT INTO quizzes (lesson_id, max_score)
      VALUES ($1, $2)
      RETURNING *;
    `;
    const values = [lesson_id, max_score];
    const { rows } = await query(sql, values);
    return rows[0];
  },

  // Retrieve a quiz by its ID
  async findById(id) {
    const { rows } = await query(
      'SELECT * FROM quizzes WHERE id = $1',
      [id]
    );
    return rows[0];
  },

  // Retrieve all quizzes
  async findAll() {
    const { rows } = await query(
      'SELECT * FROM quizzes ORDER BY created_at DESC'
    );
    return rows;
  },

  // Update a quiz by its ID
  async update(id, { lesson_id, max_score }) {
    const sql = `
      UPDATE quizzes SET
        lesson_id = COALESCE($2, lesson_id),
        max_score = COALESCE($3, max_score),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *;
    `;
    const values = [id, lesson_id, max_score];
    const { rows } = await query(sql, values);
    return rows[0];
  },

  // Delete a quiz by its ID
  async delete(id) {
  const result = await query(
    'DELETE FROM quizzes WHERE id = $1 RETURNING *',
    [id]
  );
  return result.rows[0]; // Now it will contain the deleted quiz row
},


  // Get all quizzes for a specific lesson_id
  async findByLessonId(lessonId) {
    const { rows } = await query(
      'SELECT * FROM quizzes WHERE lesson_id = $1 ORDER BY created_at DESC',
      [lessonId]
    );
    return rows;
  },

};

export default QuizModel;
