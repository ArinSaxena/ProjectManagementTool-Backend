const checkRole = (...roles) => {
  
  return (req, res, next) => {
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    console.log(fullUrl);
    console.log(roles , req.user.role)
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access Denied!" });
    }
    next();
  };
};
module.exports = checkRole;
