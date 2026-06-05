const express = require('express');
const router = express.Router();
const Result = require('../models/Result');

// GET /api/result?roll=&regNo=&year=&board=&examination=
router.get('/result', async (req, res) => {
  try {
    const { roll, regNo, year, board, examination } = req.query;

    if (!roll || !regNo) {
      return res.status(400).json({
        success: false,
        message: 'Roll number and Registration number are required.'
      });
    }

    const query = {
      rollNo: roll.trim(),
      regNo: regNo.trim()
    };
    if (year) query.year = year.trim();
    if (board) query.board = board.trim();
    if (examination) query.examination = examination.trim();

    const result = await Result.findOne(query);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'No result found. Please check Roll No, Registration No, Year, and Board.'
      });
    }

    res.json({ success: true, data: result });
  } catch (err) {
    console.error('Result fetch error:', err);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});

// GET /api/boards — return distinct boards
router.get('/boards', async (req, res) => {
  try {
    const boards = await Result.distinct('board');
    res.json({ success: true, data: boards });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// GET /api/years — return distinct years
router.get('/years', async (req, res) => {
  try {
    const years = await Result.distinct('year');
    res.json({ success: true, data: years.sort((a, b) => b - a) });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// POST /api/result — add a result (admin use)
router.post('/result', async (req, res) => {
  try {
    const result = new Result(req.body);
    await result.save();
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    console.error('Save error:', err);
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
