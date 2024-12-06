`use strict`;
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

const GOOGLE_CLIENT_ID = "755425922445-mjjsii3crk1gpj0up53jtqv35bmsv1se.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";

passport.use(
    new GoogleStrategy(
      { 
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:4069/society/oauth2/redirect/google',
      },
      (accessToken, refreshToken, profile, done) => {
        
        const name = profile.displayName ;
        const email = profile.emails[0].value;
        console.log(name,email,"auth");
        return done(null, {name,email});
      }
    )
  );
  
  // Serialize and deserialize user (needed for sessions)
  passport.serializeUser((user, done) => {
    done(null, user);
  });
  
  passport.deserializeUser((user, done) => {
    done(null, user);
  });

export default passport;