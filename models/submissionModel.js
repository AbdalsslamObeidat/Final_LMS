import { query } from '../config/db.js';

const submissionModel = {
  async create({ assignment_id, user_id, submission_url, grade, feedback }) {
    const result = await query(
      `INSERT INTO submissions (assignment_id, user_id, submission_url, grade, feedback)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [assignment_id, user_id, submission_url, grade || null, feedback || null]
    );
    return result.rows[0];
  },

  async getAll() {
    const result = await query(`SELECT * FROM submissions`);
    return result.rows;
  },

  async getById(id) {
    const result = await query(`SELECT * FROM submissions WHERE id = $1`, [id]);
    return result.rows[0];
  },

  async update(id, { assignment_id, user_id, submission_url, grade, feedback }) {
    const result = await query(
      `UPDATE submissions
       SET assignment_id = $1,
           user_id = $2,
           submission_url = $3,
           grade = $4,
           feedback = $5,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $6 RETURNING *`,
      [assignment_id, user_id, submission_url, grade, feedback, id]
    );
    return result.rows[0];
  },

  async delete(id) {
    const result = await query(`DELETE FROM submissions WHERE id = $1 RETURNING *`, [id]);
    return result.rows[0];
  }
};

export default submissionModel;
