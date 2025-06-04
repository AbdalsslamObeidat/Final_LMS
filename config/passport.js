import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import UserModel from '../models/userModel.js';

// Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
  scope: ['profile', 'email']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user already exists with this Google ID
    let user = await UserModel.findByOAuth('google', profile.id);
    
    if (user) {
      return done(null, user);
    }
    
    // Check if user exists with the same email
    const existingUser = await UserModel.findByEmail(profile.emails[0].value);
    
    if (existingUser) {
      // Link Google account to existing user
      await UserModel.linkGoogleAccount(existingUser.id, profile.id);
      const updatedUser = await UserModel.findById(existingUser.id);
      return done(null, updatedUser);
    }
    
    // Create new user
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

// JWT Strategy (for protecting routes)
passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}, async (payload, done) => {
  try {
    const user = await UserModel.findById(payload.id);
    if (user) {
      return done(null, user);
    }
    return done(null, false);
  } catch (error) {
    return done(error, false);
  }
}));

export default passport;