import { motion } from 'framer-motion';
import { ROOM_STATUS } from '../../utils/constants';

const statusStyles = {
  vacant: 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/30',
  occupied: 'bg-red-500 hover:bg-red-600 shadow-red-500/30',
  maintenance: 'bg-amber-400 hover:bg-amber-500 shadow-amber-400/30',
};

export default function RoomCell({ room, onClick }) {
  const style = statusStyles[room.status] || statusStyles.vacant;
  return (
    <motion.button
      whileHover={{ scale: 1.08, y: -4 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onClick(room)}
      className={`flex aspect-square min-h-[72px] flex-col items-center justify-center rounded-xl text-white shadow-lg transition ${style}`}
      title={`${room.roomNumber} - ${ROOM_STATUS[room.status]?.label}`}
    >
      <span className="text-xs font-bold opacity-80">ROOM</span>
      <span className="text-sm font-bold">{room.roomNumber}</span>
    </motion.button>
  );
}
