import { useEffect, useState } from 'react';
import { Plus, Search, Download, Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { residentAPI } from '../services/api';
import { useStoreRevision } from '../context/DataContext';
import { TableSkeleton } from '../components/ui/Skeleton';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import { exportToExcel } from '../utils/exportData';
import { residentPayload } from '../utils/payloads';
import { getErrorMessage } from '../utils/getErrorMessage';

const emptyForm = {
  name: '',
  poornataId: '',
  designation: '',
  department: '',
  phone: '',
};

export default function Residents() {
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [edit, setEdit] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const revision = useStoreRevision();

  const load = () => {
    setLoading(true);
    residentAPI
      .list({ search: search || undefined })
      .then((res) => setResidents(res.data.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const t = setTimeout(load, search ? 300 : 0);
    return () => clearTimeout(t);
  }, [search, revision]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const payload = residentPayload(form);
      if (edit) {
        await residentAPI.update(edit._id, payload);
        toast.success('Resident updated — saved to database');
      } else {
        await residentAPI.create(payload);
        toast.success('Resident added — saved to database');
      }
      setModalOpen(false);
      setEdit(null);
      setForm(emptyForm);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Save failed'));
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Remove this resident?')) return;
    try {
      await residentAPI.delete(id);
      toast.success('Removed');
    } catch (err) {
      toast.error(getErrorMessage(err, 'Delete failed'));
    }
  };

  const handleExport = async () => {
    try {
      const res = await residentAPI.list();
      const all = res.data.data || [];
      exportToExcel(
        all.map((r) => ({
          Name: r.name,
          'Poornata ID': r.poornataId,
          Designation: r.designation,
          Department: r.department,
          'Phone No': r.phone,
        })),
        'Residents',
        'residents.xlsx'
      );
      toast.success(`Exported live data (${all.length} residents)`);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Export failed'));
    }
  };

  const openEdit = (r) => {
    setEdit(r);
    setForm({
      name: r.name || '',
      poornataId: r.poornataId || '',
      designation: r.designation || '',
      department: r.department || '',
      phone: r.phone || '',
    });
    setModalOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <div className="relative min-w-[240px] flex-1">
          <Search className="absolute left-3 top-3 text-slate-400" size={18} />
          <input
            className="input-field pl-10"
            placeholder="Search name, Poornata ID, department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="secondary" onClick={handleExport}>
          <Download size={16} /> Export
        </Button>
        <Button
          onClick={() => {
            setEdit(null);
            setForm(emptyForm);
            setModalOpen(true);
          }}
        >
          <Plus size={18} /> Add Resident
        </Button>
      </div>

      {loading ? (
        <TableSkeleton />
      ) : (
        <div className="glass-card overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b bg-slate-50/80 dark:border-slate-700 dark:bg-slate-800/50">
                <th className="p-4 font-semibold">Name</th>
                <th className="p-4 font-semibold">Poornata ID</th>
                <th className="p-4 font-semibold">Designation</th>
                <th className="p-4 font-semibold">Department</th>
                <th className="p-4 font-semibold">Phone No</th>
                <th className="p-4 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {residents.map((r) => (
                <tr key={r._id} className="border-b dark:border-slate-800">
                  <td className="p-4 font-medium">{r.name}</td>
                  <td className="p-4">{r.poornataId || '—'}</td>
                  <td className="p-4">{r.designation || '—'}</td>
                  <td className="p-4">{r.department || '—'}</td>
                  <td className="p-4">{r.phone}</td>
                  <td className="p-4">
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => openEdit(r)}
                        className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(r._id)}
                        className="rounded-lg p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                        title="Remove"
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

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={edit ? 'Edit Resident' : 'Add Resident'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <Input
            label="Poornata ID"
            value={form.poornataId}
            onChange={(e) => setForm({ ...form, poornataId: e.target.value })}
            required
          />
          <Input
            label="Designation"
            value={form.designation}
            onChange={(e) => setForm({ ...form, designation: e.target.value })}
            required
          />
          <Input
            label="Department"
            value={form.department}
            onChange={(e) => setForm({ ...form, department: e.target.value })}
            required
          />
          <Input
            label="Phone No"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            required
          />
          <Button type="submit" className="w-full">
            Save
          </Button>
        </form>
      </Modal>
    </div>
  );
}
