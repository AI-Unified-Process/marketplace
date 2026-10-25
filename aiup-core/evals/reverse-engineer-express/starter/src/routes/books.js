const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticate } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// GET /books — public: browse catalog
router.get('/', async (req, res) => {
  const { search, minPrice, maxPrice } = req.query;
  const where = {};
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { author: { contains: search, mode: 'insensitive' } }
    ];
  }
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = parseFloat(minPrice);
    if (maxPrice) where.price.lte = parseFloat(maxPrice);
  }
  const books = await prisma.book.findMany({ where });
  res.json(books);
});

// GET /books/:id — public: view book detail
router.get('/:id', async (req, res) => {
  const book = await prisma.book.findUnique({
    where: { id: parseInt(req.params.id) },
    include: { reviews: { include: { user: { select: { name: true } } } } }
  });
  if (!book) return res.status(404).json({ error: 'Book not found' });
  res.json(book);
});

module.exports = router;
