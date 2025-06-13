import { useState } from 'react';
import type { RateDto } from '../types';
import { updateRate } from '../api';

interface Props {
  rate: RateDto;
  onUpdated: () => void;
}

export function RateBlock({ rate, onUpdated }: Props) {
  const [value, setValue] = useState(rate.currentRate);
  const [error, setError] = useState<string | null>(null);

  const handleUpdate = async () => {
    try {
      await updateRate(value);
      onUpdated();
    } catch {
      setError('Не удалось обновить курс');
    }
  };

  return (
    <div>
      <h2>Current Rate: {rate.currentRate}</h2>
      <input
        type="number"
        value={value}
        onChange={e => setValue(parseFloat(e.target.value))}
      />
      <button onClick={handleUpdate}>Update Rate</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}