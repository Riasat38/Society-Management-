`use strict`
const addUserIdToUrl = (req, res, next) => {
    const userId = req.user ? req.user._id : null; 
    if (userId) {
        req.userId = userId;
        next();
    } else {
        res.redirect('/society/login');
    }
};

export default addUserIdToUrl;
