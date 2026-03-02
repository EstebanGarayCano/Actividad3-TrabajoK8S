import { useState } from 'react';
import { useSignalR } from '../context/SignalRContext';
import { api } from '../api/client';
import styles from './NotificacionesToast.module.css';

export default function NotificacionesToast() {
  const { notificaciones, quitarNotificacion, estado } = useSignalR();
  const [probando, setProbando] = useState(false);

  async function probarNotificacion() {
    setProbando(true);
    try {
      await api.notificaciones.test();
    } catch {
      // ignore
    } finally {
      setProbando(false);
    }
  }

  const tipoLabel = (tipo) => {
    const map = {
      PedidoCreado: 'Nuevo pedido',
      PedidoActualizado: 'Pedido actualizado',
      PedidoCancelado: 'Pedido cancelado',
      Info: 'Info',
    };
    return map[tipo] || tipo;
  };

  return (
    <div className={styles.container} aria-live="polite">
      <div className={styles.badgeRow}>
        {estado !== 'Desconectado' && (
          <span className={styles.badge} title={`WebSocket: ${estado}`}>
            {estado === 'Conectado' ? '●' : '○'} {estado}
          </span>
        )}
        <button type="button" className={styles.btnTest} onClick={probarNotificacion} disabled={probando || estado !== 'Conectado'} title="Enviar notificación de prueba">
          {probando ? '...' : 'Probar notificación'}
        </button>
      </div>
      <div className={styles.list}>
        {notificaciones.map((n) => (
          <div
            key={n.id}
            className={`${styles.toast} ${styles[n.tipo] || styles.Info}`}
            role="alert"
          >
            <span className={styles.tipo}>{tipoLabel(n.tipo)}</span>
            <span className={styles.mensaje}>{n.mensaje}</span>
            <button
              type="button"
              className={styles.cerrar}
              onClick={() => quitarNotificacion(n.id)}
              aria-label="Cerrar"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
