const express = require('express');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'test-secret-key-for-qa-interview';

// Middleware to parse JSON
app.use(express.json());

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public')));

// Test users database (in-memory for simplicity)
const users = [
  {
    id: 1,
    email: 'user@example.com',
    password: 'Password123!',
    name: 'Test User'
  },
  {
    id: 2,
    email: 'admin@example.com',
    password: 'Admin@456',
    name: 'Admin User'
  },
  {
    id: 3,
    email: 'UPPERCASE@EXAMPLE.COM',
    password: 'CaseSensitive1!',
    name: 'Case Test User'
  }
];

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  // Check for missing fields
  if (email === undefined && password === undefined) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Email and password are required'
    });
  }

  if (email === undefined) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Email is required'
    });
  }

  if (password === undefined) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Password is required'
    });
  }

  // Check for empty strings
  if (typeof email !== 'string' || email.trim() === '') {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Email cannot be empty'
    });
  }

  if (typeof password !== 'string' || password === '') {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Password cannot be empty'
    });
  }

  // Validate email format
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Invalid email format'
    });
  }

  // Find user by email (case-sensitive)
  const user = users.find(u => u.email === email);

  // Check if user exists and password matches
  if (!user || user.password !== password) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid credentials'
    });
  }

  // Generate JWT token
  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
      name: user.name
    },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  // Success response
  return res.status(200).json({
    token: token
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.path}`
  });
});

// Error handler for malformed JSON
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Invalid JSON format'
    });
  }
  next(err);
});

// Start server
app.listen(PORT, () => {
  console.log(`Login API server running on http://localhost:${PORT}`);
  console.log('\nTest credentials:');
  console.log('  Email: user@example.com');
  console.log('  Password: Password123!');
  console.log('\nEndpoints:');
  console.log('  GET  /          - Login UI');
  console.log('  POST /api/login - Login API');
  console.log('  GET  /health    - Health check');
});

module.exports = app;
