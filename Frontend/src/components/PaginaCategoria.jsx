import styles from '../pages/Categoria.module.css';

function formatPrecio(n) {
  return new Intl.NumberFormat('es', { style: 'currency', currency: 'USD' }).format(n);
}

export default function PaginaCategoria({ titulo, productos }) {
  return (
    <div className={styles.page}>
      <h2 className={styles.title}>{titulo}</h2>
      <div className={styles.grid}>
        {productos.map((p) => (
          <article key={p.id} className={styles.card}>
            <div className={styles.cardImage}>👕</div>
            <div className={styles.cardBody}>
              <h3 className={styles.cardTitle}>{p.nombre}</h3>
              <p className={styles.cardDesc}>{p.descripcion}</p>
              <p className={styles.cardPrice}>{formatPrecio(p.precio)}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
