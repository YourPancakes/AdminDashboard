import { useEffect, useState } from 'react';
import {
  getClients,
  getRate,
  createClient,
  updateClient,
  deleteClient,
} from '../api';
import type { ClientDto, RateDto } from '../types';
import { ClientTable } from '../components/ClientTable';
import { ClientForm } from '../components/ClientForm';
import { PaymentHistory } from '../components/PaymentHistory';
import { RateBlock } from '../components/RateBlock';

export function DashboardPage() {
 
  const [clients, setClients] = useState<ClientDto[]>([]);
  const [rate, setRate] = useState<RateDto | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientDto | null>(null);

  const [historyClientId, setHistoryClientId] = useState<number | null>(null);


  const fetchData = async () => {
    try {
      const [c, r] = await Promise.all([getClients(), getRate()]);
      setClients(c);
      setRate(r);
    } catch (err) {
      console.error('Ошибка при загрузке данных:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  const handleAdd = () => {
    setEditingClient(null);
    setShowForm(true);
  };

  const handleEdit = (client: ClientDto) => {
    setEditingClient(client);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Удалить клиента?')) {
      await deleteClient(id);
      await fetchData();
    }
  };

  const handleSave = async (dto: { name: string; email: string; balanceT: number }) => {
    if (editingClient) {
      await updateClient(editingClient.id, dto);
    } else {
      await createClient(dto);
    }
    setShowForm(false);
    await fetchData();
  };

  const handleHistory = (clientId: number) => {
    setHistoryClientId(clientId);
  };

  const closeHistory = () => {
    setHistoryClientId(null);
  };

  if (!rate) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Dashboard</h1>

      <div className="mb-6">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded"
          onClick={handleAdd}
        >
          + New Client
        </button>
      </div>

      <ClientTable
        clients={clients}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onHistory={handleHistory}
      />

      {showForm && (
        <ClientForm
          client={editingClient ?? undefined}
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
        />
      )}

      {historyClientId !== null && (
        <PaymentHistory clientId={historyClientId} onClose={closeHistory} />
      )}

      <div className="mt-8">
        <RateBlock rate={rate} onUpdated={fetchData} />
      </div>
    </div>
  );
}
