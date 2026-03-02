import { createContext, useContext, useEffect, useState, useCallback } from 'react';

const SignalRContext = createContext(null);

const HUB_URL = '/hubs/notificaciones';

export function SignalRProvider({ children, enabled = true }) {
  const [connection, setConnection] = useState(null);
  const [estado, setEstado] = useState('Desconectado'); // Desconectado | Conectando | Conectado
  const [notificaciones, setNotificaciones] = useState([]);

  const agregarNotificacion = useCallback((tipo, mensaje, datos = null) => {
    const id = Date.now();
    setNotificaciones((prev) => [...prev.slice(-19), { id, tipo, mensaje, datos }]);
    return id;
  }, []);

  const quitarNotificacion = useCallback((id) => {
    setNotificaciones((prev) => prev.filter((n) => n.id !== id));
  }, []);

  useEffect(() => {
    if (!enabled) {
      setConnection(null);
      setEstado('Desconectado');
      return;
    }

    let hubConnection = null;

    async function conectar() {
      const { HubConnectionBuilder } = await import('@microsoft/signalr');
      setEstado('Conectando');
      hubConnection = new HubConnectionBuilder()
        .withUrl(HUB_URL)
        .withAutomaticReconnect([0, 2000, 5000, 10000])
        .build();

      hubConnection.on('RecibirNotificacion', (tipo, mensaje, datos) => {
        agregarNotificacion(tipo, mensaje, datos);
      });

      try {
        await hubConnection.start();
        setEstado('Conectado');
        setConnection(hubConnection);
      } catch (err) {
        console.warn('SignalR: no se pudo conectar', err);
        setEstado('Desconectado');
      }
    }

    conectar();

    return () => {
      if (hubConnection?.state === 'Connected') {
        hubConnection.stop();
      }
      setConnection(null);
      setEstado('Desconectado');
    };
  }, [enabled, agregarNotificacion]);

  const value = {
    connection,
    estado,
    notificaciones,
    agregarNotificacion,
    quitarNotificacion,
  };

  return (
    <SignalRContext.Provider value={value}>
      {children}
    </SignalRContext.Provider>
  );
}

export function useSignalR() {
  const ctx = useContext(SignalRContext);
  if (!ctx) throw new Error('useSignalR debe usarse dentro de SignalRProvider');
  return ctx;
}
