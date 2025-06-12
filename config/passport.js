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
      passReqToCallback: true,
    },

    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const stateUserId = req.query.state;

        // 👉 If stateUserId is present, it's a link request
        if (stateUserId) {
          const existingUser = await userModel.findById(stateUserId);
          if (!existingUser) {
            return done(new Error("User not found for linking"), null);
          }

          // Link Google account to existing user
          existingUser.googleId = profile.id;
          existingUser.avatar = profile.photos?.[0]?.value || existingUser.avatar;
          existingUser.provider = "google";
          await existingUser.save();

          return done(null, existingUser);
        }

        // Normal login flow
        let user = await userModel.findByOAuth("google", profile.id);
        if (user) {
          return done(null, user);
        }

        // Create new user
        const newUser = await userModel.createGoogleUser({
          googleId: profile.id,
          email: profile.emails?.[0]?.value,
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


// Serialize user for session storage
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await userModel.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
