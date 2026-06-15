/** Campus zone keys — match guestHouse.campusZone in store */
export const CAMPUS_ZONES = {
  gh1: { key: 'gh1', label: 'Guest House 1', type: 'guest', roomCapacity: 4, accent: 'from-violet-500 to-purple-700' },
  gh2: { key: 'gh2', label: 'Guest House 2', type: 'guest', roomCapacity: 4, accent: 'from-violet-500 to-purple-700' },
  gh3: { key: 'gh3', label: 'Guest House 3', type: 'guest', roomCapacity: 4, accent: 'from-violet-500 to-purple-700' },
  bqa: { key: 'bqa', label: 'Bachelor Quarter A', type: 'bachelor', roomCapacity: 10, accent: 'from-indigo-500 to-blue-700' },
  bqb: { key: 'bqb', label: 'Bachelor Quarter B', type: 'bachelor', roomCapacity: 10, accent: 'from-indigo-500 to-blue-700' },
};

const ZONE_PATTERNS = [
  { zone: 'gh1', re: /guest\s*house\s*1|gh[\s-]*1/i },
  { zone: 'gh2', re: /guest\s*house\s*2|gh[\s-]*2/i },
  { zone: 'gh3', re: /guest\s*house\s*3|gh[\s-]*3/i },
  { zone: 'bqa', re: /bachelor\s*quarter\s*a|bq[\s-]*a|block\s*a/i },
  { zone: 'bqb', re: /bachelor\s*quarter\s*b|bq[\s-]*b|block\s*b/i },
];

/** Resolve which campus building a guest house record belongs to */
export function resolveCampusZone(guestHouse) {
  if (!guestHouse) return null;
  if (guestHouse.campusZone && CAMPUS_ZONES[guestHouse.campusZone]) {
    return guestHouse.campusZone;
  }
  const text = `${guestHouse.blockName || ''} ${guestHouse.name || ''}`;
  const hit = ZONE_PATTERNS.find((p) => p.re.test(text));
  return hit?.zone || null;
}

/** Group populated rooms by campus zone */
export function groupRoomsByZone(rooms, guestHouses) {
  const ghByZone = {};
  guestHouses.forEach((gh) => {
    const zone = resolveCampusZone(gh);
    if (zone) ghByZone[zone] = gh._id;
  });

  const grouped = Object.fromEntries(Object.keys(CAMPUS_ZONES).map((k) => [k, []]));

  rooms.forEach((room) => {
    const ghId = typeof room.guestHouse === 'object' ? room.guestHouse?._id : room.guestHouse;
    const zone = Object.entries(ghByZone).find(([, id]) => id === ghId)?.[0];
    if (zone && grouped[zone]) grouped[zone].push(room);
  });

  Object.keys(grouped).forEach((zone) => {
    grouped[zone].sort((a, b) =>
      String(a.roomNumber).localeCompare(String(b.roomNumber), undefined, { numeric: true })
    );
  });

  return grouped;
}

export function computeCampusStats(rooms) {
  const occupiable = rooms.filter((r) => r.status !== 'maintenance');
  const occupied = rooms.filter((r) => r.status === 'occupied').length;
  const available = rooms.filter((r) => r.status === 'vacant').length;
  const maintenance = rooms.filter((r) => r.status === 'maintenance').length;
  return {
    total: rooms.length,
    occupied,
    available,
    maintenance,
  };
}
