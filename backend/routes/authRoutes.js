const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  // Accept any login for demo, but hardcode credentials or mock them
  if (username === 'badri' && password === '123456') {
    const token = jwt.sign(
      { id: 1, username: 'badri', role: 'admin' },
      process.env.JWT_SECRET || 'supersecretkey',
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );
    return res.json({ token, user: { id: 1, username: 'badri' } });
  }

  return res.status(401).json({ message: 'Invalid username or password ()' });
});

module.exports = router;
