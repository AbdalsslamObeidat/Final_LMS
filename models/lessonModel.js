import { query } from "../config/db.js";

const LessonModel = {
  // Create a new lesson
  async create({
    module_id,
    title,
    content_type,
    content_url,
    content_text,
    duration = 0,
    order,
  }) {
    const sql = `
      INSERT INTO lessons (module_id, title, content_type, content_url, content_text, duration, "order")
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
    const values = [
      module_id,
      title,
      content_type,
      content_url,
      content_text,
      duration,
      order,
    ];
    const { rows } = await query(sql, values);
    return rows[0];
  },

  // Find a lesson by its ID
  async findById(id) {
    const { rows } = await query("SELECT * FROM lessons WHERE id = $1", [id]);
    return rows[0];
  },

  // Retrieve all lessons
  async findAll() {
    const { rows } = await query(
      "SELECT * FROM lessons ORDER BY created_at DESC"
    );
    return rows;
  },

  // Retrieve all lessons for a specific module
  async findAllByModule(module_id) {
    const { rows } = await query(
      'SELECT * FROM lessons WHERE module_id = $1 ORDER BY "order" ASC',
      [module_id]
    );
    return rows;
  },

  // Update a lesson by ID
  async update(id, { title, content_type, content_url, content_text, duration, order }) {
    const sql = `
      UPDATE lessons SET
        title = COALESCE($2, title),
        content_type = COALESCE($3, content_type),
        content_url = COALESCE($4, content_url),
        content_text = COALESCE($5, content_text),
        duration = COALESCE($6, duration),
        "order" = COALESCE($7, "order"),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *;
    `;
    const values = [id, title, content_type, content_url, content_text, duration, order];
    const { rows } = await query(sql, values);
    return rows[0];
  },

  // Delete a lesson by ID
  async delete(id) {
    const sql = "DELETE FROM lessons WHERE id = $1 RETURNING *";
    const { rows } = await query(sql, [id]);
    return rows[0]; // returns deleted lesson or undefined if not found
  },
};

export default LessonModel;
