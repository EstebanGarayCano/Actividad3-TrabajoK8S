import PaginaCategoria from '../components/PaginaCategoria';

const PRODUCTOS_NINOS = [
  { id: 1, nombre: 'Camiseta infantil', descripcion: 'Camiseta de algodón suave para niños.', precio: 12.99 },
  { id: 2, nombre: 'Pantalón jogger niño', descripcion: 'Pantalón jogger elástico cómodo.', precio: 18.99 },
  { id: 3, nombre: 'Vestido niña', descripcion: 'Vestido casual con estampado divertido.', precio: 24.99 },
  { id: 4, nombre: 'Sudadera infantil', descripcion: 'Sudadera con capucha, felpa suave.', precio: 28.99 },
  { id: 5, nombre: 'Chaqueta impermeable', descripcion: 'Chaqueta ligera impermeable para lluvia.', precio: 34.99 },
  { id: 6, nombre: 'Zapatillas infantiles', descripcion: 'Zapatillas deportivas con velcro.', precio: 32.00 },
  { id: 7, nombre: 'Gorra infantil', descripcion: 'Gorra ajustable con protección UV.', precio: 11.99 },
  { id: 8, nombre: 'Mochila escolar', descripcion: 'Mochila ergonómica con compartimentos.', precio: 29.99 },
  { id: 9, nombre: 'Calcetines pack niños', descripcion: 'Pack 5 pares de calcetines de algodón.', precio: 9.99 },
  { id: 10, nombre: 'Pijama set', descripcion: 'Conjunto pijama pantalón y camiseta.', precio: 22.99 },
  { id: 11, nombre: 'Bufanda y gorro set', descripcion: 'Set bufanda y gorro de lana suave.', precio: 16.99 },
];

export default function Ninos() {
  return <PaginaCategoria titulo="Niños — Ropa y accesorios" productos={PRODUCTOS_NINOS} />;
}
