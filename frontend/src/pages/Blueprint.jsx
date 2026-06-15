import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import FloorBlueprint from '../components/blueprint/FloorBlueprint';
import RoomModal from '../components/rooms/RoomModal';
import AssignResidentModal from '../components/rooms/AssignResidentModal';
import Select from '../components/ui/Select';
import { guestHouseAPI, roomAPI } from '../services/api';
import { useStoreRevision } from '../context/DataContext';

export default function Blueprint() {
  const [params] = useSearchParams();
  const [blocks, setBlocks] = useState([]);
  const [blockId, setBlockId] = useState(params.get('block') || '');
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [assignRoom, setAssignRoom] = useState(null);
  const revision = useStoreRevision();

  const loadRooms = () => {
    if (!blockId) return;
    roomAPI
      .list({ guestHouse: blockId })
      .then((res) => setRooms(res.data.data))
      .catch(() => toast.error('Failed to load rooms'));
  };

  useEffect(() => {
    guestHouseAPI.list().then((res) => {
      setBlocks(res.data.data);
      if (!blockId && res.data.data[0]) setBlockId(res.data.data[0]._id);
    });
  }, [revision]);

  useEffect(() => {
    loadRooms();
  }, [blockId, revision]);

  // Refresh open room modal when data changes (assign, vacate, etc.)
  useEffect(() => {
    if (!selectedRoom?._id) return;
    roomAPI
      .get(selectedRoom._id)
      .then((res) => setSelectedRoom(res.data.data))
      .catch(() => setSelectedRoom(null));
  }, [revision, selectedRoom?._id]);

  const handleAction = async (action, room) => {
    if (action === 'assign') {
      setSelectedRoom(null);
      setAssignRoom(room);
      return;
    }
    try {
      if (action === 'maintenance') {
        await roomAPI.maintenance(room._id);
        toast.success('Marked for maintenance');
      } else if (action === 'vacate') {
        await roomAPI.vacate(room._id);
        toast.success('Room vacated');
      }
      setSelectedRoom(null);
    } catch {
      toast.error('Action failed');
    }
  };

  return (
    <div className="space-y-6">
      <Select
        label="Select Block"
        value={blockId}
        onChange={(e) => setBlockId(e.target.value)}
        options={[
          { value: '', label: 'Choose block...' },
          ...blocks.map((b) => ({ value: b._id, label: `${b.blockName} — ${b.name}` })),
        ]}
        className="max-w-md"
      />
      <FloorBlueprint rooms={rooms} onRoomClick={setSelectedRoom} />

      <RoomModal
        room={selectedRoom}
        open={!!selectedRoom && !assignRoom}
        onClose={() => setSelectedRoom(null)}
        onAction={handleAction}
      />

      <AssignResidentModal
        open={!!assignRoom}
        room={assignRoom}
        onClose={() => setAssignRoom(null)}
        onAssigned={() => {
          setAssignRoom(null);
          setSelectedRoom(null);
        }}
      />
    </div>
  );
}
