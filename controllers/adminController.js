import UserModel from '../models/userModel.js';
import { query } from '../config/db.js'; 


const AdminController = {
  // 1. Get users with pagination + search
  async getUsers(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search || '';

      const offset = (page - 1) * limit;

      const { users, total } = await UserModel.getAll({ limit, offset, search });

      res.json({
        success: true,
        data: users,
        page,
        totalPages: Math.ceil(total / limit),
        totalUsers: total,
      });
    } catch (error) {
      next(error);
    }
  },

  // 2. Create user
  async createUser(req, res, next) {
    try {
      const { name, email, password, role } = req.body;

      if (!name || !email || !password || !role) {
        return res.status(400).json({ success: false, message: 'All fields required' });
      }

      // if (!['admin', 'instructor', 'student'].includes(role)) {
      //   return res.status(400).json({ success: false, message: 'Invalid role' });
      // }

      const user = await UserModel.createByAdmin({ name, email, password, role });

      res.status(201).json({ success: true, user });
    } catch (error) {
      next(error);
    }
  },

  // 3. Update role
  async updateUserRole(req, res, next) {
    try {
      const userId = req.params.id;
      const { role } = req.body;

      const updatedUser = await UserModel.updateRole(userId, role);

      res.json({ success: true, user: updatedUser });
    } catch (error) {
      next(error);
    }
  },

  // 4. Delete (soft)
  async deleteUser(req, res, next) {
    try {
      const userId = req.params.id;

      await UserModel.deactivateUser(userId);

      res.json({ success: true, message: 'User deactivated' });
    } catch (error) {
      next(error);
    }
  },


  async getDashboardSummary(req, res) {
  try {
    // Total courses count
    const totalCourses = parseInt((await query('SELECT COUNT(*) FROM courses')).rows[0].count, 10);

    // Pending courses count (not approved)
    const pendingCourses = parseInt((await query('SELECT COUNT(*) FROM courses WHERE is_approved = false')).rows[0].count, 10);
    
    // Published courses count
   const publishedCourses = parseInt((await query('SELECT COUNT(*) FROM courses WHERE is_published = true')).rows[0].count, 10);

    // Total users count
   const totalUsers = parseInt((await query('SELECT COUNT(*) FROM users')).rows[0].count, 10);

    // Total enrollments count
    const totalEnrollments = parseInt((await query('SELECT COUNT(*) FROM enrollments')).rows[0].count, 10);

    res.json({
      totalCourses,
      pendingCourses,
      publishedCourses,
      totalUsers,
      totalEnrollments,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

};

export default AdminController;
