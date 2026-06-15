/** Send only writable fields — never populated MongoDB documents or metadata. */

export function roomPayload(form) {
  return {
    roomNumber: form.roomNumber,
    guestHouse: typeof form.guestHouse === 'object' ? form.guestHouse?._id : form.guestHouse,
    floor: Number(form.floor) || 1,
    department: form.department || '',
    rentAmount: Number(form.rentAmount) || 0,
    gridRow: Number(form.gridRow) || 0,
    gridCol: Number(form.gridCol) || 0,
    notes: form.notes || '',
  };
}

export function residentPayload(form) {
  return {
    name: form.name,
    phone: form.phone,
    poornataId: form.poornataId || '',
    designation: form.designation || '',
    department: form.department || '',
    email: form.email || '',
  };
}

export function guestHousePayload(form) {
  return {
    name: form.name,
    blockName: form.blockName,
    address: form.address || '',
    floors: Number(form.floors) || 1,
    campusZone: form.campusZone || undefined,
  };
}
