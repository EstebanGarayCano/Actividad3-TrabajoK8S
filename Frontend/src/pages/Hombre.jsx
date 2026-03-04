import PaginaCategoria from '../components/PaginaCategoria';

const PRODUCTOS_HOMBRE = [
  { id: 1, nombre: 'Camisa Oxford', descripcion: 'Camisa de algodón Oxford clásica, manga larga.', precio: 44.99 },
  { id: 2, nombre: 'Pantalón chino', descripcion: 'Pantalón chino casual, corte regular.', precio: 49.99 },
  { id: 3, nombre: 'Sudadera con capucha', descripcion: 'Sudadera de algodón con capucha y bolsillo canguro.', precio: 39.99 },
  { id: 4, nombre: 'Chaqueta bomber', descripcion: 'Chaqueta bomber ligera para entretiempo.', precio: 69.99 },
  { id: 5, nombre: 'Polo básico', descripcion: 'Polo de piqué en colores sólidos.', precio: 24.99 },
  { id: 6, nombre: 'Jeans slim', descripcion: 'Jeans corte slim, mezclilla resistente.', precio: 54.00 },
  { id: 7, nombre: 'Cinturón de cuero', descripcion: 'Cinturón de cuero genuino con hebilla clásica.', precio: 32.99 },
  { id: 8, nombre: 'Gorra plana', descripcion: 'Gorra de algodón con logo bordado.', precio: 19.99 },
  { id: 9, nombre: 'Calcetines pack', descripcion: 'Pack de 3 pares de calcetines deportivos.', precio: 14.99 },
  { id: 10, nombre: 'Mochila urbana', descripcion: 'Mochila resistente para uso diario y laptop.', precio: 48.99 },
  { id: 11, nombre: 'Reloj casual', descripcion: 'Reloj de pulsera con correa de tela.', precio: 35.00 },
];

export default function Hombre() {
  return <PaginaCategoria titulo="Hombre — Ropa y accesorios" productos={PRODUCTOS_HOMBRE} />;
}
