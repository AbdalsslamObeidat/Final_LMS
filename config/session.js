import dotenv from "dotenv";

dotenv.config();
if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET is not defined in .env");
}

const sessionConfig = {
  secret: process.env.SESSION_SECRET,
  resave: false, // preventing unchanged session resave to reduce overhead
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production", // HTTPS only in production
    httpOnly: true, // Prevent XSS attacks
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: "lax", // CSRF protection
  },
  name: "sessionId", // Change default session name
  rolling: true, // Reset expiration on activity
};

export default sessionConfig;
