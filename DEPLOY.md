# Share the App With Anyone

One link → same data for everyone (with MongoDB Atlas).

---

## Option 1 — Share on your WiFi (fastest, no signup)

Anyone on the **same network** can open the app:

```powershell
.\scripts\share.ps1
```

Or:

```powershell
npm run install:all
npm run share
```

The terminal prints links like:

```
→ http://localhost:5000
→ http://192.168.1.42:5000    ← share this with others on your WiFi
```

**Phone:** open the `192.168.x.x` link → menu → **Install app** / **Add to Home Screen**.

> Data is stored on **your PC’s MongoDB**. Others only see it while your PC is running and MongoDB is up.

---

## Option 2 — Public link for anyone on the internet (recommended)

Use **MongoDB Atlas** (free cloud DB) + **Render** (free hosting).

### Step 1 — MongoDB Atlas

1. [mongodb.com/atlas](https://www.mongodb.com/atlas) → free cluster
2. Database Access → create user + password
3. Network Access → **Allow access from anywhere** (`0.0.0.0/0`)
4. Connect → copy connection string, e.g.  
   `mongodb+srv://USER:PASS@cluster.mongodb.net/guest_house_db`

### Step 2 — Deploy to Render

1. Push this project to **GitHub**
2. [render.com](https://render.com) → **New** → **Blueprint** → select repo  
   (uses `render.yaml` in the repo root)
3. In Render dashboard, set:
   - `MONGODB_URI` = your Atlas string
   - `JWT_SECRET` = any long random string
4. Deploy → you get a URL like `https://guest-house-app.onrender.com`

Share that URL. Everyone gets the **same database**.

**Login:** `admin@guesthouse.com` / `admin123`

---

## Option 3 — Docker

```powershell
docker build -t guest-house .
docker run -p 5000:5000 -e MONGODB_URI="your_atlas_uri" -e JWT_SECRET="secret" guest-house
```

---

## Install as phone / desktop app (PWA)

After opening the shared link:

| Platform | How to install |
|----------|----------------|
| Android Chrome | ⋮ menu → **Install app** |
| iPhone Safari | Share → **Add to Home Screen** |
| Desktop Chrome | Address bar → install icon |

The app opens full-screen like a native app and always loads live data from the server.
