import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, User, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { residentAPI, roomAPI } from '../../services/api';
import { useStoreRevision } from '../../context/DataContext';

/** Pick a resident from a list and assign to a vacant room */
export default function AssignResidentModal({ open, room, onClose, onAssigned }) {
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState('');
  const [search, setSearch] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const revision = useStoreRevision();

  const fetchResidents = () => {
    setLoading(true);
    residentAPI
      .list()
      .then((res) => setResidents(res.data.data || []))
      .catch(() => toast.error('Could not load residents'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!open) {
      setSelectedId('');
      setSearch('');
      return;
    }
    fetchResidents();
  }, [open, revision]);

  const available = residents.filter((r) => !r.currentRoom);
  const filtered = available.filter((r) => {
    const q = search.toLowerCase();
    return (
      r.name?.toLowerCase().includes(q) ||
      r.poornataId?.toLowerCase().includes(q) ||
      r.department?.toLowerCase().includes(q)
    );
  });

  const assignResident = async (residentId) => {
    if (!residentId || !room?._id || submitting) return;
    setSelectedId(residentId);
    setSubmitting(true);
    try {
      await roomAPI.assign(room._id, { residentId });
      toast.success('Resident assigned successfully');
      onAssigned?.();
      onClose();
    } catch {
      toast.error('Failed to assign resident');
      setSelectedId('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Assign Resident — Room ${room?.roomNumber || ''}`}
      size="lg"
    >
      <p className="mb-4 text-sm text-slate-500">
        Click a resident to select and assign them to this room.
      </p>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-3 text-slate-400" size={18} />
        <input
          className="input-field pl-10"
          placeholder="Search by name, Poornata ID, department..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-600">
          <User className="mx-auto mb-2 text-slate-400" size={32} />
          <p className="font-medium text-slate-600 dark:text-slate-300">No available residents</p>
          <p className="mt-1 text-sm text-slate-500">
            {available.length === 0
              ? 'All residents already have a room. Add a new resident or vacate a room first.'
              : 'No match for your search.'}
          </p>
        </div>
      ) : (
        <ul className="max-h-64 space-y-2 overflow-y-auto pr-1">
          {filtered.map((r) => {
            const isSelected = selectedId === r._id;
            return (
              <motion.li
                key={r._id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => assignResident(r._id)}
                  className={`flex w-full items-center gap-3 rounded-xl border-2 p-4 text-left transition disabled:opacity-60 ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-500/30 dark:bg-indigo-900/30'
                      : 'border-slate-200 bg-white hover:border-indigo-300 dark:border-slate-700 dark:bg-slate-800/50'
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                      isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-700'
                    }`}
                  >
                    {isSelected ? <Check size={20} /> : <User size={20} />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">{r.name}</p>
                    <p className="text-xs text-slate-500">
                      {r.poornataId} · {r.designation} · {r.department}
                    </p>
                    <p className="text-xs text-slate-400">{r.phone}</p>
                  </div>
                  {isSelected && (
                    <span className="shrink-0 rounded-full bg-indigo-600 px-2 py-0.5 text-xs font-medium text-white">
                      Selected
                    </span>
                  )}
                </button>
              </motion.li>
            );
          })}
        </ul>
      )}

      <div className="mt-4 border-t pt-4 dark:border-slate-700">
        <Button variant="secondary" className="w-full" onClick={onClose} disabled={submitting}>
          Cancel
        </Button>
      </div>
    </Modal>
  );
}
