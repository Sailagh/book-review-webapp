# Book Review Web App (Node.js + Express)

## Overview
Backend-driven web application for browsing books and posting reviews.
Users can register/login and manage their own reviews. The project was created as a school assignment to practice backend fundamentals (routing, templates, sessions, and database integration).

## Key features
- Browse list of books and existing reviews
- User authentication (sessions)
- Logged-in users can add books and write reviews
- Users can edit/delete their own reviews
- Basic admin routes/pages (work in progress)

## Tech stack
- Node.js + Express
- EJS templates (server-side rendering)
- MySQL (database)
- express-session + MySQL session store
- HTML/CSS/JS (static assets in `/public`)

## Project structure
- `app.js` – application entry point
- `routes/` – routing (books, reviews, auth, admin)
- `views/` – EJS templates (pages)
- `public/` – static files (CSS, images, client JS)
- `utils/` – helper modules (DB handling, etc.)

## How to run locally
1. Install dependencies:
   ```bash
   npm install
