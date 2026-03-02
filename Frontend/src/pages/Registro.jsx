import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import styles from './Auth.module.css';

export default function Registro() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    email: '',
    nombreUsuario: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.auth.registro(form);
      if (res.exito && res.usuario) {
        login(res.usuario);
        navigate('/usuarios', { replace: true });
      } else {
        setError(res.mensaje || 'Error al registrarse');
      }
    } catch (err) {
      setError(err.message || 'Error de conexión');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h2 className={styles.title}>Crear cuenta</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
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
              autoComplete="email"
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
              autoComplete="username"
              className={styles.input}
            />
          </label>
          <label className={styles.label}>
            Contraseña
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
              autoComplete="new-password"
              className={styles.input}
            />
          </label>
          {error && <p className="error-msg">{error}</p>}
          <button type="submit" className={styles.submit} disabled={loading}>
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>
        <p className={styles.footer}>
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}
