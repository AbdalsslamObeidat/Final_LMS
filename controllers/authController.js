import UserModel from "../models/userModel.js";

import {
  registerSchema,
  loginSchema,
  changePasswordSchema,
} from "../utils/validation.js";


const AuthController = {
  async register(req, res, next) {
    try {
      const { error, value } = registerSchema.validate(req.body);
      if (error) throw new Error(error.details[0].message);

      const { email, password, name } = value;

      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) throw new Error("Email already in use");

      const user = await UserModel.create({ email, password, name });
      const token = UserModel.generateToken(user);
      
      res.status(201).json({
        success: true,
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.created_at,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async login(req, res, next) {
    try {
      const { error, value } = loginSchema.validate(req.body);
      if (error) throw new Error(error.details[0].message);

      const { email, password } = value;

      const user = await UserModel.findByEmail(email);
      if (!user) throw new Error("Invalid credentials");

      const isMatch = await UserModel.verifyPassword(password, user.password_hash);
      if (!isMatch) throw new Error("Invalid credentials");

      const token = UserModel.generateToken(user);

      res.json({
        success: true,
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          oauth_provider: user.oauth_provider,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async getMe(req, res, next) {
    try {
      const user = await UserModel.findById(req.user.id);
      if (!user) throw new Error("User not found");

      res.json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          oauth_provider: user.oauth_provider,
          oauth_id: user.oauth_id,
          role: user.role,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async changePassword(req, res, next) {
    try {
      // Check if user has a password (not OAuth-only account)
      const user = await UserModel.findById(req.user.id);
      if (!user.password_hash && user.oauth_provider) {
        throw new Error("Cannot change password for OAuth account. Please set a password first.");
      }

      const { error, value } = changePasswordSchema.validate(req.body);
      if (error) throw new Error(error.details[0].message);

      const { currentPassword, newPassword } = value;

      const isMatch = await UserModel.verifyPassword(
        currentPassword,
        user.password_hash
      );
      if (!isMatch) throw new Error("Current password is incorrect");

      await UserModel.updatePassword(req.user.id, newPassword);

      res.json({
        success: true,
        message: "Password updated successfully",
      });
    } catch (error) {
      next(error);
    }
  },

  // Set password for OAuth-only users
  async setPassword(req, res, next) {
    try {
      const { password_hash } = req.body;
      
      if (!password_hash || password_hash.length < 8) {
        throw new Error("Password_hash must be at least 8 characters long");
      }

      const user = await UserModel.findById(req.user.id);
      if (user.password_hash) {
        throw new Error("User already has a password. Use change password instead.");
      }

      await UserModel.setPassword(req.user.id, password_hash);

      res.json({
        success: true,
        message: "Password set successfully",
      });
    } catch (error) {
      next(error);
    }
  },

 
};

export default AuthController;