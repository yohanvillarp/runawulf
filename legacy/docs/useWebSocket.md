# 📡 Hook `useWebSocket()`

El hook `useWebSocket()` es un **hook personalizado** que permite acceder de forma global a la conexión WebSocket en la aplicación.

Este hook expone:
- **`socket`** → instancia del WebSocket activo.
- **`lastMessage`** → último mensaje recibido desde el servidor, parseado en JSON.
- (Opcional) Otros valores que tu implementación del hook incluya, como estado de conexión.

---

## 🛠 Uso básico

```tsx
import { useWebSocket } from "../context/useWebSocket";

export default function MiComponente() {
  const { socket, lastMessage } = useWebSocket();

  // Enviar un mensaje al servidor
  const enviarMensaje = () => {
    if (!socket) return;
    socket.send(JSON.stringify({
      type: "saludo",
      payload: { mensaje: "Hola servidor 👋" }
    }));
  };

  // Escuchar mensajes del servidor
  useEffect(() => {
    if (!lastMessage) return;

    console.log("📩 Mensaje recibido:", lastMessage);

    if (lastMessage.type === "respuesta") {
      alert(`El servidor respondió: ${lastMessage.payload}`);
    }
  }, [lastMessage]);

  return (
    <div>
      <button onClick={enviarMensaje}>Enviar saludo</button>
    </div>
  );
}
