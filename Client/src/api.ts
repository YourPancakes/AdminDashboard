import type { ClientDto, PaymentDto, RateDto  } from './types';  

const BASE = import.meta.env.VITE_API_URL as string;

export async function login(email: string, pwd: string) {
  const res = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, pwd }),
  });
  if (!res.ok) throw new Error('Unauthorized');
  return res.json() as Promise<{ token: string }>;
}


function authHeaders(): HeadersInit {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

export async function getClients() {
  const res = await fetch(`${BASE}/clients`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to load clients');
  return res.json() as Promise<ClientDto[]>;
}

export async function getRate() {
  const res = await fetch(`${BASE}/rate`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to load exchange rate');
  return res.json() as Promise<RateDto>;
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
  if (!res.ok) throw new Error('Failed to update exchange rate');
}

export async function createClient(dto: { name: string; email: string; balanceT: number }) {
  const res = await fetch(`${BASE}/clients`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: JSON.stringify(dto),
  });
  if (!res.ok) throw new Error('Failed to create client');
  return res.json() as Promise<ClientDto>;
}

export async function updateClient(id: number, dto: { name: string; email: string; balanceT: number }) {
  const res = await fetch(`${BASE}/clients/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: JSON.stringify(dto),
  });
  if (!res.ok) throw new Error('Failed to update client');
}

export async function deleteClient(id: number) {
  const res = await fetch(`${BASE}/clients/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete client');
}

export async function getClientPayments(id: number) {
  const res = await fetch(`${BASE}/clients/${id}/payments`, {
    headers: authHeaders(),
  });
  if (res.status === 404) throw new Error('Client not found');
  if (!res.ok) throw new Error('Failed to load payments');
  return res.json() as Promise<PaymentDto[]>;
}
