import { useEffect, useState } from 'react';
import { Plus, Search, Download, Pencil, Trash2, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { roomAPI, guestHouseAPI } from '../services/api';
import { useStoreRevision } from '../context/DataContext';
import { TableSkeleton } from '../components/ui/Skeleton';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Modal from '../components/ui/Modal';
import RoomModal from '../components/rooms/RoomModal';
import AssignResidentModal from '../components/rooms/AssignResidentModal';
import { exportToPDF, exportToExcel } from '../utils/exportData';
import { ROOM_STATUS } from '../utils/constants';
import { roomPayload } from '../utils/payloads';
import { getErrorMessage } from '../utils/getErrorMessage';

const statusLabel = (status) => ROOM_STATUS[status]?.label || status;

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [blockFilter, setBlockFilter] = useState('');
  const [residentSearch, setResidentSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [detailRoom, setDetailRoom] = useState(null);
  const [assignRoom, setAssignRoom] = useState(null);
  const [editRoom, setEditRoom] = useState(null);
  const revision = useStoreRevision();
  const [form, setForm] = useState({
    roomNumber: '',
    guestHouse: '',
    floor: 1,
    department: '',
    rentAmount: 8500,
    gridRow: 0,
    gridCol: 0,
  });

  const load = () => {
    setLoading(true);
    roomAPI
      .list({
        search: search || undefined,
        status: status || undefined,
        guestHouse: blockFilter || undefined,
        resident: residentSearch || undefined,
      })
      .then((res) => setRooms(res.data.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    guestHouseAPI.list().then((res) => setBlocks(res.data.data));
  }, [revision]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [search, status, blockFilter, residentSearch, revision]);

  // Keep open room detail in sync when data changes elsewhere
  useEffect(() => {
    if (!detailRoom?._id) return;
    roomAPI
      .get(detailRoom._id)
      .then((res) => setDetailRoom(res.data.data))
      .catch(() => setDetailRoom(null));
  }, [revision, detailRoom?._id]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const payload = roomPayload(form);
      if (editRoom) {
        await roomAPI.update(editRoom._id, payload);
        toast.success('Room updated — saved to database');
      } else {
        await roomAPI.create(payload);
        toast.success('Room added — saved to database');
      }
      setModalOpen(false);
      setEditRoom(null);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Save failed'));
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this room?')) return;
    try {
      await roomAPI.delete(id);
      toast.success('Deleted');
    } catch (err) {
      toast.error(getErrorMessage(err, 'Delete failed'));
    }
  };

  const getDepartment = (r) =>
    r.resident?.department || r.department || '—';

  const handleExport = async (type) => {
    try {
      const res = await roomAPI.list();
      const allRooms = res.data.data || [];
      const rows = allRooms.map((r) => [
        r.roomNumber,
        statusLabel(r.status),
        r.resident?.department || r.department || '—',
        r.resident?.name || '—',
      ]);
      if (type === 'pdf') {
        exportToPDF(
          'Rooms Report',
          ['Room No', 'Resident Status', 'Department', 'Resident'],
          rows,
          'rooms.pdf'
        );
      } else {
        exportToExcel(
          allRooms.map((r) => ({
            'Room No': r.roomNumber,
            'Resident Status': statusLabel(r.status),
            Department: r.resident?.department || r.department || '—',
            Resident: r.resident?.name || '—',
          })),
          'Rooms',
          'rooms.xlsx'
        );
      }
      toast.success(`Exported live data (${allRooms.length} rooms)`);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Export failed'));
    }
  };

  return (
    <div className="space-y-4">
      <div className="glass-card flex flex-wrap gap-3 p-4">
        <div className="relative min-w-[180px] flex-1">
          <Search className="absolute left-3 top-3 text-slate-400" size={18} />
          <input
            className="input-field pl-10"
            placeholder="Search room number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <input
          className="input-field min-w-[180px] flex-1"
          placeholder="Search resident name..."
          value={residentSearch}
          onChange={(e) => setResidentSearch(e.target.value)}
        />
        <Select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          options={[
            { value: '', label: 'All Status' },
            { value: 'vacant', label: 'Vacant' },
            { value: 'occupied', label: 'Occupied' },
            { value: 'maintenance', label: 'Maintenance' },
          ]}
          className="min-w-[140px]"
        />
        <Select
          value={blockFilter}
          onChange={(e) => setBlockFilter(e.target.value)}
          options={[
            { value: '', label: 'All Blocks' },
            ...blocks.map((b) => ({ value: b._id, label: b.blockName })),
          ]}
          className="min-w-[140px]"
        />
        <Button variant="secondary" onClick={() => handleExport('pdf')}>
          <Download size={16} /> PDF
        </Button>
        <Button variant="secondary" onClick={() => handleExport('excel')}>
          <Download size={16} /> Excel
        </Button>
        <Button
          onClick={() => {
            setEditRoom(null);
            setForm({
              roomNumber: '',
              guestHouse: blocks[0]?._id || '',
              floor: 1,
              department: '',
              rentAmount: 8500,
              gridRow: 0,
              gridCol: 0,
            });
            setModalOpen(true);
          }}
        >
          <Plus size={18} /> Add Room
        </Button>
      </div>

      {loading ? (
        <TableSkeleton />
      ) : (
        <div className="glass-card overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b bg-slate-50/80 dark:border-slate-700 dark:bg-slate-800/50">
                <th className="p-4 font-semibold">Room No</th>
                <th className="p-4 font-semibold">Resident Status</th>
                <th className="p-4 font-semibold">Department</th>
                <th className="p-4 font-semibold">Resident</th>
                <th className="p-4 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((r) => (
                <tr
                  key={r._id}
                  className="border-b hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50"
                >
                  <td className="p-4 font-medium">{r.roomNumber}</td>
                  <td className="p-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium text-white ${ROOM_STATUS[r.status]?.color}`}
                    >
                      {statusLabel(r.status)}
                    </span>
                  </td>
                  <td className="p-4">{getDepartment(r)}</td>
                  <td className="p-4">{r.resident?.name || '—'}</td>
                  <td className="p-4">
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => setDetailRoom(r)}
                        className="rounded-lg p-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
                        title="View details"
                      >
                        <Eye size={16} className="text-indigo-600" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditRoom(r);
                          setForm({
                            roomNumber: r.roomNumber,
                            guestHouse: r.guestHouse?._id || r.guestHouse,
                            floor: r.floor ?? 1,
                            department: r.department || r.resident?.department || '',
                            rentAmount: r.rentAmount ?? 8500,
                            gridRow: r.gridRow ?? 0,
                            gridCol: r.gridCol ?? 0,
                            notes: r.notes || '',
                          });
                          setModalOpen(true);
                        }}
                        className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(r._id)}
                        className="rounded-lg p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editRoom ? 'Edit Room' : 'Add Room'}>
        <form onSubmit={handleSave} className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Room Number"
            value={form.roomNumber}
            onChange={(e) => setForm({ ...form, roomNumber: e.target.value })}
            required
          />
          <Select
            label="Block"
            value={form.guestHouse}
            onChange={(e) => setForm({ ...form, guestHouse: e.target.value })}
            options={blocks.map((b) => ({ value: b._id, label: b.blockName }))}
          />
          <Input
            label="Department (vacant room)"
            value={form.department || ''}
            onChange={(e) => setForm({ ...form, department: e.target.value })}
            className="sm:col-span-2"
          />
          <Input
            label="Floor"
            type="number"
            value={form.floor}
            onChange={(e) => setForm({ ...form, floor: +e.target.value })}
          />
          <Input
            label="Grid Row"
            type="number"
            value={form.gridRow}
            onChange={(e) => setForm({ ...form, gridRow: +e.target.value })}
          />
          <Input
            label="Grid Col"
            type="number"
            value={form.gridCol}
            onChange={(e) => setForm({ ...form, gridCol: +e.target.value })}
          />
          <Button type="submit" className="sm:col-span-2">
            Save
          </Button>
        </form>
      </Modal>

      <RoomModal
        room={detailRoom}
        open={!!detailRoom && !assignRoom}
        onClose={() => setDetailRoom(null)}
        onAction={async (action, room) => {
          if (action === 'assign') {
            setDetailRoom(null);
            setAssignRoom(room);
            return;
          }
          try {
            if (action === 'maintenance') await roomAPI.maintenance(room._id);
            if (action === 'vacate') await roomAPI.vacate(room._id);
            toast.success('Updated');
            setDetailRoom(null);
          } catch (err) {
            toast.error(getErrorMessage(err, 'Action failed'));
          }
        }}
      />

      <AssignResidentModal
        open={!!assignRoom}
        room={assignRoom}
        onClose={() => setAssignRoom(null)}
        onAssigned={() => setAssignRoom(null)}
      />
    </div>
  );
}
