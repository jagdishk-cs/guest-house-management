# Database Setup — MongoDB (Permanent Storage)

All application data is stored in **real MongoDB collections** via Mongoose. There is no in-memory database, no mock JSON, and no browser localStorage for business data.

## Collections

| Collection | Stores |
|------------|--------|
| `admins` | Admin accounts (login) |
| `guesthouses` | Guest houses & bachelor quarter blocks |
| `rooms` | Room allocation status, resident link, rent |
| `residents` | Resident profiles, current room, history |
| `complaints` | Complaint tickets |
| `activities` | Dashboard activity log |

Data persists across browser refresh, server restart, and redeploy as long as the MongoDB database is available.

---

## Option A — MongoDB Atlas (Cloud, recommended)

1. Create a free cluster at [https://www.mongodb.com/atlas](https://www.mongodb.com/atlas)
2. **Database Access** → Add user with password
3. **Network Access** → Add IP `0.0.0.0/0` (dev) or your server IP (production)
4. **Connect** → Drivers → copy connection string
5. Edit `backend/.env`:

```env
MONGODB_URI=mongodb+srv://YOUR_USER:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/guest_house_db?retryWrites=true&w=majority
JWT_SECRET=change_this_to_a_long_random_string
AUTO_SEED_ON_EMPTY=true
```

6. Seed and start:

```powershell
cd backend
npm install
npm run seed
npm run dev
```

---

## Option B — Local MongoDB Community Server

1. Download and install [MongoDB Community Server](https://www.mongodb.com/try/download/community)
2. Start the MongoDB service (Windows: Services → **MongoDB Server** → Start)
3. Edit `backend/.env`:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/guest_house_db
JWT_SECRET=change_this_to_a_long_random_string
AUTO_SEED_ON_EMPTY=true
```

4. Seed and start:

```powershell
cd backend
npm run seed
npm run dev
```

---

## Verify connection

```powershell
curl http://localhost:5000/api/health
```

Expected when connected:

```json
{
  "ok": true,
  "database": "connected",
  "name": "guest_house_db",
  "host": "..."
}
```

---

## Seed & reset

| Command | Purpose |
|---------|---------|
| `npm run seed` | Clear and reload sample campus data + admin user |
| First server start (empty DB) | Auto-seeds if `AUTO_SEED_ON_EMPTY=true` |

**Demo login after seed:** `admin@guesthouse.com` / `admin123`

---

## Production notes

- Set `AUTO_SEED_ON_EMPTY=false` in production `.env`
- Use a strong `JWT_SECRET`
- Use MongoDB Atlas with IP allowlist restricted to your server
- Never commit `backend/.env` to git
