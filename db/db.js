// db/db.js - database connection module using sqlite3
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const DB_FILE = process.env.DB_FILE || path.join(__dirname, '..', 'data', 'team-sim.db');

// ensure data directory
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

// open database
const db = new sqlite3.Database(DB_FILE, (err) => {
  if (err) {
    console.error('Failed to open DB:', err.message);
  } else {
    console.log('Connected to SQLite DB at', DB_FILE);
  }
});

// init schema if not exists
const initSql = `
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT,
  price REAL,
  qty INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS cart (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  product_id TEXT,
  quantity INTEGER
);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  items TEXT,
  status TEXT,
  created_at TEXT
);
`;

// Run initialization
db.serialize(() => {
  db.exec(initSql, (err) => {
    if (err) console.error('DB init error', err.message);
  });

  // Insert sample products if empty
  db.get('SELECT COUNT(*) as c FROM products', (err, row) => {
    if (!err && row && row.c === 0) {
      const insert = db.prepare('INSERT INTO products (id,name,category,price,qty) VALUES (?, ?, ?, ?, ?)');
      insert.run('p-1', 'Wireless Mouse', 'Electronics', 29.99, 100);
      insert.run('p-2', 'Coffee Mug', 'Home', 9.99, 200);
      insert.run('p-3', 'Notebook', 'Stationery', 4.5, 500);
      insert.finalize();
      console.log('Seeded products');
    }
  });
});

// Helper query functions
module.exports = {
  getAllProducts: function(callback) {
    db.all('SELECT * FROM products', callback);
  },
  getProductById: function(id, callback) {
    db.get('SELECT * FROM products WHERE id = ?', [id], callback);
  },
  addToCart: function(item, callback) {
    const { id, user_id, product_id, quantity } = item;
    db.run('INSERT INTO cart (id, user_id, product_id, quantity) VALUES (?, ?, ?, ?)',
      [id, user_id, product_id, quantity], callback);
  },
  // more helpers (orders, update qty) can be added here
  dbInstance: db
};
