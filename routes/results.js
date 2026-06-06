const express = require('express');
const router  = express.Router();
const Result  = require('../models/Result');

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
      regNo:  regNo.trim(),
      hidden: { $ne: true }   // never expose hidden results to public
    };
    if (year)        query.year = year.trim();
    if (board)       query.board = board.trim();
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

// GET /api/boards — distinct boards (non-hidden only)
router.get('/boards', async (req, res) => {
  try {
    const boards = await Result.distinct('board', { hidden: { $ne: true } });
    res.json({ success: true, data: boards.sort() });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// GET /api/years — distinct years (non-hidden only)
router.get('/years', async (req, res) => {
  try {
    const years = await Result.distinct('year', { hidden: { $ne: true } });
    res.json({ success: true, data: years.sort((a, b) => b - a) });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// GET /api/examinations — distinct examination types (non-hidden only)
router.get('/examinations', async (req, res) => {
  try {
    const exams = await Result.distinct('examination', { hidden: { $ne: true } });
    res.json({ success: true, data: exams.sort() });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
