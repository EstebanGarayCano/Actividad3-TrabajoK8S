import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import styles from './Productos.module.css';

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString('es', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

function formatPrecio(n) {
  return new Intl.NumberFormat('es', { style: 'currency', currency: 'USD' }).format(n);
}

export default function ListarProductos() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    setError('');
    try {
      const data = await api.productos.list();
      setProductos(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Error al cargar productos');
      setProductos([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        <h2 className={styles.title}>Listar Productos</h2>
        <Link to="/productos/agregar" className={styles.btnPrimary}>
          Agregar producto
        </Link>
      </div>

      {error && <p className="error-msg">{error}</p>}

      {loading ? (
        <p className={styles.loading}>Cargando productos...</p>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Fecha creación</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {productos.length === 0 ? (
                <tr>
                  <td colSpan={6} className={styles.empty}>
                    No hay productos. <Link to="/productos/agregar">Agregar producto</Link>.
                  </td>
                </tr>
              ) : (
                productos.map((p) => (
                  <tr key={p.id}>
                    <td>{p.nombre}</td>
                    <td>{p.descripcion || '—'}</td>
                    <td>{formatPrecio(p.precio)}</td>
                    <td>{p.stock}</td>
                    <td>{formatDate(p.fechaCreacion)}</td>
                    <td>{p.activo ? 'Activo' : 'Inactivo'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
