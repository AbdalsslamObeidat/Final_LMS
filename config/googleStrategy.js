import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import UserModel from '../models/userModel.js';

const configureGoogleStrategy = (passport) => {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    scope: ['profile', 'email']
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await UserModel.findByOAuth('google', profile.id);

      if (user) return done(null, user);

      const existingUser = await UserModel.findByEmail(profile.emails[0].value);

      if (existingUser) {
        await UserModel.linkGoogleAccount(existingUser.id, profile.id);
        const updatedUser = await UserModel.findById(existingUser.id);
        return done(null, updatedUser);
      }

      const newUser = await UserModel.createGoogleUser({
        googleId: profile.id,
        email: profile.emails[0].value,
        name: profile.displayName,
        avatar: profile.photos[0]?.value
      });

      return done(null, newUser);
    } catch (error) {
      return done(error, null);
    }
  }));
};

export default configureGoogleStrategy;
