const express  = require('express');
const router   = express.Router();
const Result   = require('../models/Result');
const Setting  = require('../models/Setting');
const adminAuth = require('../middleware/adminAuth');

// All routes below require admin key
router.use(adminAuth);

// ─────────────────────────────────────────────
// RESULTS — CRUD
// ─────────────────────────────────────────────

/** GET /api/admin/results — list all results (with optional filters) */
router.get('/results', async (req, res) => {
  try {
    const { page = 1, limit = 20, examination, year, board, search } = req.query;
    const query = {};
    if (examination) query.examination = examination;
    if (year)        query.year = year;
    if (board)       query.board = board;
    if (search) {
      const re = new RegExp(search, 'i');
      query.$or = [{ rollNo: re }, { regNo: re }, { name: re }, { institute: re }];
    }

    const total   = await Result.countDocuments(query);
    const results = await Result.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, total, page: Number(page), data: results });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/** GET /api/admin/results/:id — get single result */
router.get('/results/:id', async (req, res) => {
  try {
    const result = await Result.findById(req.params.id);
    if (!result) return res.status(404).json({ success: false, message: 'Not found.' });
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/** POST /api/admin/results — create new result */
router.post('/results', async (req, res) => {
  try {
    const result = new Result(req.body);
    await result.save();
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

/** PUT /api/admin/results/:id — full update */
router.put('/results/:id', async (req, res) => {
  try {
    const result = await Result.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!result) return res.status(404).json({ success: false, message: 'Not found.' });
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

/** PATCH /api/admin/results/:id/toggle-hide — toggle visibility */
router.patch('/results/:id/toggle-hide', async (req, res) => {
  try {
    const result = await Result.findById(req.params.id);
    if (!result) return res.status(404).json({ success: false, message: 'Not found.' });
    result.hidden = !result.hidden;
    await result.save();
    res.json({ success: true, hidden: result.hidden, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/** DELETE /api/admin/results/:id — delete a result */
router.delete('/results/:id', async (req, res) => {
  try {
    const result = await Result.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ success: false, message: 'Not found.' });
    res.json({ success: true, message: 'Deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────
// META — distinct values used in dropdowns
// ─────────────────────────────────────────────

/** GET /api/admin/meta — all distinct boards, years, examinations */
router.get('/meta', async (req, res) => {
  try {
    const [boards, years, examinations] = await Promise.all([
      Result.distinct('board'),
      Result.distinct('year'),
      Result.distinct('examination')
    ]);
    res.json({
      success: true,
      data: {
        boards:       boards.sort(),
        years:        years.sort((a, b) => b - a),
        examinations: examinations.sort()
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/** GET /api/admin/stats — dashboard counts */
router.get('/stats', async (req, res) => {
  try {
    const [total, hidden, passed, failed] = await Promise.all([
      Result.countDocuments({}),
      Result.countDocuments({ hidden: true }),
      Result.countDocuments({ result: 'PASS' }),
      Result.countDocuments({ result: 'FAIL' })
    ]);
    res.json({ success: true, data: { total, hidden, passed, failed } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────
// SETTINGS — notice with optional time limits
// ─────────────────────────────────────────────

/** GET /api/admin/settings/notice — get current notice config */
router.get('/settings/notice', async (req, res) => {
  try {
    const doc = await Setting.findOne({ key: 'notice' });
    res.json({ success: true, data: doc ? doc.value : null });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/** PUT /api/admin/settings/notice — save notice config */
router.put('/settings/notice', async (req, res) => {
  try {
    const { message, startTime, endTime, enabled } = req.body;
    const value = {
      message:   message   || '',
      startTime: startTime || null,   // ISO string or null
      endTime:   endTime   || null,
      enabled:   enabled !== false    // default true
    };
    const doc = await Setting.findOneAndUpdate(
      { key: 'notice' },
      { key: 'notice', value },
      { upsert: true, new: true }
    );
    res.json({ success: true, data: doc.value });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;

