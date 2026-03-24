# COPILOT AGENT PROMPT — LNMIIT Insurance Card Portal
# Paste this into GitHub Copilot Chat using @workspace in VS Code

@workspace Build me a complete full-stack web application from scratch inside this workspace. Follow every instruction exactly. Do not skip any file. Create all files and folders as specified.

---

## PROJECT OVERVIEW

A student portal for LNM Institute of Information Technology (LNMIIT), Jaipur.
Students enter their college roll number (e.g. 24UCS134) and the app fetches their
United India Insurance Company (UIIC) health insurance card from a PostgreSQL database
and displays it on screen — matching the design of the real physical card issued by the college.
The student can also download the card as a PDF or PNG image.

---

## TECH STACK

- Frontend: React 18 + Vite + TailwindCSS v4.2
- Backend: Node.js + Express
- Database: PostgreSQL (via node-postgres `pg` package)
- PDF Export: html2canvas + jsPDF
- Fonts (via Google Fonts in index.html): Bebas Neue, DM Sans, JetBrains Mono

---

## FOLDER STRUCTURE TO CREATE

```
insurance-portal/
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── .env.example
│   ├── db/
│   │   ├── index.js
│   │   └── schema.sql
│   ├── routes/
│   │   └── students.js
│   └── controllers/
│       └── studentController.js
│
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css
        ├── api.js
        └── components/
            ├── InsuranceCard.jsx
            └── SearchBar.jsx
```

---

## BACKEND — Create these files exactly

### backend/package.json
```json
{
  "name": "insurance-portal-backend",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "pg": "^8.11.3"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  }
}
```

### backend/.env.example
```
PORT=5000
FRONTEND_URL=http://localhost:5173
DB_HOST=localhost
DB_PORT=5432
DB_NAME=insurance_portal
DB_USER=postgres
DB_PASSWORD=your_password_here
```

### backend/db/index.js
```js
const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || "insurance_portal",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "password",
});

pool.on("connect", () => console.log("✅ Connected to PostgreSQL"));
pool.on("error", (err) => console.error("❌ DB error:", err));

module.exports = pool;
```

### backend/db/schema.sql
```sql
DROP TABLE IF EXISTS students;

CREATE TABLE students (
  id             SERIAL PRIMARY KEY,
  roll_no        VARCHAR(20)  UNIQUE NOT NULL,
  card_no        VARCHAR(40)  NOT NULL,
  name           VARCHAR(100) NOT NULL,
  gender         CHAR(1)      NOT NULL CHECK (gender IN ('M','F','O')),
  age            INTEGER      NOT NULL,
  corporate_name VARCHAR(20)  DEFAULT 'LNMIIT',
  valid_from     DATE         NOT NULL,
  branch         VARCHAR(10),
  year           INTEGER,
  created_at     TIMESTAMP    DEFAULT NOW()
);

CREATE INDEX idx_students_roll_no ON students(UPPER(roll_no));

INSERT INTO students (roll_no, card_no, name, gender, age, corporate_name, valid_from, branch, year) VALUES
  ('24UCS134', 'JPR-UI-L0376-001-0005590-A', 'ANTRIKSH NAHAR', 'M', 19, 'LNMIIT', '2025-09-01', 'UCS', 1),
  ('24UCS101', 'JPR-UI-L0376-001-0005501-A', 'AARAV SHARMA',   'M', 19, 'LNMIIT', '2025-09-01', 'UCS', 1),
  ('24UCS102', 'JPR-UI-L0376-001-0005502-A', 'PRIYA VERMA',    'F', 18, 'LNMIIT', '2025-09-01', 'UCS', 1),
  ('24UEC201', 'JPR-UI-L0376-001-0005601-A', 'RAHUL GUPTA',    'M', 20, 'LNMIIT', '2025-09-01', 'UEC', 2),
  ('23UCS110', 'JPR-UI-L0376-001-0004510-A', 'SNEHA JOSHI',    'F', 20, 'LNMIIT', '2025-09-01', 'UCS', 2),
  ('22UME301', 'JPR-UI-L0376-001-0003701-A', 'VIKRAM SINGH',   'M', 21, 'LNMIIT', '2025-09-01', 'UME', 3);
```

### backend/controllers/studentController.js
```js
const pool = require("../db");

const getStudentByRollNo = async (req, res) => {
  const { rollNo } = req.params;
  if (!rollNo?.trim()) return res.status(400).json({ error: "Roll number is required" });
  try {
    const result = await pool.query(
      "SELECT * FROM students WHERE UPPER(roll_no) = UPPER($1)",
      [rollNo.trim()]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Student not found" });
    const s = result.rows[0];
    return res.json({
      card_no: s.card_no, name: s.name, gender: s.gender,
      age: s.age, roll_no: s.roll_no, corporate_name: s.corporate_name,
      valid_from: s.valid_from, branch: s.branch, year: s.year,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getAllStudents = async (req, res) => {
  try {
    const result = await pool.query("SELECT roll_no, name, branch, year FROM students ORDER BY roll_no");
    return res.json(result.rows);
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getStudentByRollNo, getAllStudents };
```

