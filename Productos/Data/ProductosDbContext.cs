using Microsoft.EntityFrameworkCore;
using Productos.Models;

namespace Productos.Data;

public class ProductosDbContext : DbContext
{
    public ProductosDbContext(DbContextOptions<ProductosDbContext> options)
        : base(options) { }

    public DbSet<Producto> Productos => Set<Producto>();
}
