// routes/api.js - basic REST API structure for products/cart/orders
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// Attempt to use db module if present
let db;
try {
  db = require('../db/db');
} catch (e) {
  db = null;
}

/**
 * GET /api/v1/products
 * Optional query: ?category=...
 */
router.get('/products', (req, res) => {
  const category = req.query.category;
  if (db) {
    db.getAllProducts((err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      const filtered = category ? rows.filter(p => p.category === category) : rows;
      res.json(filtered);
    });
  } else {
    // fallback demo data if db module missing
    const demo = [
      { id: 'p-1', name: 'Demo Mouse', category: 'Electronics', price: 19.99 },
      { id: 'p-2', name: 'Demo Mug', category: 'Home', price: 7.5 }
    ];
    const filtered = category ? demo.filter(p => p.category === category) : demo;
    res.json(filtered);
  }
});

/**
 * GET /api/v1/products/:id
 */
router.get('/products/:id', (req, res) => {
  const id = req.params.id;
  if (db) {
    db.getProductById(id, (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!row) return res.status(404).json({ error: 'not found' });
      res.json(row);
    });
  } else {
    return res.status(404).json({ error: 'db not configured' });
  }
});

/**
 * POST /api/v1/cart/items
 * { user_id, product_id, quantity }
 */
router.post('/cart/items', (req, res) => {
  const { user_id, product_id, quantity } = req.body || {};
  if (!user_id || !product_id || !quantity) {
    return res.status(400).json({ error: 'user_id, product_id, quantity required' });
  }
  const id = uuidv4();
  if (db) {
    db.addToCart({ id, user_id, product_id, quantity }, (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id, user_id, product_id, quantity });
    });
  } else {
    res.status(201).json({ id, user_id, product_id, quantity, note: 'not persisted (demo)' });
  }
});

/**
 * GET /api/v1/orders
 * Basic placeholder - returns empty list
 */
router.get('/orders', (req, res) => {
  // In a full implementation, query db.orders
  res.json([]);
});

module.exports = router;
