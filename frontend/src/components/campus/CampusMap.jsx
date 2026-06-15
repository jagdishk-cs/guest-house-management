import { useState } from 'react';
import { motion } from 'framer-motion';
import { Dumbbell, Droplets, Trees, ZoomIn, ZoomOut } from 'lucide-react';
import Building3D, { Facility3D } from './Building3D';
import { RoomTooltip } from './RoomCard';
import { CAMPUS_ZONES } from './campusConfig';

export default function CampusMap({ groupedRooms, onRoomSelect }) {
  const [zoom, setZoom] = useState(1);
  const [hoveredRoom, setHoveredRoom] = useState(null);
  const [pinnedRoom, setPinnedRoom] = useState(null);

  const activeRoom = pinnedRoom || hoveredRoom;

  const handleRoom = (room) => {
    setPinnedRoom((prev) => (prev?._id === room?._id ? null : room));
    onRoomSelect?.(room);
  };

  const clampZoom = (v) => Math.min(1.15, Math.max(0.72, v));

  return (
    <div className="relative overflow-hidden rounded-2xl">
      {/* Zoom controls */}
      <div className="absolute right-3 top-3 z-20 flex gap-1">
        <button
          type="button"
          onClick={() => setZoom((z) => clampZoom(z - 0.08))}
          className="rounded-lg bg-white/80 p-2 shadow-md backdrop-blur hover:bg-white dark:bg-slate-800/90"
          aria-label="Zoom out"
        >
          <ZoomOut size={16} />
        </button>
        <button
          type="button"
          onClick={() => setZoom((z) => clampZoom(z + 0.08))}
          className="rounded-lg bg-white/80 p-2 shadow-md backdrop-blur hover:bg-white dark:bg-slate-800/90"
          aria-label="Zoom in"
        >
          <ZoomIn size={16} />
        </button>
      </div>

      <motion.div
        style={{ scale: zoom }}
        className="campus-ground origin-center p-3 sm:p-5 md:p-6"
      >
        <div className="campus-layout mx-auto max-w-4xl">
          {/* —— Row 1: Utilities | Road | Guest Houses stack —— */}
          <div className="campus-row campus-row-top">
            <div className="campus-cell campus-utilities flex flex-col justify-between gap-3">
              <Facility3D
                label="Water Tank"
                sublabel="RO Plant · 1.20KL"
                icon={Droplets}
                accent="from-sky-500 to-blue-800"
              />
              <Facility3D
                label="Gym"
                sublabel="Fitness Center"
                icon={Dumbbell}
                accent="from-rose-500 to-orange-700"
              />
            </div>

            <div className="campus-road campus-road-vertical hidden sm:block" aria-hidden />

            <div className="campus-cell campus-gh-stack flex flex-col gap-3 sm:gap-4">
              <Building3D
                zoneKey="gh1"
                rooms={groupedRooms.gh1}
                capacity={CAMPUS_ZONES.gh1.roomCapacity}
                activeRoomId={activeRoom?._id}
                onRoomSelect={handleRoom}
                onRoomHover={setHoveredRoom}
              />
              <Building3D
                zoneKey="gh2"
                rooms={groupedRooms.gh2}
                capacity={CAMPUS_ZONES.gh2.roomCapacity}
                activeRoomId={activeRoom?._id}
                onRoomSelect={handleRoom}
                onRoomHover={setHoveredRoom}
              />
            </div>
          </div>

          {/* Horizontal road */}
          <div className="campus-road campus-road-horizontal my-2 sm:my-3" aria-hidden />

          {/* —— Row 2: BQ-A spanning center —— */}
          <div className="campus-row">
            <div className="campus-cell col-span-full">
              <Building3D
                zoneKey="bqa"
                rooms={groupedRooms.bqa}
                capacity={CAMPUS_ZONES.bqa.roomCapacity}
                activeRoomId={activeRoom?._id}
                onRoomSelect={handleRoom}
                onRoomHover={setHoveredRoom}
                className="w-full"
              />
            </div>
          </div>

          <div className="campus-road campus-road-horizontal my-2 sm:my-3" aria-hidden />

          {/* —— Row 3: Garden center + GH3 right —— */}
          <div className="campus-row campus-row-garden">
            <div className="campus-cell campus-garden col-span-1 sm:col-span-2">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="campus-garden-patch relative flex h-full min-h-[72px] flex-col items-center justify-center overflow-hidden rounded-xl border border-emerald-400/30 sm:min-h-[88px]"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/30 via-green-500/20 to-teal-600/30" />
                <Trees className="relative z-10 text-emerald-700 dark:text-emerald-300" size={28} />
                <span className="relative z-10 mt-1 text-xs font-bold tracking-wide text-emerald-800 dark:text-emerald-200">
                  GARDEN
                </span>
                <div className="campus-garden-grid absolute inset-0 opacity-30" />
              </motion.div>
            </div>

            <div className="campus-road campus-road-vertical hidden sm:block" aria-hidden />

            <div className="campus-cell flex items-end justify-center sm:justify-end">
              <Building3D
                zoneKey="gh3"
                rooms={groupedRooms.gh3}
                capacity={CAMPUS_ZONES.gh3.roomCapacity}
                activeRoomId={activeRoom?._id}
                onRoomSelect={handleRoom}
                onRoomHover={setHoveredRoom}
              />
            </div>
          </div>

          <div className="campus-road campus-road-horizontal my-2 sm:my-3" aria-hidden />

          {/* —— Row 4: BQ-B —— */}
          <div className="campus-row">
            <div className="campus-cell col-span-full">
              <Building3D
                zoneKey="bqb"
                rooms={groupedRooms.bqb}
                capacity={CAMPUS_ZONES.bqb.roomCapacity}
                activeRoomId={activeRoom?._id}
                onRoomSelect={handleRoom}
                onRoomHover={setHoveredRoom}
                className="w-full"
              />
            </div>
          </div>

          {/* Perimeter road hint */}
          <div className="campus-perimeter mt-3 hidden rounded-xl border-2 border-dashed border-slate-400/20 sm:block" />
        </div>
      </motion.div>

      {/* Floating room detail card */}
      {activeRoom && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-3 left-3 right-3 z-30 sm:left-auto sm:right-14 sm:w-64"
        >
          <RoomTooltip room={activeRoom} />
        </motion.div>
      )}
    </div>
  );
}
