const express = require('express');
const router = express.Router();
const Subscriber = require('../models/subscriber');

/**
 * @swagger
 * /api/newsletter/subscribe:
 *   post:
 *     summary: Subscribe to the newsletter
 *     description: |
 *       **Stakeholder:** Guest User, Registered Customer
 *       **Access Level:** Public
 *       
 *       Adds a new email address to the newsletter subscriber list.
 *       
 *       **Error Handling:**
 *       - Returns 400 if email is invalid or already subscribed.
 *       - Returns 500 for internal server errors.
 *     tags:
 *       - Newsletter
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *     responses:
 *       201:
 *         description: Successfully subscribed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Successfully subscribed to the newsletter!"
 *       400:
 *         description: Validation error or already subscribed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Email is already subscribed"
 *       500:
 *         description: Server error
 */
router.post('/subscribe', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        // Check if already subscribed
        const existingSubscriber = await Subscriber.findOne({ email });
        if (existingSubscriber) {
            return res.status(400).json({ error: 'This email is already subscribed.' });
        }

        const newSubscriber = new Subscriber({ email });
        await newSubscriber.save();

        res.status(201).json({ message: 'Successfully subscribed to the newsletter!' });
    } catch (error) {
        console.error('Newsletter subscription error:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: 'Invalid email format' });
        }
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
