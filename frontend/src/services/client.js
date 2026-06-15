/**
 * HTTP client for Guest House Management API (MongoDB backend).
 * All mutations notify subscribers so every page stays in sync.
 */

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const listeners = new Set();

export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function notifyDataChange() {
  listeners.forEach((fn) => fn());
}

function buildQuery(params) {
  if (!params) return '';
  const q = new URLSearchParams();
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== '') q.append(key, val);
  });
  const s = q.toString();
  return s ? `?${s}` : '';
}

export async function request(path, { method = 'GET', body, params, auth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = localStorage.getItem('token');
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let res;
  try {
    res = await fetch(`${API_BASE}${path}${buildQuery(params)}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    const networkErr = new Error(
      err.message === 'Failed to fetch'
        ? 'Failed to fetch'
        : err.message || 'Network request failed'
    );
    throw networkErr;
  }

  let data = {};
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }
  }

  if (!res.ok) {
    const err = new Error(data.message || `Request failed (${res.status})`);
    err.response = { status: res.status, data };
    throw err;
  }

  return { data };
}

/** Run a mutating request and broadcast sync to all pages */
export async function mutate(fn) {
  const result = await fn();
  notifyDataChange();
  return result;
}

export const http = {
  get: (path, params, opts) => request(path, { method: 'GET', params, ...opts }),
  post: (path, body, opts) => request(path, { method: 'POST', body, ...opts }),
  put: (path, body, opts) => request(path, { method: 'PUT', body, ...opts }),
  patch: (path, body, opts) => request(path, { method: 'PATCH', body, ...opts }),
  delete: (path, opts) => request(path, { method: 'DELETE', ...opts }),
};
