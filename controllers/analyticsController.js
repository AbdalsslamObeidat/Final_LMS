import { pool } from '../config/db.js';

export const getStudentPerformanceAnalytics = async (req, res) => {
  try {
    const userRole = req.user.role;
    const userId = req.user.id;

    const isInstructor = userRole === 'instructor';

    const values = [];
    let whereClause = `WHERE u.role = 'student'`;

    if (isInstructor) {
      whereClause += ` AND c.instructor_id = $1`;
      values.push(userId);
    }

    const query = `
      SELECT 
        u.id AS student_id,
        u.name,
        COUNT(DISTINCT e.id) AS total_courses,
        COUNT(DISTINCT e.id) FILTER (WHERE e.progress = 100) AS completed_courses,
        ROUND(
          100.0 * COUNT(DISTINCT e.id) FILTER (WHERE e.progress = 100) / NULLIF(COUNT(DISTINCT e.id), 0), 2
        ) AS course_completion_rate,
        ROUND(AVG(s.grade), 2) AS avg_assignment_grade
      FROM users u
      LEFT JOIN enrollments e ON u.id = e.user_id
      LEFT JOIN courses c ON e.course_id = c.id
      LEFT JOIN submissions s ON s.user_id = u.id
      ${whereClause}
      GROUP BY u.id, u.name
      ORDER BY course_completion_rate DESC NULLS LAST, avg_assignment_grade DESC NULLS LAST
      LIMIT 50;
    `;

    const result = await pool.query(query, values);

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error fetching student performance:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch student performance analytics',
    });
  }
};