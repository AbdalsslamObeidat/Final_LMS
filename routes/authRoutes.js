import { Router } from "express";
import jwt from 'jsonwebtoken';
const { JsonWebTokenError } = jwt;
import UserModel from "../models/userModel.js";
import passport from "../config/passport.js";
import AuthController from "../controllers/authController.js";
import { OAuthController } from "../controllers/oAuthController.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

// Regular auth routes
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.get("/me", authenticate, AuthController.getMe);
router.put("/change-password", authenticate, AuthController.changePassword);
router.post("/set-password", authenticate, AuthController.setPassword);

// Google OAuth routes
console.log(">> FRONTEND_URL:", process.env.FRONTEND_URL);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);


// router.get(
//   "/google/callback",
//   passport.authenticate("google", {
//      failureRedirect: "/login",
//       session: false }),
//   (req, res) => {
// res.json({ success: true, token });
//   }
// );
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  async (req, res) => {
    try {
      const user = req.user;

      const token = UserModel.generateToken(user.id);

      res.json({
        success: true,
        message: 'Logged in with Google successfully',
        token,
        user,
      });
    } catch (error) {
      console.error('Google callback error:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }
);

// Link Google account (for existing users)
router.post(
  "/link-google",
  authenticate,
  passport.authenticate("google", { scope: ["profile", "email"] })
);

export default router;
