const checkRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      console.log(req.user.role)
      console.log(roles)
      return res.status(403).json({ message: "Access Denied!" });
    }
    next();
  };
};
module.exports = checkRole;
