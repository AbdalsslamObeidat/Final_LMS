import passport from "../config/passport.js";
import { generateToken, generateRefreshToken } from "../utils/jwt.js";
import { sanitizeUser, createResponse } from "../utils/helpers.js";
import jwt from "jsonwebtoken";

// Start Google OAuth flow
export const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});

// Handle Google OAuth callback
export const googleCallback = (req, res, next) => {
  passport.authenticate(
    "google",
    { failureRedirect: "/login" },
    async (err, user) => {
      if (err) {
        console.error("Google OAuth error:", err);
        return res.redirect(
          `${process.env.FRONTEND_URL}/login?error=oauth_error`
        );
      }

      if (!user) {
        return res.redirect(
          `${process.env.FRONTEND_URL}/login?error=oauth_failed`
        );
      }

      try {
        // Log user in with session
        req.logIn(user, (err) => {
          if (err) {
            console.error("Login error:", err);
            return res.redirect(
              `${process.env.FRONTEND_URL}/login?error=login_failed`
            );
          }

          // Generate JWT tokens
          const tokenPayload = {
            id: user.id,
            email: user.email,
            role: user.role,
          };
          const accessToken = generateToken(tokenPayload);
          const refreshToken = generateRefreshToken(tokenPayload);

          // Set HTTP-only cookies for security
          const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
          };

          res.cookie("accessToken", accessToken, {
            ...cookieOptions,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
          });

          res.cookie("refreshToken", refreshToken, {
            ...cookieOptions,
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
          });

          // Redirect to client with success
          return res.redirect(
            `${process.env.FRONTEND_URL}/oauth/callback?token=${accessToken}&role=${user.role}`
          );
        });
      } catch (error) {
        console.error("Callback processing error:", error);
        return res.redirect(
          `${process.env.FRONTEND_URL}/login?error=processing_error`
        );
      }
    }
  )(req, res, next);
};

// Get current user
export const getCurrentUser = (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json(
          createResponse(
            false,
            "Not authenticated",
            null,
            "User not found in session"
          )
        );
    }

    const sanitizedUser = sanitizeUser(req.user);
    return res.json(
      createResponse(true, "User retrieved successfully", sanitizedUser)
    );
  } catch (error) {
    console.error("Get current user error:", error);
    return res
      .status(500)
      .json(createResponse(false, "Server error", null, error.message));
  }
};

// Logout user
export const logout = (req, res) => {
  try {
    req.logout((err) => {
      if (err) {
        console.error("Logout error:", err);
        return res
          .status(500)
          .json(createResponse(false, "Logout failed", null, err.message));
      }

      // Clear session
      req.session.destroy((err) => {
        if (err) {
          console.error("Session destroy error:", err);
        }

        // Clear cookies
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        res.clearCookie("sessionId");

        return res.json(createResponse(true, "Logged out successfully"));
      });
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res
      .status(500)
      .json(createResponse(false, "Server error", null, error.message));
  }
};

// Refresh access token
export const refreshToken = (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res
        .status(401)
        .json(
          createResponse(
            false,
            "Refresh token required",
            null,
            "No refresh token provided"
          )
        );
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

    // Generate new access token
    const newAccessToken = generateToken({
      id: decoded.id,
      email: decoded.email,
    });

    // Set new access token cookie
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.json(
      createResponse(true, "Token refreshed successfully", {
        accessToken: newAccessToken,
      })
    );
  } catch (error) {
    console.error("Token refresh error:", error);
    return res
      .status(403)
      .json(
        createResponse(false, "Invalid refresh token", null, error.message)
      );
  }
};
export const OAuthController = {
  googleCallback,
  googleAuth,
  getCurrentUser,
  logout,
  refreshToken,
};
