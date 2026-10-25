const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// All admin routes require authentication + admin role
router.use(authenticate, requireAdmin);

// POST /admin/books — add a book to the catalog
router.post('/books', async (req, res) => {
  const { title, author, isbn, price, stock, description } = req.body;
  if (!title || !author || !isbn || price == null) {
    return res.status(400).json({ error: 'title, author, isbn, and price are required' });
  }
  if (price <= 0) {
    return res.status(400).json({ error: 'Price must be greater than zero' });
  }
  const existing = await prisma.book.findUnique({ where: { isbn } });
  if (existing) {
    return res.status(409).json({ error: 'ISBN already exists' });
  }
  const book = await prisma.book.create({
    data: { title, author, isbn, price, stock: stock || 0, description }
  });
  res.status(201).json(book);
});

// PUT /admin/books/:id — update book details or restock
router.put('/books/:id', async (req, res) => {
  const book = await prisma.book.findUnique({ where: { id: parseInt(req.params.id) } });
  if (!book) return res.status(404).json({ error: 'Book not found' });
  const updated = await prisma.book.update({
    where: { id: book.id },
    data: req.body
  });
  res.json(updated);
});

// GET /admin/orders — list all orders across all customers
router.get('/orders', async (req, res) => {
  const { status } = req.query;
  const where = status ? { status } : {};
  const orders = await prisma.order.findMany({
    where,
    include: { user: { select: { name: true, email: true } }, items: { include: { book: true } } },
    orderBy: { createdAt: 'desc' }
  });
  res.json(orders);
});

// PUT /admin/orders/:id/status — update order status (confirm, ship, cancel)
router.put('/orders/:id/status', async (req, res) => {
  const { status } = req.body;
  const allowed = ['confirmed', 'shipped', 'cancelled'];
  if (!allowed.includes(status)) {
    return res.status(400).json({ error: `Status must be one of: ${allowed.join(', ')}` });
  }
  const order = await prisma.order.findUnique({ where: { id: parseInt(req.params.id) } });
  if (!order) return res.status(404).json({ error: 'Order not found' });
  const updated = await prisma.order.update({
    where: { id: order.id },
    data: { status }
  });
  res.json(updated);
});

module.exports = router;
