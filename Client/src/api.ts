const BASE = '/api';

export async function login(email: string, pwd: string) {
  const res = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, pwd }),
  });
  if (!res.ok) throw new Error('Unauthorized');
  return res.json() as Promise<{ token: string }>;
}

function authHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getClients() {
  const res = await fetch(`${BASE}/clients`, { headers: authHeaders() });
  return res.json();
}

export async function getRate() {
  const res = await fetch(`${BASE}/rate`, { headers: authHeaders() });
  return res.json();
}

export async function updateRate(currentRate: number) {
  const res = await fetch(`${BASE}/rate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: JSON.stringify({ currentRate }),
  });
  if (!res.ok) throw new Error('Не удалось обновить курс');
}

export async function createClient(dto: { name: string; email: string; balanceT: number }) {
  const res = await fetch(`${BASE}/clients`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ name: dto.name, email: dto.email, balanceT: dto.balanceT }),
  });
  if (!res.ok) throw new Error('Не удалось создать клиента');
  return res.json() as Promise<ClientDto>;
}


export async function updateClient(id: number, dto: { name: string; email: string; balanceT: number }) {
  const res = await fetch(`${BASE}/clients/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ name: dto.name, email: dto.email, balanceT: dto.balanceT }),
  });
  if (!res.ok) throw new Error('Не удалось обновить клиента');
}


export async function deleteClient(id: number) {
  const res = await fetch(`${BASE}/clients/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Не удалось удалить клиента');
}


export async function getClientPayments(id: number) {
  const res = await fetch(`${BASE}/clients/${id}/payments`, { headers: authHeaders() });
  if (res.status === 404) throw new Error('Клиент не найден');
  return res.json() as Promise<PaymentDto[]>;
}