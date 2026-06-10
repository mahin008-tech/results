require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/results_portal';
const ADMIN_KEY = process.env.ADMIN_KEY;

// ── Middleware ───────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ── Frontend Pages ───────────────────────────
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'info.html'));
});

app.get('/dl', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dl.html'));
});

app.get('/result', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ── Public API routes ────────────────────────
app.use('/api', require('./routes/results'));

// ── Admin API routes ─────────────────────────
app.use('/api/admin', require('./routes/admin'));

// ── Admin Panel ──────────────────────────────
app.get('/admin-panel', (req, res) => {
  const provided = req.query.key || '';

  if (!ADMIN_KEY || provided !== ADMIN_KEY) {
    return res
      .status(404)
      .sendFile(path.join(__dirname, 'public', 'index.html'));
  }

  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// ── Health Check ─────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    db: mongoose.connection.readyState === 1
      ? 'connected'
      : 'disconnected'
  });
});

// ── 404 Handler ──────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found.'
  });
});

// ── Error Handler ────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    success: false,
    message: 'Internal server error.'
  });
});

// ── Connect MongoDB & Start Server ───────────
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected');

    if (!ADMIN_KEY) {
      console.warn('⚠️ ADMIN_KEY not set — admin panel disabled!');
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
      console.log(`🏠 Home: http://localhost:${PORT}/`);
      console.log(`📄 Result: http://localhost:${PORT}/result`);
      console.log(`⬇️ Download: http://localhost:${PORT}/dl`);
      console.log(`🔐 Admin: http://localhost:${PORT}/admin-panel?key=<ADMIN_KEY>`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });

module.exports = app;
