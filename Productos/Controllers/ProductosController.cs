using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Productos.Data;
using Productos.DTOs;
using Productos.Models;

namespace Productos.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductosController : ControllerBase
{
    private readonly ProductosDbContext _context;

    public ProductosController(ProductosDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProductoResponseDto>>> Listar()
    {
        var lista = await _context.Productos
            .OrderBy(p => p.Nombre)
            .Select(p => MapToDto(p))
            .ToListAsync();
        return Ok(lista);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ProductoResponseDto>> Obtener(int id)
    {
        var producto = await _context.Productos.FindAsync(id);
        if (producto == null) return NotFound();
        return Ok(MapToDto(producto));
    }

    [HttpPost]
    public async Task<ActionResult<ProductoResponseDto>> Agregar(CrearProductoDto dto)
    {
        var producto = new Producto
        {
            Nombre = dto.Nombre,
            Descripcion = dto.Descripcion,
            Precio = dto.Precio,
            Stock = dto.Stock,
            FechaCreacion = DateTime.UtcNow,
            Activo = true
        };
        _context.Productos.Add(producto);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(Obtener), new { id = producto.Id }, MapToDto(producto));
    }

    private static ProductoResponseDto MapToDto(Producto p) => new()
    {
        Id = p.Id,
        Nombre = p.Nombre,
        Descripcion = p.Descripcion,
        Precio = p.Precio,
        Stock = p.Stock,
        FechaCreacion = p.FechaCreacion,
        Activo = p.Activo
    };
}
