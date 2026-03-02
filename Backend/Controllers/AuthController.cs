using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.DTOs;
using Backend.Models;
using Backend.Services;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly AuthService _authService;

    public AuthController(ApplicationDbContext context, AuthService authService)
    {
        _context = context;
        _authService = authService;
    }

    [HttpPost("registro")]
    public async Task<ActionResult<LoginResponseDto>> Registro(RegistroUsuarioDto dto)
    {
        if (await _context.Usuarios.AnyAsync(u => u.Email == dto.Email))
            return BadRequest(new LoginResponseDto { Exito = false, Mensaje = "Ya existe un usuario con ese email." });

        if (await _context.Usuarios.AnyAsync(u => u.NombreUsuario == dto.NombreUsuario))
            return BadRequest(new LoginResponseDto { Exito = false, Mensaje = "Ya existe un usuario con ese nombre de usuario." });

        var usuario = new Usuario
        {
            Nombre = dto.Nombre,
            Apellido = dto.Apellido,
            Email = dto.Email,
            NombreUsuario = dto.NombreUsuario,
            PasswordHash = _authService.HashPassword(dto.Password),
            FechaCreacion = DateTime.UtcNow,
            Activo = true
        };

        _context.Usuarios.Add(usuario);
        await _context.SaveChangesAsync();

        var response = new LoginResponseDto
        {
            Exito = true,
            Mensaje = "Usuario registrado correctamente.",
            Usuario = MapToDto(usuario)
        };
        return Ok(response);
    }

    [HttpPost("login")]
    public async Task<ActionResult<LoginResponseDto>> Login(LoginDto dto)
    {
        var usuario = await _context.Usuarios
            .FirstOrDefaultAsync(u => u.NombreUsuario == dto.NombreUsuario);

        if (usuario == null || !usuario.Activo)
            return Unauthorized(new LoginResponseDto { Exito = false, Mensaje = "Usuario o contraseña incorrectos." });

        if (!_authService.VerifyPassword(dto.Password, usuario.PasswordHash))
            return Unauthorized(new LoginResponseDto { Exito = false, Mensaje = "Usuario o contraseña incorrectos." });

        return Ok(new LoginResponseDto
        {
            Exito = true,
            Mensaje = "Inicio de sesión exitoso.",
            Usuario = MapToDto(usuario)
        });
    }

    private static UsuarioResponseDto MapToDto(Usuario u) => new()
    {
        Id = u.Id,
        Nombre = u.Nombre,
        Apellido = u.Apellido,
        Email = u.Email,
        NombreUsuario = u.NombreUsuario,
        FechaCreacion = u.FechaCreacion,
        Activo = u.Activo
    };
}
