# CampusPulse — Student Academic Risk & Success Dashboard

A full-stack web app that helps students track their academic performance, identify at-risk courses, and forecast what marks they need to hit their goals. Built from scratch to learn the entire stack — not from a tutorial.

## Live demo
**https://campuspulse-mu-eight.vercel.app**

Sign up with any email and password to try it — email confirmation is currently disabled for frictionless demo access (see note below).

## What it does

CampusPulse goes beyond just displaying marks — it analyzes the data and produces real insights:

- **Automatic weighted averages** — enter assessment marks and weights, get an accurate course average instantly
- **Risk scoring** — each course is flagged Low / Medium / High risk based on current performance
- **Performance trends** — tracks whether a course is improving, declining, or stable over time
- **What-If Calculator** — "I need 60% overall, what do I need on the final exam?" — the app calculates it
- **Dashboard overview** — overall average, course count, risk level, and an at-a-glance "Courses at Risk" list

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), React Router |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Backend / Database | Supabase (PostgreSQL, Auth, Row Level Security) |
| Email | Resend (SMTP), integrated with Supabase Auth |
| Deployment | Vercel |

## Key features

### Authentication & Security
- Signup / login / logout via Supabase Auth
- Protected routes — no access to any data without being logged in
- Row Level Security (RLS) policies enforced at the database level, not just in the app — each student can only ever read or write their own courses, assessments, and marks

### Academic Tracking
- Add courses, assessments (assignments/tests/exams), and marks directly through the UI
- Weighted average auto-calculated per course
- Validation prevents assessment weights from exceeding 100% per course
- Full edit/delete support for assessments and marks

### Risk Analysis
- Per-course risk scoring based on current weighted average
- Dashboard "Courses at Risk" summary
- Trend detection (Improving / Declining / Stable) comparing recent performance against historical average

### What-If Calculator
Given a target overall mark, calculates the exact average needed on remaining (ungraded) assessments to reach it — accounting for weighting, with clear feedback when a target is mathematically out of reach.

### Data Visualization
- Bar chart comparing performance across all courses
- Line charts showing cumulative average trends per course over time
- Color-coded progress bars and risk badges

## Database schema

profiles (id, full_name, degree, year_of_study)
courses (id, user_id, code, name)
assessments (id, course_id, name, type, weight)
marks (id, assessment_id, score, max_score, created_at)

Every table is protected by Row Level Security policies scoped to auth.uid(), so a query for another user's data returns nothing — enforced by Postgres itself, not just application logic.

## Running locally

git clone https://github.com/Nelson820/campuspulse.git
cd campuspulse
npm install

Create a .env file in the project root:

VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key

Then run:

npm run dev

## A note on email confirmation

Full email confirmation is implemented and tested end-to-end using Supabase Auth + Resend SMTP. It's currently disabled for the public demo, since Resend's free tier restricts delivery to a single verified sending address — a paid, verified domain would be required to enable it for arbitrary users. In production, this would be re-enabled with a verified sending domain.

## What's next
- Mobile-responsive layout refinements
- A machine learning model to predict pass/fail likelihood from historical performance, replacing the current rule-based risk scoring
- More sophisticated risk scoring (performance + assessment completion rate + trend combined)
- Verified custom sending domain to re-enable email confirmation for all users

## Author
Nelson Bhekiswayo — [GitHub](https://github.com/Nelson820)