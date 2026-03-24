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
