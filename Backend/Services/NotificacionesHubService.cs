using Microsoft.AspNetCore.SignalR;
using Backend.Hubs;

namespace Backend.Services;

/// <summary>
/// Servicio para enviar notificaciones en tiempo real a todos los clientes conectados.
/// Inyectar en controladores de Pedidos y llamar cuando se cree/actualice un pedido.
/// </summary>
public class NotificacionesHubService
{
    private readonly IHubContext<NotificacionesHub> _hub;

    public NotificacionesHubService(IHubContext<NotificacionesHub> hub)
    {
        _hub = hub;
    }

    public async Task NotificarPedidoCreado(string mensaje, object? datos = null)
    {
        await _hub.Clients.All.SendAsync("RecibirNotificacion", "PedidoCreado", mensaje, datos);
    }

    public async Task NotificarPedidoActualizado(string mensaje, object? datos = null)
    {
        await _hub.Clients.All.SendAsync("RecibirNotificacion", "PedidoActualizado", mensaje, datos);
    }

    public async Task NotificarPedidoCancelado(string mensaje, object? datos = null)
    {
        await _hub.Clients.All.SendAsync("RecibirNotificacion", "PedidoCancelado", mensaje, datos);
    }

    /// <summary>Envía una notificación genérica (tipo, mensaje, datos).</summary>
    public async Task Notificar(string tipo, string mensaje, object? datos = null)
    {
        await _hub.Clients.All.SendAsync("RecibirNotificacion", tipo, mensaje, datos);
    }
}
