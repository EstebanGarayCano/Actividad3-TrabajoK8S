import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import styles from './Auth.module.css';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.auth.login({ nombreUsuario, password });
      if (res.exito && res.usuario) {
        login(res.usuario);
        navigate('/usuarios', { replace: true });
      } else {
        setError(res.mensaje || 'Error al iniciar sesión');
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
        <h2 className={styles.title}>Iniciar sesión</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>
            Nombre de usuario
            <input
              type="text"
              value={nombreUsuario}
              onChange={(e) => setNombreUsuario(e.target.value)}
              required
              autoComplete="username"
              className={styles.input}
            />
          </label>
          <label className={styles.label}>
            Contraseña
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className={styles.input}
            />
          </label>
          {error && <p className="error-msg">{error}</p>}
          <button type="submit" className={styles.submit} disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <p className={styles.footer}>
          ¿No tienes cuenta? <Link to="/registro">Regístrate</Link>
        </p>
      </div>
    </div>
  );
}
