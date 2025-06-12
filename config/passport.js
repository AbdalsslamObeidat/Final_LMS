import passport from 'passport';
import configureGoogleStrategy from './googleStrategy.js';
import configureJwtStrategy from './jwtStrategy.js';

configureGoogleStrategy(passport);
configureJwtStrategy(passport);

export default passport;
