import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import userModel from "../models/userModel.js";

dotenv.config();

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ["profile", "email"],
    },
    // accessToken and refreshToken are unused here, but required by Passport's signature
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Try to find an existing user by Google ID
        let user = await userModel.findByOAuth("google", profile.id);

        if (user) {
          return done(null, user);
        }

        // Optional: check by email to link local account automatically
        const email = profile.emails?.[0]?.value;
        user = await userModel.findByEmail(email);

        if (user) {
          // Link Google account to existing user
          user.googleId = profile.id;
          user.avatar = profile.photos?.[0]?.value || user.avatar;
          user.provider = "google";
          await user.save();

          return done(null, user);
        }

        // Create new user
        const newUser = await userModel.createGoogleUser({
          googleId: profile.id,
          email,
          name: profile.displayName,
          avatar: profile.photos?.[0]?.value,
        });

        return done(null, newUser);
      } catch (error) {
        console.error("Google Strategy Error:", error);
        return done(error, null);
      }
    }
  )
);

// Saves user.id in the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Fetch the user from DB using the ID in the session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await userModel.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
