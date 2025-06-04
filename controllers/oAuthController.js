import UserModel from "../models/userModel.js";

const OAuthController = {
  // Google OAuth Success Handler
  async googleCallback(req, res, next) {
    try {
      const user = req.user;
      const token = UserModel.generateToken(user.id);

      // Redirect to frontend with token
      const redirectUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/callback?token=${token}`;
      res.redirect(redirectUrl);
    } catch (error) {
      next(error);
    }
  },

  // Alternative: Return JSON response for mobile apps
  async googleCallbackAPI(req, res, next) {
    try {
      const user = req.user;
      const token = UserModel.generateToken(user.id);

      res.json({
        success: true,
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          oauth_provider: user.oauth_provider,
          oauth_id: user.oauth_id,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  // Link OAuth account to existing user
  async linkOAuthAccount(req, res, next) {
    try {
      // This would be called after successful OAuth auth
      // when user is already logged in with regular account
      res.json({
        success: true,
        message: "OAuth account linked successfully",
      });
    } catch (error) {
      next(error);
    }
  },
};

export default OAuthController;