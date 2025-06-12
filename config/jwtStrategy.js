import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import UserModel from '../models/userModel.js';

const configureJwtStrategy = (passport) => {
  passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
  }, async (payload, done) => {
    try {
      const user = await UserModel.findById(payload.id);
      return user ? done(null, user) : done(null, false);
    } catch (error) {
      return done(error, false);
    }
  }));
};

export default configureJwtStrategy;
