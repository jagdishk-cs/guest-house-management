import { useEffect, useState } from 'react';
import { QrCode, User, Phone, Building2, BadgeCheck, Briefcase } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { ROOM_STATUS } from '../../utils/constants';
import { roomAPI } from '../../services/api';
export default function RoomModal({ room, open, onClose, onAction }) {
  const [qr, setQr] = useState('');

  useEffect(() => {
    if (open && room?._id) {
      roomAPI.qrcode(room._id).then((res) => setQr(res.data.data)).catch(() => setQr(''));
    }
  }, [open, room?._id]);

  if (!room) return null;

  const resident = room.resident;
  const statusInfo = ROOM_STATUS[room.status];

  return (
    <Modal open={open} onClose={onClose} title={`Room ${room.roomNumber}`} size="lg">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <span className={`rounded-full px-3 py-1 text-sm font-medium text-white ${statusInfo?.color}`}>
            {statusInfo?.label}
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm dark:bg-slate-800">
            {room.guestHouse?.blockName || '—'}
          </span>
        </div>

        {!resident || typeof resident !== 'object' ? (
          <div className="rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50 p-8 text-center dark:border-emerald-800 dark:bg-emerald-900/20">
            <p className="text-lg font-semibold text-emerald-700 dark:text-emerald-400">
              Room Currently Vacant
            </p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            <Detail icon={User} label="Resident" value={resident.name} />
            <Detail icon={BadgeCheck} label="Poornata ID" value={resident.poornataId || '—'} />
            <Detail icon={Briefcase} label="Designation" value={resident.designation || '—'} />
            <Detail icon={Building2} label="Department" value={resident.department || room.department || '—'} />
            <Detail icon={Phone} label="Phone No" value={resident.phone} />
          </div>
        )}

        {qr && (
          <div className="flex flex-col items-center rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
            <QrCode className="mb-2 text-indigo-500" size={20} />
            <img src={qr} alt="Room QR" className="h-32 w-32" />
            <p className="mt-2 text-xs text-slate-500">Scan for room details</p>
          </div>
        )}

        <div className="flex flex-wrap gap-2 border-t pt-4 dark:border-slate-700">
          {room.status !== 'maintenance' && (
            <Button variant="secondary" onClick={() => onAction?.('maintenance', room)}>
              Mark Maintenance
            </Button>
          )}
          {room.status === 'occupied' && (
            <Button variant="secondary" onClick={() => onAction?.('vacate', room)}>
              Vacate Room
            </Button>
          )}
          {room.status === 'vacant' && (
            <Button onClick={() => onAction?.('assign', room)}>Assign Resident</Button>
          )}
        </div>
      </div>
    </Modal>
  );
}

function Detail({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50">
      <Icon size={18} className="mt-0.5 text-indigo-500" />
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="font-medium capitalize">{value}</p>
      </div>
    </div>
  );
}
