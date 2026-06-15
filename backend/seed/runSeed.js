import QRCode from 'qrcode';
import Admin from '../models/Admin.js';
import GuestHouse from '../models/GuestHouse.js';
import Resident from '../models/Resident.js';
import Room from '../models/Room.js';
import Complaint from '../models/Complaint.js';
import Activity from '../models/Activity.js';
import { logActivity } from '../utils/activityLogger.js';

/** Seed database (clears existing data). Call only when connected. */
export async function runSeed({ clear = true } = {}) {
  if (clear) {
    console.log('Clearing existing data...');
    await Promise.all([
      Admin.deleteMany(),
      GuestHouse.deleteMany(),
      Resident.deleteMany(),
      Room.deleteMany(),
      Complaint.deleteMany(),
      Activity.deleteMany(),
    ]);
  }

  const admin = await Admin.create({
    name: 'System Admin',
    email: 'admin@guesthouse.com',
    password: 'admin123',
  });

  const blocks = await GuestHouse.insertMany([
    { name: 'Campus Guest Houses', blockName: 'Guest House 1', address: 'East Wing', floors: 2, campusZone: 'gh1' },
    { name: 'Campus Guest Houses', blockName: 'Guest House 2', address: 'East Wing', floors: 2, campusZone: 'gh2' },
    { name: 'Campus Guest Houses', blockName: 'Guest House 3', address: 'South East', floors: 2, campusZone: 'gh3' },
    { name: 'Bachelor Quarters', blockName: 'Bachelor Quarter A', address: 'Central North', floors: 1, campusZone: 'bqa' },
    { name: 'Bachelor Quarters', blockName: 'Bachelor Quarter B', address: 'Central South', floors: 1, campusZone: 'bqb' },
  ]);

  const [gh1, gh2, gh3, bqa, bqb] = blocks;

  const residents = await Resident.insertMany([
    { name: 'Rahul Sharma', phone: '9876543210', poornataId: 'PN-10021', designation: 'Software Engineer', department: 'IT', email: 'rahul@email.com' },
    { name: 'Amit Patel', phone: '9876543211', poornataId: 'PN-10022', designation: 'HR Executive', department: 'Human Resources', email: 'amit@email.com' },
    { name: 'Vikram Singh', phone: '9876543212', poornataId: 'PN-10023', designation: 'Plant Supervisor', department: 'Operations' },
    { name: 'Suresh Kumar', phone: '9876543213', poornataId: 'PN-10024', designation: 'Accounts Officer', department: 'Finance' },
    { name: 'Deepak Mehta', phone: '9876543214', poornataId: 'PN-10025', designation: 'Trainee Engineer', department: 'IT' },
    { name: 'Priya Nair', phone: '9876543215', poornataId: 'PN-10026', designation: 'Quality Analyst', department: 'QA', email: 'priya@email.com' },
    { name: 'Karan Joshi', phone: '9876543216', poornataId: 'PN-10027', designation: 'Project Lead', department: 'Engineering' },
  ]);

  const roomConfigs = [
    { guestHouse: gh1._id, rooms: ['GH1-01', 'GH1-02', 'GH1-03', 'GH1-04'] },
    { guestHouse: gh2._id, rooms: ['GH2-01', 'GH2-02', 'GH2-03', 'GH2-04'] },
    { guestHouse: gh3._id, rooms: ['GH3-01', 'GH3-02', 'GH3-03', 'GH3-04'] },
    {
      guestHouse: bqa._id,
      rooms: ['BQ-A-01', 'BQ-A-02', 'BQ-A-03', 'BQ-A-04', 'BQ-A-05', 'BQ-A-06', 'BQ-A-07', 'BQ-A-08', 'BQ-A-09', 'BQ-A-10'],
    },
    {
      guestHouse: bqb._id,
      rooms: ['BQ-B-01', 'BQ-B-02', 'BQ-B-03', 'BQ-B-04', 'BQ-B-05', 'BQ-B-06', 'BQ-B-07', 'BQ-B-08', 'BQ-B-09', 'BQ-B-10'],
    },
  ];

  const assignPlan = {
    'GH1-01': 4,
    'GH2-02': 5,
    'GH3-01': 6,
    'BQ-A-01': 0,
    'BQ-A-02': 1,
    'BQ-A-04': 2,
    'BQ-B-03': 3,
  };

  const roomDocs = [];
  for (const cfg of roomConfigs) {
    let row = 0;
    let col = 0;
    for (let i = 0; i < cfg.rooms.length; i++) {
      const num = cfg.rooms[i];
      const status =
        num.includes('06') || num === 'GH2-03'
          ? 'maintenance'
          : assignPlan[num] !== undefined
            ? 'occupied'
            : 'vacant';
      const resident =
        status === 'occupied' && assignPlan[num] !== undefined ? residents[assignPlan[num]]._id : null;
      const res = assignPlan[num] !== undefined ? residents[assignPlan[num]] : null;
      roomDocs.push({
        roomNumber: num,
        guestHouse: cfg.guestHouse,
        floor: 1,
        status,
        resident,
        department: res?.department || '',
        joiningDate: status === 'occupied' ? new Date('2025-01-15') : null,
        rentStatus: status === 'occupied' ? 'paid' : 'pending',
        rentAmount: num.startsWith('BQ') ? 8500 : 12000,
        gridRow: row,
        gridCol: col,
        notes: status === 'maintenance' ? 'Scheduled maintenance' : '',
      });
      col++;
      if (col > (num.startsWith('BQ') ? 9 : 3)) {
        col = 0;
        row++;
      }
    }
  }

  const createdRooms = [];
  for (const r of roomDocs) {
    const room = await Room.create(r);
    const qr = await QRCode.toDataURL(`ROOM:${room.roomNumber}:${room._id}`);
    room.qrCode = qr;
    await room.save();
    createdRooms.push(room);
    if (r.resident) {
      const res = residents.find((x) => x._id.equals(r.resident));
      await Resident.findByIdAndUpdate(r.resident, {
        currentRoom: room._id,
        history: [{ roomNumber: room.roomNumber, guestHouse: room.guestHouse, joinDate: room.joiningDate }],
      });
    }
  }

  await Complaint.insertMany([
    {
      title: 'Water leakage',
      description: 'Bathroom tap leaking in BQ-A-02',
      status: 'open',
      resident: residents[1]._id,
      room: createdRooms.find((r) => r.roomNumber === 'BQ-A-02')?._id,
      guestHouse: bqa._id,
    },
    {
      title: 'WiFi not working',
      description: 'Internet disconnects in BQ-A-01',
      status: 'in_progress',
      resident: residents[0]._id,
      room: createdRooms.find((r) => r.roomNumber === 'BQ-A-01')?._id,
      guestHouse: bqa._id,
    },
  ]);

  await logActivity('Database Seeded', 'Campus layout: 3 GH + 2 BQ');
  await logActivity('Admin Login Ready', admin.email);

  return { blocks: blocks.length, rooms: createdRooms.length, residents: residents.length, admin: admin.email };
}
