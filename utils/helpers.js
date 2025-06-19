import crypto from "crypto";
// Sanitize user data for client response, removing sensitive data (pass,token)
export const sanitizeUser = (user) => {
  if (!user) return null;
  const { id, email, name, avatar, provider, is_verified, created_at } = user;
  return { id, email, name, avatar, provider, is_verified, created_at };
};

// uses random bytes -> more secure
export const generateRandomString = (length = 32) => {
  return crypto.randomBytes(length).toString("hex").slice(0, length);
};

// Validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Create API response format
export const createResponse = (success, message, data = null, error = null) => {
  return {
    success,
    message,
    data,
    error,
    timestamp: new Date().toISOString(),
  };
};
