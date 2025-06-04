import { query } from '../config/db.js';

const ModuleModel = {
  async findAllByCourse(course_id) {
    const sql = `
      SELECT id, course_id, title, description, "order", created_at, updated_at
      FROM public.modules
      WHERE course_id = $1
      ORDER BY "order" ASC
    `;
    const { rows } = await query(sql, [course_id]);
    return rows;
  },

  async findById(id) {
    const { rows } = await query(
      `SELECT id, course_id, title, description, "order", created_at, updated_at FROM public.modules WHERE id = $1`,
      [id]
    );
    return rows[0];
  },

  async create({ course_id, title, description, order }) {
    const sql = `
      INSERT INTO public.modules (course_id, title, description, "order")
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const { rows } = await query(sql, [course_id, title, description, order]);
    return rows[0];
  },

  async update(id, { title, description, order }) {
    const sql = `
      UPDATE public.modules
      SET title = $1,
          description = $2,
          "order" = $3,
          updated_at = NOW()
      WHERE id = $4
      RETURNING *
    `;
    const { rows } = await query(sql, [title, description, order, id]);
    return rows[0];
  },

  async delete(id) {
    const sql = `DELETE FROM public.modules WHERE id = $1 RETURNING *`;
    const { rows } = await query(sql, [id]);
    return rows[0];
  },
};

export default ModuleModel;
