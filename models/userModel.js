import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../config/db.js';

const UserModel = {
  async create({ email, password, name }) {
    try {
      const hashedPassword = await bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUNDS));
      
      const { rows } = await query(
        `INSERT INTO users (email, password_hash, name, is_active)
         VALUES ($1, $2, $3, $4)
         RETURNING id, email, name, created_at`,
        [email, hashedPassword, name, true]
      );
      
      return rows[0];
    } catch (error) {
      if (error.code === '23505') {
        throw new Error('Email already exists');
      }
      throw error;
    }
  },

  async createGoogleUser({ googleId, email, name, avatar }) {
    try {
      const { rows } = await query(
        `INSERT INTO users (oauth_provider, oauth_id, email, name, avatar, is_active)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id, email, name, oauth_provider, oauth_id, avatar, created_at`,
        ['google', googleId, email, name, avatar, true]
      );
      
      return rows[0];
    } catch (error) {
      if (error.code === '23505') {
        throw new Error('User already exists');
      }
      throw error;
    }
  },

  async findByEmail(email) {
    const { rows } = await query(
      'SELECT id, email, password_hash, name, oauth_provider, oauth_id, role, avatar, is_active FROM users WHERE email = $1 AND is_active = true',
      [email]
    );
    return rows[0];
  },

async findById(id) {
  const { rows } = await query(
    `SELECT id, email, name, oauth_provider, oauth_id, role, avatar, password_hash, is_active 
     FROM users WHERE id = $1 AND is_active = true`,
    [id]
  );
  return rows[0];
},


  async findByOAuth(provider, oauthId) {
  const { rows } = await query(
    'SELECT id, email, name, oauth_provider, oauth_id, role, avatar, is_active FROM users WHERE oauth_provider = $1 AND oauth_id = $2 AND is_active = true',
    [provider, oauthId]
  );
  return rows[0];
},


  async linkOAuthAccount(userId, provider, oauthId) {
    await query(
      'UPDATE users SET oauth_provider = $1, oauth_id = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3',
      [provider, oauthId, userId]
    );
  },

  // generateToken(userId) {
  //   return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
  //     expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  //   });
  // }
  generateToken(user) {
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role || 'student', // default to 'student' if undefined
    avatar: user.avatar || null,
    provider: user.oauth_provider || 'local'
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });
},


  async verifyPassword(candidatePassword, hashedPassword) {
    if (!hashedPassword) return false; // For Google OAuth users without password
    return await bcrypt.compare(candidatePassword, hashedPassword);
  },

  async updatePassword(userId, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, parseInt(process.env.BCRYPT_SALT_ROUNDS));
    await query(
      'UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [hashedPassword, userId]
    );
  },

  // Set password for OAuth-only users
  async setPassword(userId, password) {
    const hashedPassword = await bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUNDS));
    await query(
      'UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [hashedPassword, userId]
    );
  },


  // Deactivate user (soft delete)
  async deactivateUser(userId) {
    await query(
      'UPDATE users SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1',
      [userId]
    );
  }
};

export default UserModel;