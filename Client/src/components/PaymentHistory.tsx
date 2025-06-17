import { useEffect, useState } from 'react';
import type { PaymentDto } from '../types';
import { getClientPayments } from '../api';

interface Props {
  clientId: number;
  onClose: () => void;
}

export function PaymentHistory({ clientId, onClose }: Props) {
  const [history, setHistory] = useState<PaymentDto[]>([]);

  useEffect(() => {
    getClientPayments(clientId).then(setHistory).catch(console.error);
  }, [clientId]);

  return (
    <div className="modal">
      <h2>History of Payments</h2>
      <button onClick={onClose}>Close</button>
      <ul>
        {history.map(p => (
          <li key={p.id}>
            {new Date(p.timestamp).toLocaleString()}: {p.amountT} T
          </li>
        ))}
      </ul>
    </div>
  );
}
