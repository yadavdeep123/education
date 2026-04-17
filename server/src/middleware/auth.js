const jwt = require("jsonwebtoken");

const auth = (roles = []) => {
  const roleList = Array.isArray(roles) ? roles : [roles];

  return (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      if (roleList.length > 0 && !roleList.includes(decoded.role)) {
        return res.status(403).json({ message: "Access denied" });
      }

      return next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }
  };
};

module.exports = auth;
