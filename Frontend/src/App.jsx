import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SignalRProvider } from './context/SignalRContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Usuarios from './pages/Usuarios';
import ListarProductos from './pages/ListarProductos';
import AgregarProducto from './pages/AgregarProducto';
import Mujer from './pages/Mujer';
import Hombre from './pages/Hombre';
import Deportes from './pages/Deportes';
import Ninos from './pages/Ninos';

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

function PublicRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/usuarios" replace />;
  return children;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();
  return (
    <SignalRProvider enabled={isAuthenticated}>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/usuarios" replace />} />
        <Route path="login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="registro" element={<PublicRoute><Registro /></PublicRoute>} />
        <Route path="mujer" element={<Mujer />} />
        <Route path="hombre" element={<Hombre />} />
        <Route path="deportes" element={<Deportes />} />
        <Route path="ninos" element={<Ninos />} />
        <Route path="usuarios" element={<PrivateRoute><Usuarios /></PrivateRoute>} />
        <Route path="productos" element={<PrivateRoute><ListarProductos /></PrivateRoute>} />
        <Route path="productos/agregar" element={<PrivateRoute><AgregarProducto /></PrivateRoute>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </SignalRProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
