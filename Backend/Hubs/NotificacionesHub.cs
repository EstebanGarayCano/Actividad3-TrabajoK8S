using Microsoft.AspNetCore.SignalR;

namespace Backend.Hubs;

/// <summary>
/// Hub de SignalR para notificaciones en tiempo real (pedidos, etc.).
/// </summary>
public class NotificacionesHub : Hub
{
    public const string NombreRuta = "hubs/notificaciones";

    /// <summary>
    /// Envía a todos los clientes conectados un evento de notificación.
    /// Se usará cuando haya pedidos (ej: "PedidoCreado", "PedidoActualizado").
    /// </summary>
    public async Task EnviarNotificacion(string tipo, string mensaje, object? datos = null)
    {
        await Clients.All.SendAsync("RecibirNotificacion", tipo, mensaje, datos);
    }
}
