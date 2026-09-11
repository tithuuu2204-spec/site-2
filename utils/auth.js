import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'explorehub_dev_secret_2024_sih';

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // For demo purposes, we will allow unauthenticated requests to pass through
    // but not attach a user object. In real app, we'd return 401.
    return next();
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
  } catch (err) {
    console.warn("Invalid JWT token");
  }
  next();
};

export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};
