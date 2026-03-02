using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs;

public class LoginDto
{
    [Required]
    public string NombreUsuario { get; set; } = string.Empty;

    [Required]
    [DataType(DataType.Password)]
    public string Password { get; set; } = string.Empty;
}
