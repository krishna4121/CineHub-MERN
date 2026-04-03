# CineHub MERN

A MERN-style movie browsing project with:

- React frontend
- Express API
- MongoDB for users and purchases
- TMDB as the movie content source
- Mock Razorpay flow for learning and local testing

## Features

- MongoDB-backed sign up and sign in
- Session-based auth with cookies
- Movie home feed, details, cast, similar titles, recommendations
- Backend-powered search
- Purchase history stored in MongoDB
- Mock payment flow for rent and buy flows

## Tech Stack

- Frontend: React, React Router, Tailwind CSS, Headless UI
- Backend: Node.js, Express, Mongoose
- Database: MongoDB Atlas
- External content: TMDB API

## Environment Setup

Create a root `.env` file based on `.env.example`.

Required variables:

```env
API_PORT=5001
CLIENT_URL=http://localhost:3000
ATLASDB_URL=your-mongodb-uri
JWT_SECRET=your-random-secret
REACT_APP_API_URL=http://localhost:5001/api
TMDB_BEARER_TOKEN=your-tmdb-bearer-token
PAYMENT_PROVIDER=mock
RAZORPAY_KEY_ID=optional-for-real-razorpay
RAZORPAY_KEY_SECRET=optional-for-real-razorpay
```

Notes:

- `PAYMENT_PROVIDER=mock` keeps payments in learning mode.
- `TMDB_BEARER_TOKEN` is required because movie data is fetched server-side.
- `.env` is ignored by git and should not be committed.

## Installation

```bash
npm install
```

## Run Locally

```bash
npm run dev
```

This starts:

- React app on `http://localhost:3000`
- Express API on `http://localhost:5001`

## Build

```bash
npm run build
```

## API Overview

Auth:

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

Content:

- `GET /api/content/home`
- `GET /api/content/movies/:id`
- `GET /api/content/plays`
- `GET /api/content/stream`
- `GET /api/content/tv/popular`
- `GET /api/content/search?q=...`

Payments:

- `GET /api/payments/history`
- `POST /api/payments/orders`
- `POST /api/payments/verify`

## Current Notes

- Movie catalog data is not stored in MongoDB. It comes from TMDB through the backend.
- User and purchase data are stored in MongoDB.
- Payment flow is intentionally mock-friendly for learning purposes.
