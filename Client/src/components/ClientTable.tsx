import type { ClientDto } from '../types';

interface Props {
  clients: ClientDto[];
  onEdit: (c: ClientDto) => void;
  onDelete: (id: number) => void;
  onHistory: (id: number) => void;
}

export function ClientTable({ clients, onEdit, onDelete, onHistory }: Props) {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th><th>Email</th><th>BalanceT</th><th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {clients.map(c => (
          <tr key={c.id}>
            <td>{c.name}</td>
            <td>{c.email}</td>
            <td>{c.balanceT}</td>
            <td>
              <button onClick={() => onEdit(c)}>✏️</button>
              <button onClick={() => onDelete(c.id)}>🗑️</button>
              <button onClick={() => onHistory(c.id)}>📜</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
