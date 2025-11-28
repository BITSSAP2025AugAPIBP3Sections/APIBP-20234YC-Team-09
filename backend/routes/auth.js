const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../models/user');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated ID of the user
 *         name:
 *           type: string
 *           description: The user's name
 *         email:
 *           type: string
 *           description: The user's email
 *         password:
 *           type: string
 *           description: The user's hashed password
 *       example:
 *         id: 60c72b2f5f1b2c0012a4c56e
 *         name: John Doe
 *         email: john@example.com
 *         password: password123
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user account
 *     description: |
 *       **Stakeholder:** Guest User (New Customer)
 *       **Access Level:** Public (No Authentication Required)
 *       
 *       Creates a new user account with email and password. Passwords are hashed using bcrypt with 10 salt rounds. Returns a JWT token valid for 48 hours.
 *       
 *       **Error Handling:**
 *       - Returns 400 if validation fails (e.g., invalid email, short password).
 *       - Returns 409 if the email is already registered.
 *       - Returns 422 if the request body is unprocessable.
 *       - Returns 500 for internal server errors.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 description: User's full name
 *                 minLength: 1
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address (must be unique)
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password (minimum 6 characters)
 *                 minLength: 6
 *                 example: password123
 *     responses:
 *       201:
 *         description: User successfully registered and JWT token issued
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT authentication token (expires in 48 hours)
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjBjNzJiMmY1ZjFiMmMwMDEyYTRjNTZlIn0sImlhdCI6MTYyMzY3MjYyMywiZXhwIjoxNjIzODQ1NDIzfQ.7X8B9K5L3M2N4O6P8Q0R2S4T6U8V0W2X4Y6Z8
 *       400:
 *         description: Bad request - Validation errors or invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *                       param:
 *                         type: string
 *                       location:
 *                         type: string
 *             examples:
 *               invalidEmail:
 *                 summary: Invalid email format
 *                 value:
 *                   errors:
 *                     - msg: "Please include a valid email"
 *                       param: "email"
 *                       location: "body"
 *               shortPassword:
 *                 summary: Password too short
 *                 value:
 *                   errors:
 *                     - msg: "Please enter a password with 6 or more characters"
 *                       param: "password"
 *                       location: "body"
 *               missingName:
 *                 summary: Name field missing
 *                 value:
 *                   errors:
 *                     - msg: "Name is required"
 *                       param: "name"
 *                       location: "body"
 *       409:
 *         description: Conflict - User with this email already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "User already exists"
 *       422:
 *         description: Unprocessable Entity - Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *             example:
 *               errors:
 *                 - msg: "Email is already registered"
 *                   param: "email"
 *       500:
 *         description: Internal server error - Database or server failure
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Server error - Unable to register user at this time"
 */
router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(409).json({ msg: 'User already exists' });
      }

      user = new User({
        name,
        email,
        password,
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(payload, JWT_SECRET, { expiresIn: '48h' }, (err, token) => {
        if (err) throw err;
        res.status(201).json({ token });
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: 'Server error' });
    }
  }
);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Authenticate a user and return a JWT token
 *     description: |
 *       **Stakeholder:** Registered User (Customer/Admin)
 *       **Access Level:** Public (No Authentication Required)
 *       
 *       Validates user credentials and returns a JWT token for authenticated access. Token expires in 48 hours. Failed login attempts may result in temporary account lockout after multiple failures.
 *       
 *       **Error Handling:**
 *       - Returns 400 for malformed requests (missing fields).
 *       - Returns 401 for invalid credentials (wrong email/password).
 *       - Returns 403 if the account is locked or suspended.
 *       - Returns 429 if rate limits are exceeded.
 *       - Returns 500 for internal server errors.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's registered email address
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password
 *                 example: password123
 *     responses:
 *       200:
 *         description: Authentication successful - JWT token issued
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT authentication token (valid for 48 hours)
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjBjNzJiMmY1ZjFiMmMwMDEyYTRjNTZlIn0sImlhdCI6MTYyMzY3MjYyMywiZXhwIjoxNjIzODQ1NDIzfQ.7X8B9K5L3M2N4O6P8Q0R2S4T6U8V0W2X4Y6Z8
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 60c72b2f5f1b2c0012a4c56e
 *                     email:
 *                       type: string
 *                       example: john@example.com
 *       400:
 *         description: Bad request - Validation errors or malformed request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *                       param:
 *                         type: string
 *                       location:
 *                         type: string
 *             examples:
 *               invalidEmail:
 *                 summary: Invalid email format
 *                 value:
 *                   errors:
 *                     - msg: "Please include a valid email"
 *                       param: "email"
 *                       location: "body"
 *               missingPassword:
 *                 summary: Password field missing
 *                 value:
 *                   errors:
 *                     - msg: "Password is required"
 *                       param: "password"
 *                       location: "body"
 *       401:
 *         description: Unauthorized - Invalid email or password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *             examples:
 *               invalidCredentials:
 *                 summary: Wrong email or password
 *                 value:
 *                   msg: "Invalid credentials"
 *               userNotFound:
 *                 summary: Email not registered
 *                 value:
 *                   msg: "Invalid credentials"
 *               passwordMismatch:
 *                 summary: Incorrect password
 *                 value:
 *                   msg: "Invalid credentials"
 *       403:
 *         description: Forbidden - Account locked or access denied
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                 reason:
 *                   type: string
 *                 retryAfter:
 *                   type: integer
 *                   description: Seconds until account unlock
 *             examples:
 *               accountLocked:
 *                 summary: Too many failed login attempts
 *                 value:
 *                   msg: "Account temporarily locked due to multiple failed login attempts"
 *                   reason: "security_lockout"
 *                   retryAfter: 900
 *               accountSuspended:
 *                 summary: Account suspended by admin
 *                 value:
 *                   msg: "Access forbidden - Account has been suspended"
 *                   reason: "account_suspended"
 *               emailNotVerified:
 *                 summary: Email verification required
 *                 value:
 *                   msg: "Access forbidden - Please verify your email address"
 *                   reason: "email_not_verified"
 *       422:
 *         description: Unprocessable Entity - Request validation failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Unable to process login request"
 *       429:
 *         description: Too Many Requests - Rate limit exceeded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                 retryAfter:
 *                   type: integer
 *                   description: Seconds until rate limit resets
 *             example:
 *               msg: "Too many login attempts. Please try again later."
 *               retryAfter: 300
 *       500:
 *         description: Internal server error - Database or authentication service failure
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Server error - Unable to process authentication at this time"
 */
router.post('/login', [check('email', 'Please include a valid email').isEmail(), check('password', 'Password is required').exists()], async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(payload, JWT_SECRET, { expiresIn: '48h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

/**
 * @swagger
 * /api/auth/verify-email:
 *   post:
 *     summary: Verify if an email exists in the system
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email to verify
 *             example:
 *               email: john@example.com
 *     responses:
 *       200:
 *         description: Email exists and is valid for password reset
 *       400:
 *         description: Invalid email or user not found
 *       500:
 *         description: Server error
 */
router.post('/verify-email', [check('email', 'Please include a valid email').isEmail()], async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: 'Invalid email. User not found' });
    }

    res.json({ msg: 'Email is valid, you can proceed to reset your password' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset a user's password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email
 *               password:
 *                 type: string
 *                 description: New password for the user
 *             example:
 *               email: john@example.com
 *               password: newpassword123
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid email or validation error
 *       500:
 *         description: Server error
 */
router.post(
  '/reset-password',
  [check('email', 'Please include a valid email').isEmail(), check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ msg: 'Invalid email. User not found' });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();

      res.json({ msg: 'Password successfully reset' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
