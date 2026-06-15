import 'dotenv/config';
import { connectDB } from '../config/db.js';
import { runSeed } from './runSeed.js';

const seed = async () => {
  await connectDB();
  const result = await runSeed({ clear: true });
  console.log('Admin:', result.admin, '/ password: admin123');
  console.log(`Seeded: ${result.blocks} zones, ${result.rooms} rooms, ${result.residents} residents`);
  process.exit(0);
};

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