### backend/routes/students.js
```js
const express = require("express");
const router = express.Router();
const { getStudentByRollNo, getAllStudents } = require("../controllers/studentController");

router.get("/", getAllStudents);
router.get("/:rollNo", getStudentByRollNo);

module.exports = router;
```

### backend/server.js
```js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const studentRoutes = require("./routes/students");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));
app.use(express.json());
app.use("/api/students", studentRoutes);
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
```

---

## FRONTEND — Create these files exactly

### frontend/package.json
```json
{
  "name": "insurance-portal-frontend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "html2canvas": "^1.4.1",
    "jspdf": "^2.5.1",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.4.0",
    "vite": "^5.0.8"
  }
}
```

### frontend/vite.config.js
```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": { target: "http://localhost:5000", changeOrigin: true },
    },
  },
});
```

### frontend/tailwind.config.js
```js
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Bebas Neue'", "cursive"],
        body: ["'DM Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: 0, transform: "translateY(24px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        cardFlip: {
          "0%": { opacity: 0, transform: "rotateY(-15deg) scale(0.95)" },
          "100%": { opacity: 1, transform: "rotateY(0deg) scale(1)" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.6s ease forwards",
        cardFlip: "cardFlip 0.5s ease forwards",
      },
    },
  },
  plugins: [],
};
```

### frontend/postcss.config.js
```js
export default {
  plugins: { tailwindcss: {}, autoprefixer: {} },
};
```

### frontend/index.html
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>LNMIIT Insurance Portal</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

### frontend/src/index.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

* { box-sizing: border-box; }

body {
  margin: 0;
  font-family: "DM Sans", sans-serif;
  background: #0d1117;
  color: #fff;
  min-height: 100vh;
}

::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: #0d1117; }
::-webkit-scrollbar-thumb { background: #2d7a3a; border-radius: 3px; }
```

### frontend/src/main.jsx
```jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode><App /></React.StrictMode>
);
```

### frontend/src/api.js
```js
const BASE_URL = import.meta.env.VITE_API_URL || "/api";

