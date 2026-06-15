/**
 * Quick verification that the API persists data in MongoDB.
 * Usage: node scripts/verifyDb.js
 */
import 'dotenv/config';
import { connectDB, disconnectDB } from '../config/db.js';
import Admin from '../models/Admin.js';
import Room from '../models/Room.js';
import Resident from '../models/Resident.js';
import GuestHouse from '../models/GuestHouse.js';

const BASE = process.env.API_BASE || 'http://localhost:5000/api';

async function api(path, opts = {}) {
  const headers = { 'Content-Type': 'application/json', ...opts.headers };
  const res = await fetch(`${BASE}${path}`, { ...opts, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `${path} → ${res.status}`);
  return data;
}

const run = async () => {
  await connectDB();
  console.log('MongoDB collections:');
  console.log('  admins:', await Admin.countDocuments());
  console.log('  guesthouses:', await GuestHouse.countDocuments());
  console.log('  rooms:', await Room.countDocuments());
  console.log('  residents:', await Resident.countDocuments());

  const health = await fetch(`${BASE.replace('/api', '')}/api/health`).then((r) => r.json());
  if (health.database !== 'connected') throw new Error('API health: database not connected');
  console.log('\nAPI health:', health.database, '→', health.name);

  const login = await api('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: 'admin@guesthouse.com', password: 'admin123' }),
  });
  const token = login.token;
  const auth = { Authorization: `Bearer ${token}` };

  const dash = await api('/dashboard/stats', { headers: auth });
  console.log('\nDashboard (from DB):', dash.stats);

  const rooms = await api('/rooms', { headers: auth });
  console.log('Rooms in DB:', rooms.data?.length);

  await disconnectDB();
  console.log('\n✓ MongoDB persistence verified');
};

run().catch((e) => {
  console.error('✗', e.message);
  process.exit(1);
});
