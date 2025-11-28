const express = require('express');
const Order = require('../models/order');

const router = express.Router();

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * @swagger
 * /api/orders/track:
 *   post:
 *     summary: Get the current status of an order
 *     description: |
 *       **Stakeholder:** Guest User, Registered Customer
 *       **Access Level:** Public (No Authentication Required)
 *       
 *       Retrieves the real-time status and history of an order using the order number and email address.
 *       
 *       **Error Handling:**
 *       - Returns 400 if order number or email is missing/invalid.
 *       - Returns 404 if the order is not found.
 *       - Returns 500 for internal server errors.
 *     tags:
 *       - Orders
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderNumber
 *               - email
 *             properties:
 *               orderNumber:
 *                 type: string
 *                 example: FE-123456
 *                 description: The unique order identifier (e.g., FE-123456)
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email address used for the order
 *     responses:
 *       200:
 *         description: Order status payload retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 orderNumber:
 *                   type: string
 *                 currentStatus:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                     label:
 *                       type: string
 *                     description:
 *                       type: string
 *                     enteredAt:
 *                       type: string
 *                       format: date-time
 *                 statusHistory:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/OrderStatus'
 *                 statusFlow:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/OrderStatus'
 *       404:
 *         description: Order not found
 *       400:
 *         description: Validation error (invalid format or missing fields)
 *       500:
 *         description: Server error
 */

router.post('/track', async (req, res) => {
  try {
    const { orderNumber, email } = req.body || {};

    if (!orderNumber || !email) {
      return res.status(400).json({ error: 'Order number and email are required.' });
    }

    const normalizedOrderNumber = String(orderNumber).trim().toUpperCase();
    const normalizedEmail = String(email).trim().toLowerCase();

    if (!normalizedOrderNumber.startsWith('FE-')) {
      return res.status(400).json({ error: 'Invalid order number format.' });
    }

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({ error: 'Invalid email format.' });
    }

    const order = await Order.findOne({ orderNumber: normalizedOrderNumber, email: normalizedEmail });

    if (!order) {
      return res.status(404).json({ error: 'Order not found. Double-check your email and order number.' });
    }

    order.ensureInitialStatus();

    let advanced = false;
    if (order.statusIndex < Order.STATUS_FLOW.length - 1) {
      const shouldAdvance = order.statusHistory.length > 1 ? Math.random() < 0.75 : Math.random() < 0.35;
      if (shouldAdvance) {
        advanced = order.advanceStatus();
      }
    }

    if (advanced) {
      order.markModified('statusHistory');
    }

    await order.save();

    const responsePayload = {
      orderNumber: order.orderNumber,
      email: order.email,
      currentStatus: order.statusHistory[order.statusHistory.length - 1],
      statusHistory: order.statusHistory,
      statusFlow: Order.STATUS_FLOW,
      total: order.total,
      items: order.items,
      estimatedDelivery: order.estimatedDelivery,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };

    res.json(responsePayload);
  } catch (error) {
    console.error('Error tracking order:', error);
    res.status(500).json({ error: 'Unable to fetch order status right now.' });
  }
});

module.exports = router;
