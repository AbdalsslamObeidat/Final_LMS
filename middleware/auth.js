import jwt from "jsonwebtoken";
import UserModel from "../models/userModel.js";

export const authenticate = async (req, res, next) => {
  try {
    let token;
    // Check Authorization header
    const authHeader = req.headers["authorization"];
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
    // Fallback: check cookies for accessToken
    if (!token && req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }
    if (!token) {
      // Token existing check
      const error = new Error("Authentication token missing");
      error.statusCode = 401;
      throw error;
    }
    if (!process.env.JWT_SECRET) {
      // JWT secret check
      throw new Error("Missing JWT_SECRET in environment variables");
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verifies token signature, decoding payload, typicaly contains id or email
    const user = await UserModel.findById(decoded.id); // Looking for the user in the DB using the decoded id
    if (!user) {
      // User existance in DB check
      const error = new Error("User not found");
      error.statusCode = 401;
      throw error;
    }
    if (!user.is_active) {
      // User active check
      const error = new Error("User account is inactive");
      error.statusCode = 403;
      throw error;
    }
    req.user = user; // Authenticated user attatched to the req
    next();
  } catch (error) {
    error.statusCode = error.statusCode || 401;
    next(error);
  }
};
// Role based access
export const authorize = (roles = []) => {
  return (req, res, next) => {
    if (roles.length && (!req.user || !roles.includes(req.user.role))) {
      const error = new Error("Unauthorized access");
      console.warn(`Unauthorized access by user ID: ${req.user?.id}`);
      error.statusCode = 403;
      return next(error);
    }

    next();
  };
};
