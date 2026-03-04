import PaginaCategoria from '../components/PaginaCategoria';

const PRODUCTOS_MUJER = [
  { id: 1, nombre: 'Blusa floral', descripcion: 'Blusa de algodón con estampado floral, manga corta.', precio: 29.99 },
  { id: 2, nombre: 'Vestido casual', descripcion: 'Vestido midi cómodo para día a día.', precio: 45.00 },
  { id: 3, nombre: 'Falda plisada', descripcion: 'Falda plisada alta cintura, varios colores.', precio: 34.99 },
  { id: 4, nombre: 'Chaqueta denim', descripcion: 'Chaqueta de mezclilla clásica para mujer.', precio: 59.99 },
  { id: 5, nombre: 'Jersey de punto', descripcion: 'Jersey suave de invierno, cuello redondo.', precio: 39.99 },
  { id: 6, nombre: 'Pantalón palazzo', descripcion: 'Pantalón ancho cómodo en tela suave.', precio: 42.00 },
  { id: 7, nombre: 'Bolso bandolera', descripcion: 'Bolso bandolera de cuero sintético.', precio: 35.99 },
  { id: 8, nombre: 'Cinturón ancho', descripcion: 'Cinturón de tela con hebilla metálica.', precio: 18.99 },
  { id: 9, nombre: 'Bufanda de lana', descripcion: 'Bufanda suave de lana, unisex.', precio: 22.00 },
  { id: 10, nombre: 'Zapatos de tacón bajo', descripcion: 'Zapatos cómodos tacón bajo para oficina.', precio: 54.99 },
  { id: 11, nombre: 'Top de encaje', descripcion: 'Top elegante con detalle de encaje.', precio: 28.50 },
];

export default function Mujer() {
  return <PaginaCategoria titulo="Mujer — Ropa y accesorios" productos={PRODUCTOS_MUJER} />;
}
