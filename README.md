# Results Portal — with Admin Panel

A Node.js + MongoDB education results portal for Bangladesh boards, with a fully hidden admin panel for managing results.

---

## Setup

```bash
npm install
```

Edit `.env`:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/results_portal
ADMIN_KEY=your_super_secret_key_here
```

Seed sample data (optional):
```bash
npm run seed
```

Start:
```bash
npm start
# or for development:
npm run dev
```

---

## URLs

| URL | Description |
|-----|-------------|
| `http://localhost:3000/` | Public results portal |
| `http://localhost:3000/admin-panel?key=YOUR_ADMIN_KEY` | Admin panel (hidden from public) |

> Normal users visiting `/admin-panel` without the correct key see a generic 404 page — the admin panel's existence is completely hidden.

---

## Admin Panel Features

- **Dashboard** — live stats (total, passed, failed, hidden results)
- **Results Table** — paginated, searchable, filterable by exam/year/board
- **Add Result** — full form with all fields including subjects, marks, grades
- **Edit Result** — edit any field including subjects
- **Delete Result** — with confirmation dialog
- **Toggle Hide** — hide/show a result from public search instantly
- **Religion subjects** — select student's faith (Islam, Hindu, Christian, Buddhist, Other) to set the correct religion subject label

---

## Religion Subject Labels

When adding/editing a result, select the student's faith. The religion subject is labelled accordingly:

| Faith | Label |
|-------|-------|
| Islam | ISLAM AND MORAL EDUCATION |
| Hindu | HINDU RELIGION AND MORAL EDUCATION |
| Christian | CHRISTIAN RELIGION AND MORAL EDUCATION |
| Buddhist | BUDDHIST RELIGION AND MORAL EDUCATION |
| Other | RELIGION AND MORAL EDUCATION |

---

## Admin API Endpoints

All require `?key=ADMIN_KEY` query param or `x-admin-key` header.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/results` | List all results (paginated) |
| GET | `/api/admin/results/:id` | Get single result |
| POST | `/api/admin/results` | Create result |
| PUT | `/api/admin/results/:id` | Update result |
| PATCH | `/api/admin/results/:id/toggle-hide` | Toggle visibility |
| DELETE | `/api/admin/results/:id` | Delete result |
| GET | `/api/admin/meta` | Distinct boards/years/examinations |
| GET | `/api/admin/stats` | Dashboard counts |

---

## Public API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/result` | Search result by roll+reg+year+board+exam |
| GET | `/api/boards` | List boards (excluding hidden results) |
| GET | `/api/years` | List years (excluding hidden results) |
| GET | `/api/examinations` | List examination types |

---

## Data Model

```js
{
  rollNo, regNo,               // required, indexed
  examination, year, board,    // required
  name, fatherName, motherName,
  dateOfBirth, group, type, institute,
  result: "PASS" | "FAIL",
  gpa,
  religionSubjectLabel,        // per student's faith
  subjects: [{ code, name, marks, grade }],
  hidden: Boolean              // hides from public search
}
```
