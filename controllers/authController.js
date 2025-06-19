import UserModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs';

import {
  registerSchema,
  loginSchema,
  changePasswordSchema,
} from "../utils/validation.js";

import { generateToken, generateRefreshToken } from "../utils/jwt.js";

const AuthController = {
  async register(req, res, next) {
    try {
      const { error, value } = registerSchema.validate(req.body);
      if (error) throw new Error(error.details[0].message);

      const { email, password, name } = value;

      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) throw new Error("Email already in use");

      const user = await UserModel.create({ email, password, name });

      // Set HTTP-only cookies for access & refresh tokens
      const accessToken = generateToken({ id: user.id, email: user.email });
      const refreshToken = generateRefreshToken({
        id: user.id,
        email: user.email,
      });

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });

      res.status(201).json({
        success: true,
        accessToken,
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

      const isMatch = await UserModel.verifyPassword(
        password,
        user.password_hash
      );
      if (!isMatch) throw new Error("Invalid credentials");


      // Set HTTP-only cookies for access & refresh tokens
      const accessToken = generateToken({ id: user.id, email: user.email });
      const refreshToken = generateRefreshToken({
        id: user.id,
        email: user.email,
      });

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      res.json({
        success: true,
        accessToken,
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
        throw new Error(
          "Cannot change password for OAuth account. Please set a password first."
        );
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
      const { password } = req.body;

      if (!password || password.length < 8) {
        throw new Error("Password must be at least 8 characters long");
      }

      const user = await UserModel.findById(req.user.id);
      if (user.password_hash) {
        throw new Error(
          "User already has a password. Use change password instead."
        );
      }
      const password_hash=await bcrypt.hash(password,10);
      await UserModel.setPassword(req.user.id, password_hash);

      res.json({
        success: true,
        message: "Password set successfully",
      });
    } catch (error) {
      next(error);
    }
  },

  logout(req, res) {
    try {
      res.clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });

      res.clearCookie("sessionId");

      res.json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Logout failed",
        error: error.message,
      });
    }
  },

  // New refreshToken method
  refreshToken(req, res) {
    try {
      const token = req.cookies.refreshToken;
      if (!token) {
        return res.status(401).json({
          success: false,
          message: "No refresh token provided",
        });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const newAccessToken = generateToken({
        id: decoded.id,
        email: decoded.email,
      });

      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({
        success: true,
        message: "Token refreshed successfully",
        accessToken: newAccessToken,
      });
    } catch (error) {
      res.status(403).json({
        success: false,
        message: "Invalid refresh token",
        error: error.message,
      });
    }
  },
};

export default AuthController;
