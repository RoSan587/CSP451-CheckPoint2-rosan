// routes/auth.js - simple authentication routes
const express = require('express');
const router = express.Router();

// NOTE: This is a simulation for the assignment.
// In production you'd use hashed passwords, sessions/JWT, and a DB

const demoUsers = [
  { id: '1', username: 'alice', password: 'password123' },
  { id: '2', username: 'bob', password: 'hunter2' }
];

/**
 * POST /auth/login
 * Body: { username, password }
 * Response: 200 { message } or 401 { error }
 */
router.post('/login', (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: 'username and password required' });
  }
  const user = demoUsers.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ error: 'invalid username or password' });
  }
  // In real app: return a JWT or session cookie
  res.json({ message: `welcome ${user.username}`, userId: user.id });
});

/**
 * GET /auth/me
 * Simple endpoint to show an authenticated user (demo)
 */
router.get('/me', (req, res) => {
  // demo mode: return static user
  res.json({ user: { id: '1', username: 'alice' } });
});

module.exports = router;
