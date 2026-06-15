import { useEffect, useState } from 'react';
import { CheckCircle, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { complaintAPI } from '../services/api';
import { useStoreRevision } from '../context/DataContext';
import { CardSkeleton } from '../components/ui/Skeleton';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';

const statusColors = {
  open: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  in_progress: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  resolved: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
};

export default function Complaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', status: 'open' });
  const revision = useStoreRevision();

  const load = () => {
    setLoading(true);
    complaintAPI
      .list({ status: filter || undefined })
      .then((res) => setComplaints(res.data.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [filter, revision]);

  const handleResolve = async (id) => {
    try {
      await complaintAPI.resolve(id);
      toast.success('Complaint resolved');
    } catch {
      toast.error('Failed to resolve');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await complaintAPI.create(form);
      toast.success('Complaint filed');
      setForm({ title: '', description: '', status: 'open' });
      setModalOpen(false);
    } catch {
      toast.error('Failed to create');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <Select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          options={[
            { value: '', label: 'All Status' },
            { value: 'open', label: 'Open' },
            { value: 'in_progress', label: 'In Progress' },
            { value: 'resolved', label: 'Resolved' },
          ]}
          className="max-w-xs"
        />
        <Button onClick={() => setModalOpen(true)}>
          <Plus size={18} /> New Complaint
        </Button>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {complaints.map((c, i) => (
            <motion.div
              key={c._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card p-5"
            >
              <div className="mb-2 flex items-start justify-between gap-2">
                <h3 className="font-bold">{c.title}</h3>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[c.status]}`}>
                  {c.status.replace('_', ' ')}
                </span>
              </div>
              <p className="mb-3 text-sm text-slate-600 dark:text-slate-400">{c.description}</p>
              <div className="mb-4 text-xs text-slate-500">
                {c.resident?.name && <span>By: {c.resident.name} · </span>}
                {c.room?.roomNumber && <span>Room: {c.room.roomNumber} · </span>}
                {new Date(c.createdAt).toLocaleDateString()}
              </div>
              {c.status !== 'resolved' && (
                <Button variant="secondary" onClick={() => handleResolve(c._id)}>
                  <CheckCircle size={16} /> Resolve
                </Button>
              )}
            </motion.div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="File Complaint">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <div>
            <label className="mb-1.5 block text-sm font-medium">Description</label>
            <textarea
              className="input-field min-h-[100px]"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
            />
          </div>
          <Button type="submit" className="w-full">Submit</Button>
        </form>
      </Modal>
    </div>
  );
}
