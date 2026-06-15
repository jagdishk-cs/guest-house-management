import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';
import { getShareUrls } from './utils/networkUrls.js';
import authRoutes from './routes/authRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import guestHouseRoutes from './routes/guestHouseRoutes.js';
import roomRoutes from './routes/roomRoutes.js';
import residentRoutes from './routes/residentRoutes.js';
import complaintRoutes from './routes/complaintRoutes.js';

import Admin from './models/Admin.js';
import { runSeed } from './seed/runSeed.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 5000;
const serveFrontend =
  process.env.NODE_ENV === 'production' || process.env.SERVE_FRONTEND === 'true';
const frontendDist = path.join(__dirname, '../frontend/dist');

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  const connected = mongoose.connection.readyState === 1;
  res.json({
    ok: connected,
    database: connected ? 'connected' : 'disconnected',
    name: connected ? mongoose.connection.name : null,
    host: connected ? mongoose.connection.host : null,
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/guest-houses', guestHouseRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/residents', residentRoutes);
app.use('/api/complaints', complaintRoutes);

if (serveFrontend) {
  app.use(express.static(frontendDist, { maxAge: '1d', index: false }));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(frontendDist, 'index.html'), (err) => {
      if (err) next(err);
    });
  });
} else {
  app.get('/', (req, res) => {
    res.json({ message: 'Guest House Management API', version: '1.0.0' });
  });
}

app.use(errorHandler);

const start = async () => {
  await connectDB();

  const autoSeed = process.env.AUTO_SEED_ON_EMPTY !== 'false';
  const adminCount = await Admin.countDocuments();
  if (adminCount === 0 && autoSeed) {
    console.log('Empty database — running one-time seed (only on first run; user data is never auto-reset)...');
    const result = await runSeed({ clear: true });
    console.log(`Login: ${result.admin} / admin123`);
  } else if (adminCount === 0) {
    console.warn('Database is empty. Run: npm run seed');
  } else {
    console.log(`Database ready — ${adminCount} admin(s). Existing data preserved.`);
  }

  app.listen(PORT, '0.0.0.0', () => {
    const urls = getShareUrls(PORT);
    console.log('');
    console.log('═══════════════════════════════════════════════════');
    console.log('  Guest House Management — ready to share');
    console.log('═══════════════════════════════════════════════════');
    urls.forEach((url) => console.log(`  → ${url}`));
    if (serveFrontend) {
      console.log('');
      console.log('  Share any link above with people on your network.');
      console.log('  On phone: open link → browser menu → "Install app"');
    }
    console.log('');
    console.log('  Login: admin@guesthouse.com / admin123');
    console.log('═══════════════════════════════════════════════════');
    console.log('');
  });
};

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
