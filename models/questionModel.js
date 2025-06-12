import { query } from '../config/db.js';

const questionModel = {
  async create({ question_text, options, correct_answer, quizz_id }) {
const result = await query(
  `INSERT INTO questions (question_text, options, correct_answer, quizz_id)
   VALUES ($1, $2, $3, $4) RETURNING *`,
  [question_text, JSON.stringify(options), correct_answer, quizz_id]
);


    return result.rows[0];
  },

  async getAll() {
    const result = await query(`SELECT * FROM questions`);
    return result.rows;
  },

  async getById(id) {
    const result = await query(`SELECT * FROM questions WHERE id = $1`, [id]);
    return result.rows[0];
  },

 async update(id, { question_text, options, correct_answer, quizz_id }) {
  const result = await query(
    `UPDATE questions
     SET question_text = $1, options = $2, correct_answer = $3, quizz_id = $4
     WHERE id = $5 RETURNING *`,
    [question_text, JSON.stringify(options), correct_answer, quizz_id, id]
  );
  return result.rows[0];
},



  async delete(id) {
    const result = await query(`DELETE FROM questions WHERE id = $1 RETURNING *`, [id]);
    return result.rows[0];
  }
};

export default questionModel;
