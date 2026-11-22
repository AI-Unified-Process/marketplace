const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticate } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// POST /reviews — authenticated customers submit a review
router.post('/', authenticate, async (req, res) => {
  const { bookId, rating, comment } = req.body;
  if (!bookId || !rating) {
    return res.status(400).json({ error: 'bookId and rating are required' });
  }
  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5' });
  }

  // Check that the customer has purchased this book
  const purchased = await prisma.orderItem.findFirst({
    where: {
      bookId,
      order: { userId: req.user.id, status: { not: 'cancelled' } }
    }
  });
  if (!purchased) {
    return res.status(403).json({ error: 'You must purchase a book before reviewing it' });
  }

  const existing = await prisma.review.findUnique({
    where: { userId_bookId: { userId: req.user.id, bookId } }
  });
  if (existing) {
    return res.status(409).json({ error: 'You have already reviewed this book' });
  }

  const review = await prisma.review.create({
    data: { userId: req.user.id, bookId, rating, comment }
  });
  res.status(201).json(review);
});

module.exports = router;
