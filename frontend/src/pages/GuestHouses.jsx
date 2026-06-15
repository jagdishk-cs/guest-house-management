import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import BlockCard from '../components/guesthouses/BlockCard';
import { CardSkeleton } from '../components/ui/Skeleton';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { guestHouseAPI } from '../services/api';
import { useStoreRevision } from '../context/DataContext';
import { guestHousePayload } from '../utils/payloads';
import { getErrorMessage } from '../utils/getErrorMessage';

export default function GuestHouses() {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', blockName: '', address: '', floors: 1 });
  const revision = useStoreRevision();

  const load = () => {
    guestHouseAPI
      .list()
      .then((res) => setBlocks(res.data.data))
      .catch(() => toast.error('Failed to load blocks'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    setLoading(true);
    load();
  }, [revision]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await guestHouseAPI.create(guestHousePayload(form));
      toast.success('Block created — saved to database');
      setModalOpen(false);
      setForm({ name: '', blockName: '', address: '', floors: 1 });
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to create block'));
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-slate-500">{blocks.length} guest house blocks</p>
        <Button onClick={() => setModalOpen(true)}>
          <Plus size={18} /> Add Block
        </Button>
      </div>
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {blocks.map((b, i) => (
            <BlockCard key={b._id} block={b} index={i} />
          ))}
        </div>
      )}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Guest House Block">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input label="Guest House Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Input label="Block Name" value={form.blockName} onChange={(e) => setForm({ ...form, blockName: e.target.value })} required />
          <Input label="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          <Input label="Floors" type="number" value={form.floors} onChange={(e) => setForm({ ...form, floors: +e.target.value })} />
          <Button type="submit" className="w-full">Create Block</Button>
        </form>
      </Modal>
    </div>
  );
}
