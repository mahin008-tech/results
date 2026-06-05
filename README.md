# 🏫 Education Board Results Portal

A full-stack results portal inspired by Bangladesh's official education board result website — built with **Node.js**, **Express**, **MongoDB**, and vanilla **HTML/CSS/JS**.

---

## 📁 Project Structure

```
results-portal/
├── server.js              # Main Express server
├── .env                   # Environment variables
├── package.json
├── models/
│   └── Result.js          # Mongoose schema
├── routes/
│   └── results.js         # API endpoints
├── seed/
│   └── seed.js            # Sample data seeder
└── public/
    └── index.html         # Frontend (served statically)
```

---

## ⚙️ Prerequisites

- **Node.js** v18+ — https://nodejs.org
- **MongoDB** v6+ running locally — https://www.mongodb.com/try/download/community
  - Or use **MongoDB Atlas** (free cloud): https://cloud.mongodb.com

---

## 🚀 Setup & Run

### 1. Install dependencies
```bash
cd results-portal
npm install
```

### 2. Configure environment
Edit `.env`:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/results_portal

# For MongoDB Atlas, use:
# MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/results_portal
```

### 3. Seed sample data
```bash
npm run seed
```
This inserts 3 sample students. Sample test credentials:

| Roll   | Reg No        | Year | Board      | Exam                     |
|--------|---------------|------|------------|--------------------------|
| 579209 | 2211120839    | 2025 | Comilla    | SSC/Dakhil/Equivalent    |
| 123456 | 2211000001    | 2025 | Dhaka      | SSC/Dakhil/Equivalent    |
| 654321 | 2211000002    | 2025 | Chittagong | HSC/Alim/Equivalent      |

### 4. Start server
```bash
npm start
# or for development with auto-reload:
npm run dev
```

### 5. Open in browser
```
http://localhost:3000
```

---

## 🌐 API Endpoints

### Get a result
```
GET /api/result?roll=579209&regNo=2211120839&year=2025&board=Comilla&examination=SSC/Dakhil/Equivalent
```

### Get available boards
```
GET /api/boards
```

### Get available years
```
GET /api/years
```

### Add a result (admin)
```
POST /api/result
Content-Type: application/json

{
  "rollNo": "999999",
  "regNo": "2211999999",
  "examination": "SSC/Dakhil/Equivalent",
  "year": "2025",
  "board": "Dhaka",
  "name": "STUDENT NAME",
  "fatherName": "FATHER NAME",
  "motherName": "MOTHER NAME",
  "dateOfBirth": "15-03-08",
  "group": "SCIENCE",
  "type": "REGULAR",
  "institute": "SCHOOL NAME",
  "result": "PASS",
  "gpa": "5.00",
  "subjects": [
    { "code": "101", "name": "BANGLA", "grade": "A+" },
    { "code": "107", "name": "ENGLISH", "grade": "A+" }
  ]
}
```

### Health check
```
GET /health
```

---

## 🗄️ MongoDB Schema

```js
{
  rollNo:      String,   // required, indexed
  regNo:       String,   // required, indexed
  examination: String,   // e.g. "SSC/Dakhil/Equivalent"
  year:        String,
  board:       String,
  name:        String,
  fatherName:  String,
  motherName:  String,
  dateOfBirth: String,
  group:       String,
  type:        String,   // "REGULAR" | "IRREGULAR"
  institute:   String,
  result:      String,   // "PASS" | "FAIL"
  gpa:         String,
  subjects: [
    { code: String, name: String, grade: String }
  ]
}
```

---

## ✨ Features

- 🔍 Search by Roll, Reg No, Year, Board, Examination
- 🧮 Math captcha to prevent bot abuse
- 📋 Full grade sheet with colour-coded grade badges
- 🖨 Print-ready result view
- 📢 Live scrolling news ticker
- 📱 Responsive for mobile & desktop
- ⚡ Fast MongoDB indexed queries

---

## 🔧 Production Tips

- Use **PM2** to keep the server alive: `pm2 start server.js`
- Use **Nginx** as a reverse proxy on port 80/443
- Enable **MongoDB Atlas** for cloud database
- Add **rate limiting** with `express-rate-limit` for production
- Add **JWT authentication** for the admin POST endpoint
