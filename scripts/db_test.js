// scripts/db_test.js - quick script to test DB functions
const db = require('../db/db');

db.getAllProducts((err, rows) => {
  if (err) {
    console.error('Error fetching products:', err.message);
    process.exit(1);
  }
  console.log('Products:');
  rows.forEach(r => console.log(` - ${r.id}: ${r.name} (${r.category}) $${r.price}`));
  process.exit(0);
});
