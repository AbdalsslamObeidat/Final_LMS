import { query } from '../config/db.js';

const LessonModel = {
  // Create a new lesson
  async create({ module_id, title, content_type, content_url, duration = 0, order }) {
    const sql = `
      INSERT INTO lessons (module_id, title, content_type, content_url, duration, "order")
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const values = [module_id, title, content_type, content_url, duration, order];
    const { rows } = await query(sql, values);
    return rows[0];
  },

  // Find a lesson by its ID
  async findById(id) {
    const { rows } = await query('SELECT * FROM lessons WHERE id = $1', [id]);
    return rows[0];
  },

  // Retrieve all lessons
  async findAll() {
    const { rows } = await query('SELECT * FROM lessons ORDER BY created_at DESC');
    return rows;
  },

  // Update a lesson by ID
  async update(id, { title, content_type, content_url, duration, order }) {
    const sql = `
      UPDATE lessons SET
        title = COALESCE($2, title),
        content_type = COALESCE($3, content_type),
        content_url = COALESCE($4, content_url),
        duration = COALESCE($5, duration),
        "order" = COALESCE($6, "order"),
       
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *;
    `;
    const values = [id, title, content_type, content_url, duration, order];
    const { rows } = await query(sql, values);
    return rows[0];
  },

  // Delete a lesson by ID
  async delete(id) {
    await query('DELETE FROM lessons WHERE id = $1', [id]);
  }
};

export default LessonModel;