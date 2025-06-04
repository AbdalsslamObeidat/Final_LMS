import { query } from '../config/db.js';

const CategoryModel = {
  // Create a new category
  async create({ name }) {
    try {
      const { rows } = await query(
        `INSERT INTO categories (name, created_at)
         VALUES ($1, CURRENT_TIMESTAMP)
         RETURNING *`,
        [name]
      );
      return rows[0];
    } catch (error) {
      throw new Error('Error creating category');
    }
  },

  // Get all categories
  async findAll() {
    const { rows } = await query(`SELECT id, name, created_at FROM categories ORDER BY id`);
    return rows;
  },

  // Get one category by ID
  async findById(id) {
    const { rows } = await query(`SELECT id, name, created_at FROM categories WHERE id = $1`, [id]);
    return rows[0];
  },

  // Update a category
  async update(id, { name }) {
    try {
      const { rows } = await query(
        `UPDATE categories
         SET name = $1
         WHERE id = $2
         RETURNING id, name, created_at`,
        [name, id]
      );
      return rows[0];
    } catch (error) {
      throw new Error('Error updating category');
    }
  },

  // Delete a category
  async delete(id) {
    try {
      await query(`DELETE FROM categories WHERE id = $1`, [id]);
      return { message: 'Category deleted successfully' };
    } catch (error) {
      throw new Error('Error deleting category');
    }
  }
};

export default CategoryModel;
