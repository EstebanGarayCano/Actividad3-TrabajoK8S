using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Polly;
using Polly.CircuitBreaker;
using Backend.Data;
using Backend.DTOs;
using Backend.Models;
using Backend.Services;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsuariosController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly AuthService _authService;
    private readonly ResiliencePipeline<IEnumerable<UsuarioResponseDto>> _circuitBreakerPipeline;

    public UsuariosController(
        ApplicationDbContext context,
        AuthService authService,
        ResiliencePipeline<IEnumerable<UsuarioResponseDto>> circuitBreakerPipeline)
    {
        _context = context;
        _authService = authService;
        _circuitBreakerPipeline = circuitBreakerPipeline;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<UsuarioResponseDto>>> GetUsuarios(CancellationToken cancellationToken)
    {
        try
        {
            var usuarios = await _circuitBreakerPipeline.ExecuteAsync(
                async ct => await _context.Usuarios
                    .Select(u => MapToDto(u))
                    .ToListAsync(ct),
                cancellationToken);
            return Ok(usuarios);
        }
        catch (BrokenCircuitException)
        {
            return RespuestaServicioNoDisponible("CircuitBreakerOpen",
                "Servicio temporalmente no disponible (circuito abierto). Reintente en unos segundos.");
        }
        catch (Exception ex) when (EsErrorDeConexionBaseDeDatos(ex))
        {
            return RespuestaServicioNoDisponible("DatabaseUnavailable",
                "Base de datos no disponible. Compruebe que el servicio (p. ej. Docker) esté en ejecución.");
        }
        catch (Exception)
        {
            return RespuestaServicioNoDisponible("Error",
                "Error temporal al obtener los usuarios. Reintente en unos segundos.");
        }
    }

    private static ObjectResult RespuestaServicioNoDisponible(string codigo, string mensaje) =>
        new(new { codigo, mensaje }) { StatusCode = StatusCodes.Status503ServiceUnavailable };

    private static bool EsErrorDeConexionBaseDeDatos(Exception? ex)
    {
        while (ex != null)
        {
            var tipo = ex.GetType().FullName ?? "";
            var msg = ex.Message ?? "";
            if (tipo.Contains("MySql", StringComparison.OrdinalIgnoreCase) ||
                msg.Contains("Unable to connect", StringComparison.OrdinalIgnoreCase) ||
                msg.Contains("transient failure", StringComparison.OrdinalIgnoreCase))
                return true;
            ex = ex.InnerException;
        }
        return false;
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<UsuarioResponseDto>> GetUsuario(int id)
    {
        var usuario = await _context.Usuarios.FindAsync(id);
        if (usuario == null) return NotFound();
        return Ok(MapToDto(usuario));
    }

    [HttpPost]
    public async Task<ActionResult<UsuarioResponseDto>> PostUsuario(RegistroUsuarioDto dto)
    {
        if (await _context.Usuarios.AnyAsync(u => u.Email == dto.Email))
            return BadRequest(new { mensaje = "Ya existe un usuario con ese email." });

        if (await _context.Usuarios.AnyAsync(u => u.NombreUsuario == dto.NombreUsuario))
            return BadRequest(new { mensaje = "Ya existe un usuario con ese nombre de usuario." });

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

        return CreatedAtAction(nameof(GetUsuario), new { id = usuario.Id }, MapToDto(usuario));
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> PutUsuario(int id, UsuarioResponseDto dto)
    {
        if (id != dto.Id) return BadRequest();
        var usuario = await _context.Usuarios.FindAsync(id);
        if (usuario == null) return NotFound();

        usuario.Nombre = dto.Nombre;
        usuario.Apellido = dto.Apellido;
        usuario.Email = dto.Email;
        usuario.NombreUsuario = dto.NombreUsuario;
        usuario.Activo = dto.Activo;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!await _context.Usuarios.AnyAsync(e => e.Id == id)) return NotFound();
            throw;
        }

        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteUsuario(int id)
    {
        var usuario = await _context.Usuarios.FindAsync(id);
        if (usuario == null) return NotFound();
        _context.Usuarios.Remove(usuario);
        await _context.SaveChangesAsync();
        return NoContent();
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
