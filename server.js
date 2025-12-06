// server.js - main entrypoint
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Mount feature routers (some will be added in feature branches)
try {
  const authRouter = require('./routes/auth');
  app.use('/auth', authRouter);
} catch (e) {
  // feature/user-authentication may not exist yet
}

try {
  const apiRouter = require('./routes/api');
  app.use('/api/v1', apiRouter);
} catch (e) {
  // feature/api-endpoints may not exist yet
}

// Health endpoint
app.get('/health', async (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Basic homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

