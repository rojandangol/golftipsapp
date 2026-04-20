# Golf Tips App

A full-stack mobile application built as a senior capstone project. The app delivers categorized golf tips to users, with features like bookmarking, onboarding flows, text-to-speech, search, and account management.

> **Demo:**  — https://youtu.be/hRBsZwSBcgo?si=BYJpZGCGy0-mka3F 

## Tech Stack

| Layer | Technology |
| Frontend | React Native (Expo), TypeScript, NativeWind (Tailwind) |
| Backend | Node.js, Express.js (MVC architecture) |
| Database | MySQL |
| Auth | JWT (access + refresh tokens), HTTP-only cookies |
| Email | Nodemailer via Brevo SMTP |
| Caching | Redis |
| Security | Helmet, rate limiting, input validation |


## What's Included

### Frontend (`frontend_app/`) — Full Source
The entire frontend is included:
- **Screens & Navigation** — Expo Router with tab and sidebar layouts, onboarding flow, auth screens
- **Components** — Search, bookmarking, text-to-speech, skeleton loaders, accordion, theme toggling, and more
- **Context & Hooks** — User ID context, first-login tour hook, activity tracker
- **API Layer** — Axios instance with interceptors, API call helpers
- **Constants & Assets** — Icons, images, logos, color tokens

### Backend (`servercode/`) — Partial Source
The backend is partially included to demonstrate architecture. Client-specific business logic has been omitted out of respect for the client.

**Included:**
- `src/app.js` — Express server setup, middleware stack, routing wiring
- `src/models/` — All 4 database models (User, Tip, SavedTip, Token), showing schema design
- `src/routes/` — All route files, showing full REST API surface
- `src/middleware/` — Auth middleware, error handler, rate limiter, request logger, input validation
- `src/utils/` — Crypto helpers, logger, response handler
- `src/services/savedTip.service.js` — One full service file to show how the service layer connects models to controllers
- `src/jobs/tokenCleanup.js` — Background job for token expiry cleanup
- `src/config/constants.js` — App-wide constants
- `package.json` — Full dependency list

**Omitted to protect client's implementation:**
- `src/controllers/` — All 6 controllers (auth, user, tip, savedTip, password, admin)
- `src/services/` — All services except the one example above (auth, user, tip, password, admin, email, OTP, token)
- `src/config/database.js`, `email.js`, `redis.js` — Infrastructure configuration


## Architecture Overview

The backend follows a strict MVC + Service Layer pattern. Controllers handle HTTP concerns, Services contain business logic, and Models manage database queries directly via `mysql2`.

## Features

- User authentication with JWT access/refresh token rotation
- Categorized golf tips with search and filtering
- Bookmark/save tips per user
- Text-to-speech for tips
- Multi-step signup flow
- Forgot password with OTP email verification
- First-login onboarding tour
- Light/dark theme toggle
- Admin functionality
- Rate limiting and security hardening

## Notes

This project was built for a real client. The full backend source is not published publicly. The included backend files are sufficient to demonstrate the MVC architecture, API design, middleware patterns, and database modeling used throughout the project.