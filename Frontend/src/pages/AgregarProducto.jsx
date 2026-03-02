import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import styles from './Productos.module.css';

export default function AgregarProducto() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: 0,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'precio' ? (value === '' ? '' : Number(value)) : name === 'stock' ? (value === '' ? 0 : parseInt(value, 10)) : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.productos.create({
        nombre: form.nombre.trim(),
        descripcion: form.descripcion.trim() || null,
        precio: Number(form.precio),
        stock: Number(form.stock) || 0,
      });
      navigate('/productos', { replace: true });
    } catch (err) {
      setError(err.message || 'Error al crear el producto');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        <h2 className={styles.title}>Agregar producto</h2>
      </div>

      <div className={styles.formCard}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>
            Nombre *
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </label>
          <label className={styles.label}>
            Descripción
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              rows={3}
              className={styles.input}
            />
          </label>
          <label className={styles.label}>
            Precio *
            <input
              type="number"
              name="precio"
              value={form.precio}
              onChange={handleChange}
              required
              min="0.01"
              step="0.01"
              className={styles.input}
            />
          </label>
          <label className={styles.label}>
            Stock
            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              min="0"
              className={styles.input}
            />
          </label>
          {error && <p className="error-msg">{error}</p>}
          <div className={styles.actions}>
            <button type="button" className={styles.btnSecondary} onClick={() => navigate(-1)}>
              Cancelar
            </button>
            <button type="submit" className={styles.btnPrimary} disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
