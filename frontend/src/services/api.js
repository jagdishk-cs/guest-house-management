/**
 * API layer — all data persisted via MongoDB backend.
 */
import { http, mutate } from './client.js';

export const authAPI = {
  login: (credentials) => http.post('/auth/login', credentials, { auth: false }),
  me: () => http.get('/auth/me'),
};

export const dashboardAPI = {
  stats: () => http.get('/dashboard/stats'),
};

export const guestHouseAPI = {
  list: () => http.get('/guest-houses'),
  get: (id) => http.get(`/guest-houses/${id}`),
  create: (body) => mutate(() => http.post('/guest-houses', body)),
  update: (id, body) => mutate(() => http.put(`/guest-houses/${id}`, body)),
  delete: (id) => mutate(() => http.delete(`/guest-houses/${id}`)),
};

export const roomAPI = {
  list: (params) => http.get('/rooms', params),
  get: (id) => http.get(`/rooms/${id}`),
  create: (body) => mutate(() => http.post('/rooms', body)),
  update: (id, body) => mutate(() => http.put(`/rooms/${id}`, body)),
  delete: (id) => mutate(() => http.delete(`/rooms/${id}`)),
  maintenance: (id) => mutate(() => http.patch(`/rooms/${id}/maintenance`)),
  assign: (id, body) => mutate(() => http.patch(`/rooms/${id}/assign`, body)),
  vacate: (id) => mutate(() => http.patch(`/rooms/${id}/vacate`)),
  qrcode: (id) => http.get(`/rooms/${id}/qrcode`),
};

export const residentAPI = {
  list: (params) => http.get('/residents', params),
  get: (id) => http.get(`/residents/${id}`),
  create: (body) => mutate(() => http.post('/residents', body)),
  update: (id, body) => mutate(() => http.put(`/residents/${id}`, body)),
  delete: (id) => mutate(() => http.delete(`/residents/${id}`)),
};

export const complaintAPI = {
  list: (params) => http.get('/complaints', params),
  create: (body) => mutate(() => http.post('/complaints', body)),
  resolve: (id) => mutate(() => http.patch(`/complaints/${id}/resolve`)),
  delete: (id) => mutate(() => http.delete(`/complaints/${id}`)),
};

export default { authAPI, dashboardAPI, guestHouseAPI, roomAPI, residentAPI, complaintAPI };
