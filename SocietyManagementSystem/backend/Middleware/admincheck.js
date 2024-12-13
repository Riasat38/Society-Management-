`use strict`

import User from "../Model/userModel.js";

const ensureAdmin = async (req,res,next) => {
    const url = req.originalUrl;
    const id = url.params.id
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
    
        if (!user || !user.admin) {
          return res.status(403).send('User is not admin');
        }

        req.user = user;
        next();
      } catch (error) {
        res.status(500).send('Internal Server Error');
      }
};


  
export default ensureAdmin;
  