using Microsoft.AspNetCore.Mvc;
using Backend.Services;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class NotificacionesController : ControllerBase
{
    private readonly NotificacionesHubService _notificaciones;

    public NotificacionesController(NotificacionesHubService notificaciones)
    {
        _notificaciones = notificaciones;
    }

    /// <summary>
    /// Solo en desarrollo: envía una notificación de prueba por WebSocket.
    /// Cuando tengas pedidos, usa NotificacionesHubService desde el controlador de Pedidos.
    /// </summary>
    [HttpPost("test")]
    public async Task<IActionResult> EnviarTest()
    {
        await _notificaciones.NotificarPedidoCreado("Pedido de prueba recibido. Cuando implementes pedidos, aquí llegarán las notificaciones en tiempo real.");
        return Ok(new { enviado = true });
    }
}
