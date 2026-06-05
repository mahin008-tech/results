require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const Result = require('../models/Result');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/results_portal';

const sampleResults = [
  {
    rollNo: '579209',
    regNo: '2211120839',
    examination: 'SSC/Dakhil/Equivalent',
    year: '2025',
    board: 'Comilla',
    name: 'MD. AMIR HUMZA',
    fatherName: 'MD MONGOL HOSSEN',
    motherName: 'SALEHA BEGUM',
    dateOfBirth: '17-02-08',
    group: 'BUSINESS STUDIES',
    type: 'REGULAR',
    institute: 'KHEORA ANANDAMOYEE HIGH SCHOOL',
    result: 'FAIL',
    gpa: '',
    subjects: [
      { code: '101', name: 'BANGLA', grade: 'B' },
      { code: '107', name: 'ENGLISH', grade: 'F' },
      { code: '109', name: 'MATHEMATICS', grade: 'F' },
      { code: '127', name: 'SCIENCE', grade: 'F' },
      { code: '111', name: 'ISLAM AND MORAL EDUCATION', grade: 'A-' },
      { code: '152', name: 'FINANCE AND BANKING', grade: 'B' },
      { code: '146', name: 'ACCOUNTING', grade: 'B' },
      { code: '143', name: 'BUSINESS ENTREPRENEURSHIP', grade: 'C' },
      { code: '154', name: 'INFORMATION AND COMMUNICATION TECHNOLOGY', grade: 'A+' },
      { code: '134', name: 'AGRICULTURE STUDIES', grade: 'A' },
      { code: '147', name: 'PHYSICAL EDUCATION, HEALTH & SPORTS', grade: 'A+' },
      { code: '156', name: 'CAREER EDUCATION', grade: 'A+' }
    ]
  },
  {
    rollNo: '123456',
    regNo: '2211000001',
    examination: 'SSC/Dakhil/Equivalent',
    year: '2025',
    board: 'Dhaka',
    name: 'FATIMA AKTER',
    fatherName: 'KARIM AKTER',
    motherName: 'NASRIN BEGUM',
    dateOfBirth: '15-03-07',
    group: 'SCIENCE',
    type: 'REGULAR',
    institute: 'DHAKA MODEL HIGH SCHOOL',
    result: 'PASS',
    gpa: '5.00',
    subjects: [
      { code: '101', name: 'BANGLA', grade: 'A+' },
      { code: '107', name: 'ENGLISH', grade: 'A+' },
      { code: '109', name: 'MATHEMATICS', grade: 'A+' },
      { code: '110', name: 'PHYSICS', grade: 'A+' },
      { code: '112', name: 'CHEMISTRY', grade: 'A+' },
      { code: '113', name: 'BIOLOGY', grade: 'A+' },
      { code: '111', name: 'ISLAM AND MORAL EDUCATION', grade: 'A+' },
      { code: '154', name: 'INFORMATION AND COMMUNICATION TECHNOLOGY', grade: 'A+' },
      { code: '147', name: 'PHYSICAL EDUCATION, HEALTH & SPORTS', grade: 'A+' }
    ]
  },
  {
    rollNo: '654321',
    regNo: '2211000002',
    examination: 'HSC/Alim/Equivalent',
    year: '2025',
    board: 'Chittagong',
    name: 'RAFI AHMED',
    fatherName: 'AHMED HOSSAIN',
    motherName: 'REHANA BEGUM',
    dateOfBirth: '20-06-06',
    group: 'HUMANITIES',
    type: 'REGULAR',
    institute: 'CHITTAGONG GOVT. COLLEGE',
    result: 'PASS',
    gpa: '4.42',
    subjects: [
      { code: '101', name: 'BANGLA', grade: 'A' },
      { code: '107', name: 'ENGLISH', grade: 'B' },
      { code: '120', name: 'CIVICS', grade: 'A+' },
      { code: '121', name: 'ECONOMICS', grade: 'A' },
      { code: '122', name: 'HISTORY', grade: 'A-' },
      { code: '111', name: 'ISLAM AND MORAL EDUCATION', grade: 'A' },
      { code: '154', name: 'INFORMATION AND COMMUNICATION TECHNOLOGY', grade: 'A+' },
      { code: '147', name: 'PHYSICAL EDUCATION, HEALTH & SPORTS', grade: 'A' }
    ]
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    await Result.deleteMany({});
    console.log('🗑️  Cleared existing results');

    await Result.insertMany(sampleResults);
    console.log(`✅ Seeded ${sampleResults.length} student results`);

    console.log('\n📋 Sample credentials to test:');
    sampleResults.forEach(r => {
      console.log(`  Roll: ${r.rollNo}  |  Reg: ${r.regNo}  |  Year: ${r.year}  |  Board: ${r.board}`);
    });

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
}

seed();
