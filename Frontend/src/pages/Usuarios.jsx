import { useState, useEffect } from 'react';
import { api } from '../api/client';
import styles from './Usuarios.module.css';

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

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modal, setModal] = useState(null); // 'nuevo' | { id, usuario }
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    email: '',
    nombreUsuario: '',
    password: '',
  });
  const [saveError, setSaveError] = useState('');
  const [saving, setSaving] = useState(false);

  async function loadUsuarios() {
    setLoading(true);
    setError('');
    try {
      const data = await api.usuarios.list();
      setUsuarios(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Error al cargar usuarios');
      setUsuarios([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsuarios();
  }, []);

  function openNuevo() {
    setModal('nuevo');
    setForm({ nombre: '', apellido: '', email: '', nombreUsuario: '', password: '' });
    setSaveError('');
  }

  function openEditar(usuario) {
    setModal({ id: usuario.id, usuario });
    setForm({
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      nombreUsuario: usuario.nombreUsuario,
      password: '',
    });
    setSaveError('');
  }

  function closeModal() {
    setModal(null);
    setSaveError('');
  }

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleCreate(e) {
    e.preventDefault();
    setSaveError('');
    setSaving(true);
    try {
      await api.usuarios.create(form);
      closeModal();
      loadUsuarios();
    } catch (err) {
      setSaveError(err.message || 'Error al crear usuario');
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate(e) {
    e.preventDefault();
    if (!modal?.id) return;
    setSaveError('');
    setSaving(true);
    try {
      const body = {
        id: modal.id,
        nombre: form.nombre,
        apellido: form.apellido,
        email: form.email,
        nombreUsuario: form.nombreUsuario,
        activo: true,
        fechaCreacion: modal.usuario.fechaCreacion,
      };
      await api.usuarios.update(modal.id, body);
      closeModal();
      loadUsuarios();
    } catch (err) {
      setSaveError(err.message || 'Error al actualizar');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('¿Eliminar este usuario?')) return;
    try {
      await api.usuarios.delete(id);
      loadUsuarios();
    } catch (err) {
      setError(err.message || 'Error al eliminar');
    }
  }

  const isEdit = modal && typeof modal === 'object' && modal.id;

  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        <h2 className={styles.title}>Usuarios</h2>
        <button type="button" className={styles.btnPrimary} onClick={openNuevo}>
          Nuevo usuario
        </button>
      </div>

      {error && <p className="error-msg">{error}</p>}

      {loading ? (
        <p className={styles.loading}>Cargando usuarios...</p>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Email</th>
                <th>Usuario</th>
                <th>Fecha creación</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {usuarios.length === 0 ? (
                <tr>
                  <td colSpan={7} className={styles.empty}>
                    No hay usuarios. Crea uno desde «Nuevo usuario».
                  </td>
                </tr>
              ) : (
                usuarios.map((u) => (
                  <tr key={u.id}>
                    <td>{u.nombre}</td>
                    <td>{u.apellido}</td>
                    <td>{u.email}</td>
                    <td>{u.nombreUsuario}</td>
                    <td>{formatDate(u.fechaCreacion)}</td>
                    <td>{u.activo ? 'Activo' : 'Inactivo'}</td>
                    <td>
                      <button
                        type="button"
                        className={styles.btnSm}
                        onClick={() => openEditar(u)}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className={styles.btnSmDanger}
                        onClick={() => handleDelete(u.id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <div className={styles.overlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>
              {isEdit ? 'Editar usuario' : 'Nuevo usuario'}
            </h3>
            <form onSubmit={isEdit ? handleUpdate : handleCreate} className={styles.form}>
              <label className={styles.label}>
                Nombre
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
                Apellido
                <input
                  type="text"
                  name="apellido"
                  value={form.apellido}
                  onChange={handleChange}
                  required
                  className={styles.input}
                />
              </label>
              <label className={styles.label}>
                Email
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className={styles.input}
                />
              </label>
              <label className={styles.label}>
                Nombre de usuario
                <input
                  type="text"
                  name="nombreUsuario"
                  value={form.nombreUsuario}
                  onChange={handleChange}
                  required
                  minLength={3}
                  className={styles.input}
                />
              </label>
              {!isEdit && (
                <label className={styles.label}>
                  Contraseña
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required={!isEdit}
                    minLength={6}
                    className={styles.input}
                  />
                </label>
              )}
              {saveError && <p className="error-msg">{saveError}</p>}
              <div className={styles.modalActions}>
                <button type="button" className={styles.btnSecondary} onClick={closeModal}>
                  Cancelar
                </button>
                <button type="submit" className={styles.btnPrimary} disabled={saving}>
                  {saving ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
