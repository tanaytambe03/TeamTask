const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {

  try {

    const token = req.headers.authorization;

    if (!token) {
      return res.send("Access Denied");
    }

    const verified = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = verified;

    next();

  } catch (error) {

    res.send("Invalid Token");
  }
};

module.exports = authMiddleware;