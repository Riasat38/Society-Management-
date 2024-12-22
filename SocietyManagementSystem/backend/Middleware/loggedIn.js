// Middleware to check if the user is authenticated
`use strict`;
import passport from 'passport';

const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) { 
        return next();
    } else {
      
      res.redirect('/society/login');
    }
  };
  
  export default ensureAuthenticated;
  