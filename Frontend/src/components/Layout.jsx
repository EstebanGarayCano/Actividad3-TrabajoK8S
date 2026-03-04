import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificacionesToast from './NotificacionesToast';
import styles from './Layout.module.css';

export default function Layout() {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <div className={styles.layout}>
      {isAuthenticated && <NotificacionesToast />}
      <header className={styles.header}>
        <h1 className={styles.logo}>Tienda On Line</h1>
        <nav className={styles.nav}>
          <Link to="/mujer" className={isActive('/mujer') ? styles.menuLinkActive : styles.menuLink}>Mujer</Link>
          <Link to="/hombre" className={isActive('/hombre') ? styles.menuLinkActive : styles.menuLink}>Hombre</Link>
          <Link to="/deportes" className={isActive('/deportes') ? styles.menuLinkActive : styles.menuLink}>Deportes</Link>
          <Link to="/ninos" className={isActive('/ninos') ? styles.menuLinkActive : styles.menuLink}>Niños</Link>
          {isAuthenticated ? (
            <>
              <span className={styles.user}>Hola, {user?.nombre || user?.nombreUsuario}</span>
              <button type="button" className={styles.btnLogout} onClick={logout}>
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Iniciar sesión</Link>
              <Link to="/registro">Registrarse</Link>
            </>
          )}
        </nav>
      </header>
      {isAuthenticated && (
        <aside className={styles.sidebar}>
          <nav className={styles.menu}>
            <div className={styles.menuGroup}>
              <span className={styles.menuGroupTitle}>Usuarios</span>
              <Link to="/usuarios" className={isActive('/usuarios') ? styles.menuLinkActive : styles.menuLink}>
                Usuarios
              </Link>
            </div>
            <div className={styles.menuGroup}>
              <span className={styles.menuGroupTitle}>1. Producto</span>
              <Link to="/productos" className={isActive('/productos') && location.pathname === '/productos' ? styles.menuLinkActive : styles.menuLink}>
                1.1 Listar Productos
              </Link>
              <Link to="/productos/agregar" className={isActive('/productos/agregar') ? styles.menuLinkActive : styles.menuLink}>
                1.2 Agregar productos
              </Link>
            </div>
          </nav>
        </aside>
      )}
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
