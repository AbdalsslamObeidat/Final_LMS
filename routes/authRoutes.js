import { Router } from 'express';
import passport from '../config/passport.js';
import AuthController from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Regular auth routes
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.get('/me', authenticate, AuthController.getMe);
router.put('/change-password', authenticate, AuthController.changePassword);
router.post('/set-password', authenticate, AuthController.setPassword);
router.put('/profile', authenticate, AuthController.updateProfile);

// Google OAuth routes
router.get('/google', 
  passport.authenticate('google', { 
    scope: ['profile', 'email'] 
  })
);

// Google OAuth callback - redirects to frontend
router.get('/google/callback',
  passport.authenticate('google', { 
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=oauth_failed`
  }),
  AuthController.googleCallback
);

// Alternative callback for API responses (useful for mobile apps)
router.get('/google/callback/api',
  passport.authenticate('google', { session: false }),
  AuthController.googleCallbackAPI
);

// Link Google account (for existing users)
router.post('/link-google', 
  authenticate,
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

export default router;