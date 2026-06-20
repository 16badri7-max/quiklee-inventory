const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Allow bypassing auth for development if requested, or look at Authorization header
  if (process.env.NODE_ENV === 'development-bypass-auth') {
    req.user = { id: 1, username: 'admin' };
    return next();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Missing Authorization header' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'supersecretkey');
    req.user = payload;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;
