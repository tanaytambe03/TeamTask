const adminMiddleware = (req, res, next) => {

  if (req.user.role !== "admin") {
    return res.send("Admin Access Required");
  }

  next();
};

module.exports = adminMiddleware;