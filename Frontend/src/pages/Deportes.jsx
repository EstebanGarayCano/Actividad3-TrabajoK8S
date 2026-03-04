import PaginaCategoria from '../components/PaginaCategoria';

const PRODUCTOS_DEPORTES = [
  { id: 1, nombre: 'Camiseta running', descripcion: 'Camiseta técnica secado rápido para running.', precio: 29.99 },
  { id: 2, nombre: 'Short deportivo', descripcion: 'Short con interior slip, ligero y transpirable.', precio: 24.99 },
  { id: 3, nombre: 'Leggings deportivos', descripcion: 'Leggings de compresión para entrenamiento.', precio: 34.99 },
  { id: 4, nombre: 'Sudadera running', descripcion: 'Sudadera con capucha para correr en frío.', precio: 49.99 },
  { id: 5, nombre: 'Zapatillas running', descripcion: 'Zapatillas ligeras con amortiguación.', precio: 89.99 },
  { id: 6, nombre: 'Riñonera deportiva', descripcion: 'Riñonera impermeable para llaves y móvil.', precio: 19.99 },
  { id: 7, nombre: 'Botella térmica', descripcion: 'Botella 500 ml mantiene frío/calor.', precio: 22.00 },
  { id: 8, nombre: 'Cinta para sudor', descripcion: 'Cinta absorbente para frente.', precio: 8.99 },
  { id: 9, nombre: 'Guantes de gym', descripcion: 'Guantes con soporte para muñeca.', precio: 26.99 },
  { id: 10, nombre: 'Toalla microfibras', descripcion: 'Toalla pequeña secado rápido para gym.', precio: 14.99 },
  { id: 11, nombre: 'Mochila hidratación', descripcion: 'Mochila con bolsa de agua 2L para trail.', precio: 55.00 },
];

export default function Deportes() {
  return <PaginaCategoria titulo="Deportes — Ropa y accesorios" productos={PRODUCTOS_DEPORTES} />;
}
