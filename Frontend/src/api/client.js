const API_BASE = '/api';
const API_PRODUCTOS_BASE = '/api-productos/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };
  const res = await fetch(url, config);
  let data = {};
  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    data = await res.json().catch(() => ({}));
  }
  if (!res.ok) {
    const msg = data.mensaje || data.message || `Error ${res.status}`;
    throw new Error(msg);
  }
  return data;
}

async function requestProductos(endpoint, options = {}) {
  const url = `${API_PRODUCTOS_BASE}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };
  const res = await fetch(url, config);
  let data = {};
  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    data = await res.json().catch(() => ({}));
  }
  if (!res.ok) {
    const msg = data.mensaje || data.message || `Error ${res.status}`;
    throw new Error(msg);
  }
  return data;
}

export const api = {
  auth: {
    login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
    registro: (body) => request('/auth/registro', { method: 'POST', body: JSON.stringify(body) }),
  },
  usuarios: {
    list: () => request('/usuarios'),
    get: (id) => request(`/usuarios/${id}`),
    create: (body) => request('/usuarios', { method: 'POST', body: JSON.stringify(body) }),
    update: (id, body) => request(`/usuarios/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    delete: (id) => request(`/usuarios/${id}`, { method: 'DELETE' }),
  },
  productos: {
    list: () => requestProductos('/productos'),
    get: (id) => requestProductos(`/productos/${id}`),
    create: (body) => requestProductos('/productos', { method: 'POST', body: JSON.stringify(body) }),
  },
  notificaciones: {
    test: () => request('/notificaciones/test', { method: 'POST' }),
  },
};
