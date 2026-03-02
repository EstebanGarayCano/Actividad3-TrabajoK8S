namespace Backend.DTOs;

public class LoginResponseDto
{
    public bool Exito { get; set; }
    public string Mensaje { get; set; } = string.Empty;
    public UsuarioResponseDto? Usuario { get; set; }
}
