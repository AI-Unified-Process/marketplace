const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticate } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// All order routes require authentication (customers)
router.use(authenticate);

// POST /orders — place a new order
router.post('/', async (req, res) => {
  const { items } = req.body; // [{ bookId, quantity }]
  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'Order must contain at least one item' });
  }

  let total = 0;
  const orderItems = [];
  for (const item of items) {
    const book = await prisma.book.findUnique({ where: { id: item.bookId } });
    if (!book) return res.status(404).json({ error: `Book ${item.bookId} not found` });
    if (book.stock < item.quantity) {
      return res.status(400).json({ error: `Insufficient stock for "${book.title}"` });
    }
    total += book.price * item.quantity;
    orderItems.push({ bookId: book.id, quantity: item.quantity, unitPrice: book.price });
  }

  const order = await prisma.order.create({
    data: {
      userId: req.user.id,
      totalAmount: total,
      status: 'pending',
      items: { create: orderItems }
    },
    include: { items: true }
  });

  // Decrement stock
  for (const item of items) {
    await prisma.book.update({
      where: { id: item.bookId },
      data: { stock: { decrement: item.quantity } }
    });
  }

  res.status(201).json(order);
});

// GET /orders — list customer's own orders
router.get('/', async (req, res) => {
  const orders = await prisma.order.findMany({
    where: { userId: req.user.id },
    include: { items: { include: { book: true } } },
    orderBy: { createdAt: 'desc' }
  });
  res.json(orders);
});

// GET /orders/:id — view a specific order
router.get('/:id', async (req, res) => {
  const order = await prisma.order.findFirst({
    where: { id: parseInt(req.params.id), userId: req.user.id },
    include: { items: { include: { book: true } } }
  });
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
});

// DELETE /orders/:id — cancel an order (only if pending)
router.delete('/:id', async (req, res) => {
  const order = await prisma.order.findFirst({
    where: { id: parseInt(req.params.id), userId: req.user.id }
  });
  if (!order) return res.status(404).json({ error: 'Order not found' });
  if (order.status !== 'pending') {
    return res.status(400).json({ error: 'Only pending orders can be cancelled' });
  }
  await prisma.order.update({
    where: { id: order.id },
    data: { status: 'cancelled' }
  });
  res.json({ message: 'Order cancelled' });
});

module.exports = router;
