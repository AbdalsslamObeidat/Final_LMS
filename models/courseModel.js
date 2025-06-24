import { query } from "../config/db.js";

const CourseModel = {
  // Create a new course
  async create({
    title,
    description,
    instructor_id,
    category_id,
    thumbnail_url,
  }) {
    try {
      const { rows } = await query(
        `INSERT INTO courses 
          (title, description, instructor_id, category_id, thumbnail_url, is_published, is_approved, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, false, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
         RETURNING *`,
        [title, description, instructor_id, category_id, thumbnail_url]
      );
      return rows[0];
    } catch (error) {
      throw new Error("Failed to create course");
    }
  },

  // Read course by ID
  async findById(courseId) {
    const { rows } = await query("SELECT * FROM courses WHERE id = $1", [
      courseId,
    ]);
    return rows[0];
  },

  // Read all courses
  async findAll() {
    const { rows } = await query("SELECT * FROM courses");
    return rows;
  },

  // Update course
  async update(courseId, { title, description, thumbnail_url, category_id }) {
    try {
      // Build dynamic query for partial update
      const fields = [];
      const values = [];
      let idx = 1;
      if (title !== undefined) { fields.push(`title = $${idx++}`); values.push(title); }
      if (description !== undefined) { fields.push(`description = $${idx++}`); values.push(description); }
      if (thumbnail_url !== undefined) { fields.push(`thumbnail_url = $${idx++}`); values.push(thumbnail_url); }
      if (category_id !== undefined) { fields.push(`category_id = $${idx++}`); values.push(category_id); }
      fields.push(`updated_at = CURRENT_TIMESTAMP`);
      if (fields.length === 1) throw new Error('No fields to update');
      values.push(courseId);
      const { rows } = await query(
        `UPDATE courses 
         SET ${fields.join(', ')}
         WHERE id = $${values.length}
         RETURNING *`,
        values
      );
      return rows[0];
    } catch (error) {
      throw new Error("Failed to update course");
    }
  },

  // Delete course
  async delete(courseId) {
    try {
      const { rows } = await query(
        "DELETE FROM courses WHERE id = $1 RETURNING *",
        [courseId]
      );
      return rows[0];
    } catch (error) {
      throw new Error("Failed to delete course");
    }
  },
  async findAllByIds(ids) {
    if (!ids || ids.length === 0) return [];
    // Build a parameterized query for the array of IDs
    const placeholders = ids.map((_, i) => `$${i + 1}`).join(", ");
    const { rows } = await query(
      `SELECT * FROM courses WHERE id IN (${placeholders})`,
      ids
    );
    return rows;
  },

  async updateApprovalStatus(courseId, isApproved) {
    try {
      const { rows } = await query(
        `UPDATE courses
       SET is_approved = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
        [isApproved, courseId]
      );
      return rows[0];
    } catch (error) {
      throw new Error("Failed to update course approval status");
    }
  },
  async findPending() {
    const { rows } = await query(
      "SELECT * FROM courses WHERE is_approved = false"
    );
    return rows;
  },

  async updatePublishStatus(courseId, isPublished) {
    try {
      const { rows } = await query(
        `UPDATE courses
       SET is_published = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
        [isPublished, courseId]
      );
      return rows[0];
    } catch (error) {
      throw new Error("Failed to update course publish status");
    }
  },
};

export default CourseModel;
