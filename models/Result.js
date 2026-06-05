const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  code: { type: String, required: true },
  name: { type: String, required: true },
  grade: { type: String, required: true }
});

const resultSchema = new mongoose.Schema({
  rollNo: { type: String, required: true, index: true },
  regNo: { type: String, required: true, index: true },
  examination: { type: String, required: true },
  year: { type: String, required: true },
  board: { type: String, required: true },
  name: { type: String, required: true },
  fatherName: { type: String },
  motherName: { type: String },
  dateOfBirth: { type: String },
  group: { type: String },
  type: { type: String, default: 'REGULAR' },
  institute: { type: String },
  result: { type: String, enum: ['PASS', 'FAIL'], required: true },
  gpa: { type: String },
  subjects: [subjectSchema]
}, { timestamps: true });

// Compound index for fast lookup
resultSchema.index({ rollNo: 1, regNo: 1, year: 1, board: 1, examination: 1 });

module.exports = mongoose.model('Result', resultSchema);
