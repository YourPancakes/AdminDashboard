import { useState, useEffect } from 'react';
import type { ClientDto } from '../types';

interface Props {
  client?: ClientDto;
  onCancel: () => void;
  onSave: (dto: { name: string; email: string; balanceT: number }) => void;
}

export function ClientForm({ client, onCancel, onSave }: Props) {
  const [name, setName] = useState(client?.name ?? '');
  const [email, setEmail] = useState(client?.email ?? '');
  const [balance, setBalance] = useState(client?.balanceT.toString() ?? '0');

  useEffect(() => {
    if (client) {
      setName(client.name);
      setEmail(client.email);
      setBalance(client.balanceT.toString());
    }
  }, [client]);

  return (
    <div className="modal">
      <h2>{client ? 'Edit Client' : 'New Client'}</h2>
      <form onSubmit={e => { e.preventDefault(); onSave({ name, email, balanceT: parseFloat(balance) }); }}>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" required />
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
        <input type="number" value={balance} onChange={e => setBalance(e.target.value)} placeholder="Balance" step="0.01" required />
        <button type="submit">Save</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </form>
    </div>
  );
}
