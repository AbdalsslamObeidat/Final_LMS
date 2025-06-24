import { pool } from "../config/db.js";

export const createAttachment = async (attachmentDTO) => {
  try {
    const { original_name, mime_type, size, public_id, secure_url, format, lesson_id } = attachmentDTO;

  const query = `
    INSERT INTO attachments (original_name, mime_type, size, public_id, secure_url, format, lesson_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
  `;

  const result = await pool.query(query, [
    original_name,
    mime_type,
    size,
    public_id,
    secure_url,
    format,
    lesson_id,
  ]);

    return result.rows[0];
  } catch (error) {
    console.error("Error creating attachment:", error);
    throw error;
  }
};

export const getAttachmentById = async (id) => {
  try {
    const query = `
      SELECT * FROM attachments
      WHERE id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  } catch (error) {
    console.error("Error fetching attachment by id:", error);
    throw error;
  }
};

export const deleteAttachment = async (id) => {
  try {
    const query = `
      DELETE FROM attachments
      WHERE id = $1
      RETURNING *
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  } catch (error) {
    console.error("Error deleting attachment:", error);
    throw error;
  }
};