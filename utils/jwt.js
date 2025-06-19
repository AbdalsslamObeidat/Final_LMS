import jwt from "jsonwebtoken";
import dotenv from "dotenv";
// Loading .env values
dotenv.config();

// Generate s signed JWT token using a secret key
export const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN, // Token lifetime
    issuer: "oauth-app", // Issuing app
    audience: "oauth-app-users",
  });
};

// Decode and verify JWT token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new Error("Token expired"); // If token expired
    } else if (error.name === "JsonWebTokenError") {
      throw new Error("Invalid token"); // If token is invalid or malformed
    }
    throw error;
  }
};

// Generate refresh token (longer-lived token)
// Refresh token is used to issue new access tokens
export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "30d",
    issuer: "oauth-app",
    audience: "oauth-app-users",
  });
};
