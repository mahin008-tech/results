require('dotenv').config();
const express   = require('express');
const mongoose  = require('mongoose');
const cors      = require('cors');
const path      = require('path');

const app          = express();
const PORT         = process.env.PORT || 3000;
const MONGODB_URI  = process.env.MONGODB_URI || 'mongodb://localhost:27017/results_portal';
const ADMIN_KEY    = process.env.ADMIN_KEY;

// ── Middleware ───────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/dl', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dl.html'));
});
// ── Public API routes ────────────────────────
app.use('/api', require('./routes/results'));

// ── Admin API routes (key checked inside) ────
app.use('/api/admin', require('./routes/admin'));

// ── Admin Panel page — only rendered if key matches ──
app.get('/admin-panel', (req, res) => {
  const provided = req.query.key || '';
  if (!ADMIN_KEY || provided !== ADMIN_KEY) {
    // Return a generic 404 to hide the panel's existence from normal users
    return res.status(404).sendFile(path.join(__dirname, 'public', 'index.html'));
  }
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// ── Public frontend ──────────────────────────
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ── Health check ─────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// ── 404 handler ──────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found.' });
});

// ── Error handler ────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error.' });
});

// ── Connect & Start ──────────────────────────
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected:', MONGODB_URI);
    if (!ADMIN_KEY) console.warn('⚠️  ADMIN_KEY not set — admin panel disabled!');
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
      console.log(`🔐 Admin panel: http://localhost:${PORT}/admin-panel?key=<ADMIN_KEY>`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });

module.exports = app;
