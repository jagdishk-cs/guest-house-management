# Guest House & Bachelor Room Management System

Full-stack admin system with **permanent MongoDB storage** — room allocations, residents, and all admin changes persist after refresh, browser close, and server restart.

## Tech Stack

| Layer | Stack |
|-------|--------|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion |
| Backend | Node.js, Express, JWT auth |
| Database | **MongoDB** (Atlas or Community Server) + Mongoose |

## Prerequisites

1. **Node.js** 18+
2. **MongoDB Atlas** cluster **or** **MongoDB Community Server** locally  
   → See **[DATABASE.md](./DATABASE.md)** for full setup

## Quick Start

### 1. Configure database

```powershell
cd backend
copy .env.example .env
# Edit .env — set MONGODB_URI (Atlas or local) and JWT_SECRET
```

### 2. Backend

```powershell
cd backend
npm install --strict-ssl=false
npm run seed
npm run dev
```

API: **http://localhost:5000**

### 3. Frontend

```powershell
cd frontend
npm install --strict-ssl=false
npm run dev
```

App: **http://localhost:5173** (proxies `/api` → backend)

### Demo Login

| Email | Password |
|-------|----------|
| `admin@guesthouse.com` | `admin123` |

## Data Persistence

- All CRUD goes to **MongoDB collections** via REST API
- Room status (vacant / occupied / maintenance) stored in `rooms` collection
- Resident assignments update `rooms` + `residents` atomically
- Dashboard stats computed live from the database
- Activity log stored in `activities` collection
- **No mock data, no localStorage store, no in-memory database**

## API

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Admin login |
| GET | `/api/dashboard/stats` | Dashboard metrics |
| CRUD | `/api/guest-houses` | Blocks / guest houses |
| CRUD | `/api/rooms` | Rooms + assign / vacate / maintenance |
| CRUD | `/api/residents` | Residents |
| CRUD | `/api/complaints` | Complaints |
| GET | `/api/health` | Database connection status |

Protected routes: `Authorization: Bearer <token>`

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `MongoDB connection failed` | Start local MongoDB or check Atlas URI / network access |
| Login fails | Run `npm run seed` in `backend` |
| Network errors in UI | Start backend before frontend |
| Data not saving | Confirm `/api/health` shows `"database": "connected"` |

See **[DATABASE.md](./DATABASE.md)** for Atlas and local MongoDB setup.