export async function fetchStudentByRollNo(rollNo) {
  const res = await fetch(`${BASE_URL}/students/${encodeURIComponent(rollNo)}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to fetch student");
  return data;
}
```

### frontend/src/components/SearchBar.jsx
Build a React search bar component with:
- A controlled text input that auto-uppercases input, placeholder "Enter Roll No. (e.g. 24UCS134)", monospace font (JetBrains Mono), max 20 chars
- A search icon (SVG) inside the input on the left
- A submit button labelled "Fetch Card" with a search SVG icon; shows a spinning loader SVG when `loading` prop is true
- Button is disabled when input is empty or loading
- On submit calls `onSearch(rollNo)` prop
- Dark glass-morphism styling: input has dark semi-transparent background, green border that glows on focus, white text
- Button has a green gradient background, white text, rounded-xl
- Props: `onSearch` (function), `loading` (boolean)

### frontend/src/components/InsuranceCard.jsx

Build a React component that renders a PIXEL-PERFECT replica of the United India Insurance Company health insurance card. The card is 700px wide, split into LEFT and RIGHT panels side by side, with NO React props other than `student` object.

**The `student` prop shape:**
```js
{
  card_no: "JPR-UI-L0376-001-0005590-A",
  name: "ANTRIKSH NAHAR",
  gender: "M",
  age: 19,
  roll_no: "24UCS134",
  corporate_name: "LNMIIT",
  valid_from: "2025-09-01T00:00:00.000Z",
  branch: "UCS",
  year: 1
}
```

**LEFT PANEL (310px wide):**
- Background: soft green-to-cream gradient (`linear-gradient(160deg, #f0f8f1, #e8f5ea, #f5f0e8)`)
- Top header: "UNITED INDIA INSURANCE COMPANY LTD" in bold dark navy uppercase (DM Sans 800 weight), next to a circular deep-blue UIIC logo badge (SVG, navy blue circle with gold border, white shield/crest inside)
- A thin green-to-transparent divider line below the header
- Info rows — each row has: label (110px wide, grey, 11.5px), colon separator, value (bold for Card No. and Name, medium for others):
  - Card No. → student.card_no (bold, letter-spaced)
  - Name → student.name (bold)
  - Gender → student.gender
  - Age → `${student.age} Years`
  - Employee Code → student.roll_no
  - Corporate Name → student.corporate_name
  - Valid From → date formatted as DD-MM-YYYY
- Bottom: thin divider, then Vidal Health logo (green diamond SVG icon + "VIDAL HEALTH" bold navy + "Insurance Third Party Administrator" subtitle small grey text)
- Two decorative semi-transparent green circles (one bottom-left, one top-right), z-index behind content
- Subtle box shadow on the whole card

**RIGHT PANEL (flex: 1):**
- Background: pure white
- Left border: 3px solid #2d7a3a
- Top-right: Vidal Health logo (same as left panel bottom)
- **Note section** with bold "Note:" heading and 5 bullet points:
  1. Submit this card & a photo ID for availing cashless at network hospitals.
  2. Cashless facility is subject to approval by Vidal Health as per policy terms & conditions.
  3. Valid of this card is subject to valid policy / renewal of policy.
  4. Inform Vidal Health immediately upon hospitalisation.
  5. For quick access of e-cards, policy details, claims, hospital list and more, give a missed call to 022-4892-6099.
- Thin grey divider
- **24x7 Dedicated Helpline No:** heading, then these region+number rows (green checkmark bullet, region label 130px wide, monospace numbers):
  - Karnataka/Andhra Pradesh/Telangana: 080-46267018 / 18004250251
  - North and East region/Gujarat: 080-46267068 / 18004250261
  - Maharashtra: 080-46267021 / 18004250254
  - Tamil Nadu: 080-46267019 / 18004250253
  - Kerala: 080-46267017 / 18004250252
  - Sr. Citizen: 080-46267070 / 18001203348
- Thin grey divider
- **If found, please return to:** section with address text in small font, email and website in green
- Bottom-right: a decorative QR code SVG placeholder (7x7 grid of squares with corner registration marks) + caption "Scan QR code to download Vidal Health Mobile App"

Use only inline styles (no Tailwind inside this component) so html2canvas captures it correctly for PDF download.

### frontend/src/App.jsx

Build the main app page with:

**Visual design:** Dark theme (#0d1117 background), radial green glow at top, decorative blurred circles in background.

**Header section:**
- An animated green pill badge: pulsing green dot + "LNM Institute of Information Technology" text
- Large title "Insurance Card Portal" in Bebas Neue font, 52px, white
- Subtitle: "Enter your roll number to retrieve your United India Insurance e-card" in grey

**State:** `student` (null), `loading` (false), `error` (""), `downloading` (false). A `cardRef` useRef attached to the card wrapper div.

**Search:** Render the `<SearchBar>` component. On search, call `fetchStudentByRollNo(rollNo)`, set student on success, set error message on failure.

**Error display:** If error, show a red-tinted box with an alert SVG icon and the error message.

**On student found — show:**
1. A row of 4 stat tiles (dark glass card style, green border):
   - 🎓 Branch → student.branch
   - 📅 Year → e.g. "1st Year"
   - 🏥 Insurer → "UIIC"
   - ✅ Status → "Active"
2. The `<InsuranceCard student={student} />` centered, wrapped in a div with `ref={cardRef}`, with `animate-cardFlip` class
3. Two download buttons side by side:
   - **"Download PDF"** (green gradient, white text) — on click: use html2canvas on cardRef.current (scale: 3), then jsPDF landscape, save as `Insurance_Card_STUDENTNAME.pdf`. Import html2canvas and jsPDF dynamically.
   - **"Save as Image"** (transparent bg, green border/text) — same but save as PNG via canvas.toDataURL + anchor click
   - Both buttons show "Generating..." and are disabled while `downloading` is true
4. Small disclaimer text below: "This is a digital copy of your insurance card. Present it along with a valid photo ID at network hospitals."

**Empty state:** When no student and no error, show a faint card SVG icon centered with text "Your insurance card will appear here"

Apply `animate-fadeUp` to header and search bar sections with staggered animation-delay.

---

## SETUP INSTRUCTIONS (add as comments at top of backend/server.js)

```
// SETUP:
// 1. cd backend && cp .env.example .env  (fill in DB password)
// 2. psql -U postgres -d insurance_portal -f db/schema.sql
// 3. npm install && npm run dev
// Frontend: cd frontend && npm install && npm run dev
// Open: http://localhost:5173  — type 24UCS134 to test
```

---

## FINAL INSTRUCTIONS FOR COPILOT

1. Create ALL files and folders listed above. Do not skip any.
2. For files with full code blocks above — use that code EXACTLY.
3. For files with descriptions (SearchBar, InsuranceCard, App) — implement them fully and correctly based on the description.
4. After creating all files, run `npm install` in both `backend/` and `frontend/` directories.
5. Do not add any extra dependencies not listed.
6. Do not simplify or stub out any component — build everything fully.
7. The InsuranceCard component must use only inline styles (no Tailwind classes inside it).
8. The card must visually match a real UIIC insurance card with left green panel and right white panel.
