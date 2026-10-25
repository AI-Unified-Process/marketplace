const request = require('supertest');
const app = require('../src/index');

describe('Place Order use case', () => {
  it('should create an order with valid items', async () => {
    // customer places an order for books in stock
  });

  it('should reject an order when stock is insufficient', async () => {
    // customer tries to order more copies than are in stock
  });

  it('should return order history for authenticated customer', async () => {
    // customer views their past orders
  });
});

describe('Cancel Order use case', () => {
  it('should allow cancellation of pending orders only', async () => {
    // customer cancels a pending order
  });

  it('should reject cancellation of shipped orders', async () => {
    // customer cannot cancel an order that is already shipped
  });
});

describe('Submit Review use case', () => {
  it('should allow a customer who purchased a book to leave a review', async () => {
    // customer who bought the book can submit a review
  });

  it('should reject a review from a customer who has not purchased the book', async () => {
    // customer who did not buy cannot review
  });
});
