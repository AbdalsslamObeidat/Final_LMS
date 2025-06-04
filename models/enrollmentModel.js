import { query } from '../config/db.js';

const EnrollmentModel = {
  // Create a new enrollment
  async create({ user_id, course_id, enrolled_at = new Date(), completed_at = null, progress = 0 }) {
    const sql = `
      INSERT INTO enrollments (user_id, course_id, enrolled_at, completed_at, progress)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [user_id, course_id, enrolled_at, completed_at, progress];
    const { rows } = await query(sql, values);
    return rows[0];
  },

  // Find enrollment by id
  async findById(id) {
    const { rows } = await query('SELECT * FROM enrollments WHERE id = $1', [id]);
    return rows[0];
  },

  // Find all enrollments
  async findAll() {
    const { rows } = await query('SELECT * FROM enrollments ORDER BY enrolled_at DESC');
    return rows;
  },

  // Update enrollment by id
  async update(id, { completed_at, progress }) {
    // Allow updating completed_at and progress only
    const sql = `
      UPDATE enrollments
      SET completed_at = COALESCE($2, completed_at),
          progress = COALESCE($3, progress)
      WHERE id = $1
      RETURNING *;
    `;
    const values = [id, completed_at, progress];
    const { rows } = await query(sql, values);
    return rows[0];
  },

  // Delete enrollment by id
  async delete(id) {
    await query('DELETE FROM enrollments WHERE id = $1', [id]);
  },

  // Find enrollments by user_id
  async findByUserId(user_id) {
    const { rows } = await query('SELECT * FROM enrollments WHERE user_id = $1', [user_id]);
    return rows;
  },

  // Find enrollments by course_id
  async findByCourseId(course_id) {
    const { rows } = await query('SELECT * FROM enrollments WHERE course_id = $1', [course_id]);
    return rows;
  },
};

export default EnrollmentModel;
