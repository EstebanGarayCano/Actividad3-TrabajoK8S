using System.ComponentModel.DataAnnotations;

namespace Productos.DTOs;

public class CrearProductoDto
{
    [Required(ErrorMessage = "El nombre es requerido")]
    [StringLength(200)]
    public string Nombre { get; set; } = string.Empty;

    [StringLength(1000)]
    public string? Descripcion { get; set; }

    [Required]
    [Range(0.01, double.MaxValue, ErrorMessage = "El precio debe ser mayor a 0")]
    public decimal Precio { get; set; }

    [Range(0, int.MaxValue)]
    public int Stock { get; set; }
}
