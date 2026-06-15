export const ROOM_STATUS = {
  vacant: { label: 'Vacant', color: 'bg-emerald-500', text: 'text-emerald-700', ring: 'ring-emerald-400' },
  occupied: { label: 'Occupied', color: 'bg-red-500', text: 'text-red-700', ring: 'ring-red-400' },
  maintenance: { label: 'Maintenance', color: 'bg-amber-400', text: 'text-amber-700', ring: 'ring-amber-400' },
};

export const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { path: '/guest-houses', label: 'Blocks', icon: 'Building2' },
  { path: '/blueprint', label: 'Blueprint', icon: 'Map' },
  { path: '/rooms', label: 'Rooms', icon: 'DoorOpen' },
  { path: '/residents', label: 'Residents', icon: 'Users' },
  { path: '/complaints', label: 'Complaints', icon: 'MessageSquareWarning' },
];
